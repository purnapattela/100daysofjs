import fs from "node:fs/promises"

(async () => {
    console.time("copy")

    const readFile = await fs.open("temp.txt", "r")
    const writeFile = await fs.open("temp.pipe.txt", "w")

    const readStream = readFile.createReadStream()
    const writeStream = writeFile.createWriteStream()


    readStream.pipe(writeStream)

    console.timeEnd("copy")
})()