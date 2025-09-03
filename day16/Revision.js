const { Buffer } = require("node:buffer");

Buffer.alloc(5); 
Buffer.allocUnsafe(5); 
Buffer.from("hello"); 
Buffer.from([104,101,108,108,111]); 
Buffer.from("68656c6c6f", "hex"); 
Buffer.from("aGVsbG8=", "base64"); 

const buf = Buffer.from("hello");
buf.length;
Buffer.byteLength("hello", "utf8"); 
Buffer.isBuffer(buf); 
Buffer.compare(Buffer.from("abc"), Buffer.from("abd")); 
Buffer.concat([Buffer.from("hi "), Buffer.from("there")]);

buf.toString("utf8"); 
buf.toString("hex"); 
buf.toString("base64"); 

buf.write("world"); 
buf.write("world", 0, "utf8"); 

buf.copy(Buffer.alloc(5)); 
buf.slice(0, 2); 
buf.equals(Buffer.from("hello")); 
buf.indexOf("l"); 
buf.lastIndexOf("l"); 

buf.readUInt8(0); 
buf.readUInt16LE(0); 
buf.readUInt16BE(0); 
buf.readUInt32LE(0); 
buf.readUInt32BE(0); 

buf.writeUInt8(97, 0); 
buf.writeUInt16LE(300, 1); 
buf.writeUInt16BE(300, 1); 
buf.writeUInt32LE(65536, 0); 
buf.writeUInt32BE(65536, 0); 

Buffer.poolSize;
