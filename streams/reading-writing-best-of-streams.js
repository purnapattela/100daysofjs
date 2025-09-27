import fs from "node:fs/promises";

(async () => {
    const READ_FILE = "./temp.txt";
    const WRITE_FILE = "./temp.copy.txt";

    const readFileHandler = await fs.open(READ_FILE, "r");
    const writeFileHandler = await fs.open(WRITE_FILE, "w");

    const readStream = readFileHandler.createReadStream({ highWaterMark: 16 * 1024 });
    const writeStream = writeFileHandler.createWriteStream({ highWaterMark: 16 * 1024 });

    readStream.on("error", console.error);
    writeStream.on("error", console.error);

    // APPROACH 1   
    /*
    readStream.on("data", async (chunk) => {
        if (!writeStream.write(chunk)) {
            readStream.pause();
            await new Promise((resolve) => writeStream.once("drain", resolve));
            readStream.resume();
        }
    });
    */

    // APPROACH 2
    for await (const chunk of readStream) {

        const numbers = chunk.toString("utf-8").split(" ").strip()

        if (!writeStream.write(chunk)) {
            readStream.pause();
            await new Promise(resolve => writeStream.once("drain", resolve));
            readStream.resume();
        }
    }

    readStream.on("end", async () => {
        writeStream.end();
        await readFileHandler.close();
        await writeFileHandler.close();
        console.log("File copied successfully!");
    });
})();
