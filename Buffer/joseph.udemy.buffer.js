const { Buffer } = require('buffer')
const fs = require("fs")
// const buffer = Buffer.alloc(1e8,0x22)
// buffer.fill(0x33)

// const buf = Buffer.alloc(5, 'a');
// const buf = Buffer.alloc(11, 'aGVsbG8gd29ybGQ=', 'base64');


/**
 * Buffer.alloc -> slow but safe, because if fill the data with '0' it take some time
 * Buffer.allocUnsafe -> unsafe but fast
 */
// const buffer = Buffer.allocUnsafe(10000)

/* Buffer.concat()
 * Buffer.from()
 * Both uses Buffer.allocUnsafe() under the hood
*/


let buffer = Buffer.alloc(10, 0, "utf-8")
for (let i = 0; i < buffer.length; i++) {
    buffer[i] = i + 1;
}

// buffer = Array.from(buffer).join(" ")

fs.writeFileSync("./test.txt", buffer.toString("utf-8"))

const fsContent = fs.readFileSync("./test.txt")
// console.log([...fsContent])


// const buff = Buffer.from("ABCD", "utf-8")
// for (let i = 0; i < buff.length; i++) {
//     console.log(buff.readInt8(i))
// }

const buff = Buffer.alloc(5, 0, "utf-8")

buff.writeInt8("a".charCodeAt(0), 0)
buff.writeInt8("b".charCodeAt(0), 1)
buff.writeInt8("c".charCodeAt(0), 2)
buff.writeInt8("d".charCodeAt(0), 3)
buff.writeInt8("e".charCodeAt(0), 4)

console.log(buff)