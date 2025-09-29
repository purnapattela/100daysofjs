import { Readable } from "stream";
import fs from "fs";

class CustomReadableStream extends Readable {
    constructor(highWaterMarkValue, filename) {
        super({ highWaterMark: highWaterMarkValue });
        this.filename = filename;
        this.fd = fs.openSync(this.filename, "r");
        this.position = 0;
    }

    _read(size) {
        const buffer = Buffer.alloc(size);

        fs.read(this.fd, buffer, 0, size, this.position, (err, bytesRead) => {
            if (err) {
                this.destroy(err);
                return;
            }

            if (bytesRead > 0) {
                this.position += bytesRead;
                this.push(buffer.slice(0, bytesRead));
            } else {
                fs.close(this.fd, () => { });
                this.push(null);
            }
        });
    }

}

const stream = new CustomReadableStream(16 * 1024, "./temp.txt");

stream.on("data", (chunk) => {
    console.log("Received:", chunk.toString());
});

stream.on("end", () => {
    console.log("Finished reading file ✅");
});
