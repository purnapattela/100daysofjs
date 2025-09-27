import fs from "node:fs/promises"
import { Buffer } from "node:buffer";

(async () => {
    console.time("benchmark");
    const fileHandler = await fs.open("./temp.txt", "w")
    const stream = fileHandler.createWriteStream();

    // const buff = Buffer.alloc(1000000, 0);
    // stream.write(buff) // We are over loading the stream with data

    for (let i = 0; i < 100000000; i++) {
        const buff = Buffer.from(`${i} `, "utf-8")

        if (!stream.write(buff)) {
            await new Promise(resolve => stream.once("drain", resolve))
        }
    }
    await new Promise(resolve => stream.end(resolve));

    // console.log(stream.writableLength) // it shows the current length which is occupied in the internal buffer
    // console.log(stream.writableHighWaterMark)

    stream.on("close", () => {
        fileHandler.close();
        console.timeEnd("benchmark");
    })

    fileHandler.close() // if we close the file it will emit the close event in stream 
})()