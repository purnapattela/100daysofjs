const { Buffer } = require("node:buffer")

const memoryContainer = Buffer.from("ppc", "utf-8")

console.group("Buffer.from(value,encoding)")

console.log(memoryContainer); //<Buffer 70 70 63>

console.log(memoryContainer.toString("hex")); // 707063

memoryContainer.writeInt8(73, 1); // 73 -> refer to 'I' in ascii

console.log(memoryContainer.toString("utf-8")); // pIc

console.groupEnd("Buffer.from(value,encoding)")

console.group("Buffer.from(size,fill[, encoding])")

const memorySlowPool = Buffer.alloc(5, 0x0, "hex") //   <Buffer 00 00 00 00 00>

console.log(memorySlowPool);

console.groupEnd("Buffer.from(size,fill[, encoding])")

console.group("Buffer.allocUnsafe(size)")

const memoryFastPool = Buffer.allocUnsafe(5).fill(0) // It is fast but not safe
 
for (let buff of memoryFastPool) {
    console.log(buff);
}

console.groupEnd("Buffer.allocUnsafe(size)")