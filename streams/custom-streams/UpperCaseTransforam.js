const { Transform } = require("stream");
const fs = require("node:fs")

class UpperCaseTransform extends Transform {
    constructor(readHighWaterMarkValue, writeHighWaterMarkValue, readFileName, writeFileName) {
        super({
            readableHighWaterMark: readHighWaterMarkValue,
            writableHighWaterMark: writeHighWaterMarkValue,
        });

        this.readFileName = readFileName;
        this.writeFileName = writeFileName;
    }

    _transform(chunk, encoding, callback) {
        try {
            const upperChunk = chunk.toString().toUpperCase();
            this.push(upperChunk);
            callback();
        } catch (err) {
            callback(err);
        }
    }
}

const myTransform = new UpperCaseTransform(1024 * 16, 1024 * 16, "./src.txt", "./dest.txt")

const readStream = fs.createReadStream(myTransform.readFileName, {
    highWaterMark: myTransform.readableHighWaterMark,
});

const writeStream = fs.createWriteStream(myTransform.writeFileName, {
    highWaterMark: myTransform.writableHighWaterMark,
});

readStream
    .pipe(myTransform)
    .pipe(writeStream)
    .on("finish", () => {
        console.log("✅ Transformation complete. Check dest.txt");
    })
    .on("error", (err) => {
        console.error("❌ Error during transformation:", err);
    });