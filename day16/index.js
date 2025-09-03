const { Readable, Writable } = require("stream")

class MyReadable extends Readable {
  constructor(options) {
    super(options)
    this.data = ["Node", "Streams", "Are", "Powerful"]
    this.index = 0
  }

  _read(size) {
    if (this.index < this.data.length) {
      const chunk = this.data[this.index]
      this.push(chunk)
      this.index++
    } else {
      this.push(null)
    }
  }
}

class MyWritable extends Writable {
  constructor(options) {
    super(options)
    this.stored = []
  }

  _write(chunk, encoding, callback) {
    this.stored.push(chunk.toString())
    console.log("Writable received:", chunk.toString())
    callback()
  }

  _final(callback) {
    console.log("Final data in writable:", this.stored.join(" | "))
    callback()
  }
}

const readable = new MyReadable({ highWaterMark: 2 })
const writable = new MyWritable({ highWaterMark: 2 })

readable.on("data", chunk => {
  console.log("Readable emitted:", chunk.toString())
})

readable.on("end", () => {
  console.log("Readable ended")
})

readable.pipe(writable)
