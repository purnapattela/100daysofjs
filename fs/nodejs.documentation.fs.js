import { promises as fs, constants, watch } from "node:fs";
import path from "node:path";
import os from "node:os";

(async () => {
    try {
        await fs.cp("sourceDir", "destDir", { recursive: true });
        console.log("Copied sourceDir -> destDir");
    } catch (err) {
        console.error("cp error:", err.message);
    }

    try {
        await fs.copyFile("test.txt", "file.txt");
        console.log("Copied test.txt -> file.txt");
    } catch (err) {
        console.error("copyFile error:", err.message);
    }

    try {
        const tmp = await fs.mkdtemp(path.join(os.tmpdir(), "myprefix-"));
        console.log("Created temp dir:", tmp);
    } catch (err) {
        console.error("mkdtemp error:", err.message);
    }

    try {
        const dir = await fs.opendir(".");
        for await (const dirent of dir) console.log("opendir:", dirent.name);
    } catch (err) {
        console.error("opendir error:", err.message);
    }

    try {
        const files = await fs.readdir(".");
        console.log("readdir:", files);
    } catch (err) {
        console.error("readdir error:", err.message);
    }

    try {
        const watcher = watch(".", (eventType, filename) =>
            console.log("watch:", eventType, filename)
        );
        setTimeout(() => watcher.close(), 5000);
    } catch (err) {
        console.error("watch error:", err.message);
    }

    try {
        await fs.access("file.txt", constants.F_OK);
        console.log("file.txt is accessible");
    } catch (err) {
        console.error("access error:", err.message);
    }
})();
