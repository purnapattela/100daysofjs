# Day 9 : 100 days of Nodejs

* Buffer.alloc(size) → slower, zero-filled → safe
* Buffer.allocUnsafe(size) → faster, uninitialized → may contain garbage
* Always .fill() if using allocUnsafe.
* buf.write(string[, offset, length, encoding]) → write string into buffer
* buf.toString([encoding, start, end]) → convert back to string
* buf.equals(otherBuffer)
* buf.compare(otherBuffer)
* buf.indexOf(value[, byteOffset][, encoding])
* buf.includes(value[, byteOffset][, encoding])
* buf.subarray(start, end) (like slice but faster)