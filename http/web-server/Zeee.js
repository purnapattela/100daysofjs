const fs = require("node:fs/promises")
const http = require("node:http")

class Zeee {
    constructor(port, cb) {
        this.server = http.createServer()
        this.server.listen(port, cb)

        this.routes = {}

        this.server.on("request", (req, res) => {
            res.sendFile = async (path, mime) => {
                const fileHandle = await fs.open(path, "r")
                const fileStream = fileHandle.createReadStream()

                res.setHeader("Content-Type", mime)

                fileStream.pipe(res);
                fileStream.on("end", async () => {
                    await fileHandle.close()
                })
            }

            res.status = (statusCode) => {
                res.statusCode = statusCode;
                return res
            }

            res.json = (jsonData) => {
                res.setHeader("Content-Type", "application/json")
                res.end(JSON.stringify(jsonData))
            }

            if (!this.routes[req.method.toLowerCase() + req.url]) {
                return res.status(404).json({ error: `Cannot ${req.method} ${req.url}` })
            }
            return this.routes[req.method.toLowerCase() + req.url](req, res)
        })
    }

    route(method, path, cb) {
        this.routes[method + path] = cb
    }

}


module.exports = Zeee