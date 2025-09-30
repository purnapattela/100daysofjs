import { Buffer } from "node:buffer";
import fs from "node:fs/promises";

const COMMAND_FILE = "./command.txt";

(async () => {
    const COMMAND_FILE_HANDLER = fs.open(COMMAND_FILE, "r");
    const watcher = fs.watch(COMMAND_FILE);

    // hanlde file change
    COMMAND_FILE_HANDLER.on("change", async function () {
        const size = fs.stat(COMMAND_FILE)
        console.log(size)
    })


    // watcher
    for await (const event of watcher) {
        if (event.eventType == "change") {
            COMMAND_FILE_HANDLER.emit('change')
        }
    }
})();
