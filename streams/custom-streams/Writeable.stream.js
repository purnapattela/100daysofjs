import { Writable } from "stream";
import fs from "fs";

class CustomWritableStream extends Writable {
    constructor(highWaterMarkValue, filename) {
        super({ highWaterMark: highWaterMarkValue });
        this.filename = filename;
        this.position = 0;
        this.fd = fs.openSync(this.filename, "w");
    }

    _write(chunk, encoding, callback) {
        fs.write(this.fd, chunk, 0, chunk.length, this.position, (err, bytesWritten) => {
            if (err) return callback(err);
            this.position += bytesWritten;
            callback();
        });
    }

    _final(callback) {
        fs.close(this.fd, callback);
    }
}

const writable = new CustomWritableStream(16 * 1024, "./output.txt");

writable.write("Line 1\n");
writable.write("Line 2\n");

writable.end(() => {
    console.log("Finished writing ✅");
});
