const net = require("node:net")
const path = require("node:path")
const fs = require("node:fs/promises")

const DESTINATION_FOLDER_PATH = path.join(__dirname, "files")
const server = net.createServer(() => { })

let fileHandle, fileStream;

async function getUniqueFilePath(basePath) {
    const dir = path.dirname(basePath)
    const ext = path.extname(basePath)
    const name = path.basename(basePath, ext)

    let counter = 1
    let filePath = basePath

    while (true) {
        try {
            await fs.access(filePath)
            filePath = path.join(dir, `${name}${counter}${ext}`)
            counter++
        } catch {
            return filePath
        }
    }
}

server.on("connection", (socket) => {
    console.log(`New connection`)

    let fileName = ""
    let isFirstChunk = true

    socket.on("data", async (data) => {
        if (isFirstChunk) {
            const newlineIndex = data.indexOf(10)
            const metadata = JSON.parse(data.slice(0, newlineIndex).toString())
            fileName = metadata.fileName

            const filePath = await getUniqueFilePath(path.join(DESTINATION_FOLDER_PATH, fileName))
            fileHandle = await fs.open(filePath, "w")
            fileStream = fileHandle.createWriteStream({ highWaterMark: 16 * 1024 })

            fileStream.on("drain", () => {
                socket.resume()
            })

            const actualData = data.slice(newlineIndex + 1)
            if (actualData.length > 0) {
                if (!fileStream.write(actualData)) {
                    socket.pause()
                }
            }

            isFirstChunk = false
        } else {
            if (!fileStream.write(data)) {
                socket.pause()
            }
        }
    })

    socket.on("end", async () => {
        console.log(`Connection ended`)
        if (fileStream) {
            fileStream.end()
        }
        if (fileHandle) {
            await fileHandle.close()
        }
    })

    socket.on("error", async (err) => {
        console.error("Socket error:", err)
        if (fileStream) {
            fileStream.end()
        }
        if (fileHandle) {
            await fileHandle.close()
        }
    })
})

server.listen(8080, "::1", () => {
    console.log(`Server running @ ${server.address().address}:${server.address().port}`)
})