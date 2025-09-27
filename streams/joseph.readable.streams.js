const fs = require("node:fs/promises");

(async () => {
    const FILE_NAME = "./temp.txt";

    const fileHandle = await fs.open(FILE_NAME, "r");
    const stream = fileHandle.createReadStream();

    stream.on("data", (chunk) => {
        console.log(chunk);
    })

    stream.on("end", () => {
        console.log("Reading ended")
    })

})();
