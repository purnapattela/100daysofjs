const net = require("node:net")
const readline = require("node:readline")

const socket = net.createConnection({ host: "::1", port: 8080 })
const rl = readline.createInterface({ input: process.stdin, output: process.stdout })

socket.on("connect", async () => {
    rl.question("Enter the file path : > ", async (path) => {
        const fs = require("node:fs/promises")
        const pathModule = require("node:path")

        try {
            const fileHandle = await fs.open(path, "r")
            const fileName = pathModule.basename(path)
            const fileSize = (await fileHandle.stat()).size

            socket.write(JSON.stringify({ fileName, fileSize }) + "\n")

            const readStream = fileHandle.createReadStream({ highWaterMark: 16 * 1024 })

            readStream.on("data", (chunk) => {
                if (!socket.write(chunk)) {
                    readStream.pause()
                }
            })

            socket.on("drain", () => {
                readStream.resume()
            })

            readStream.on("end", () => {
                socket.end()
                fileHandle.close()
            })

            readStream.on("error", (err) => {
                console.error("Read error:", err)
                socket.destroy()
                fileHandle.close()
            })
        } catch (err) {
            console.error("Error:", err)
            socket.destroy()
        }

        rl.close()
    })
})

socket.on("error", (err) => {
    console.error("Socket error:", err)
})