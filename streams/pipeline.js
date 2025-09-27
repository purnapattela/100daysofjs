import fs from "node:fs";
import { pipeline } from "node:stream";
import { promisify } from "node:util";

const pipe = promisify(pipeline);

async function copyFile() {
    try {
        await pipe(
            fs.createReadStream("source.txt"),
            fs.createWriteStream("destination.txt")
        );
        console.log("File copied successfully!");
    } catch (err) {
        console.error("Pipeline failed:", err);
    }
}

copyFile();
