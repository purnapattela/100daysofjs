const fs = require("node:fs/promises")
const { Buffer } = require("node:buffer")

const FILE_NAME = "test.txt";

(async () => {
    const watcher = fs.watch(FILE_NAME)
    const commandFileHadler = await fs.open(FILE_NAME, "r")

    for await (const event of watcher) {
        if (event.eventType === "change") {
            const size = (await commandFileHadler.stat()).size
            const buffer = Buffer.alloc(size);
            const offset = 0
            const position = 0
            const length = buffer.byteLength

            const content = await commandFileHadler.read(buffer, offset, length, position)
            console.log(content)
        }
    }
})()