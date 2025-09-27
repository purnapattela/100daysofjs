import fs from "node:fs/promises"

(async () => {
    try {
        await fs.mkdir('./temp', { recursive: true })
    } catch (e) {

    }
    const fileHandle = await fs.open('./temp/test.txt', 'w');
    const streams = fileHandle.createWriteStream();
    for (let i = 0; i < 1000000; i++) {
        streams.write(`${i.toString()} `)
    }
})()

/**
 * 
 * It is faster but too much memory consumption
 * this program takes 230MB why ? 
 * because we are not waiting for the drain event and sending the next chunk of 16384 Bytes. we are just flodding the data so the execcss data is stored in ram..
 * 
 */