const http = require("node:http")
const fs = require("node:fs/promises")

const server = http.createServer()

server.on("request", async (request, response) => {
    if (request.url == "/" && request.method == "GET") {
        const indexFile = await fs.open("./src/index.html", "r")
        const indexStream = indexFile.createReadStream()

        response.setHeader("Content-Type", "text/html")
        response.statusCode = 200

        indexStream.pipe(response)

        indexStream.on("close", async () => {
            await indexFile.close()
        })
    }

    if (request.url == "/style.css" && request.method == "GET") {
        const indexFile = await fs.open("./src/style.css", "r")
        const indexStream = indexFile.createReadStream()

        response.setHeader("Content-Type", "text/css")
        response.statusCode = 200

        indexStream.pipe(response)

        indexStream.on("close", async () => {
            await indexFile.close()
        })
    }

    if (request.url == "/script.js" && request.method == "GET") {
        const indexFile = await fs.open("./src/script.js", "r")
        const indexStream = indexFile.createReadStream()

        response.setHeader("Content-Type", "text/javascript")
        response.statusCode = 200

        indexStream.pipe(response)

        indexStream.on("close", async () => {
            await indexFile.close()
        })
    }

    if (request.url == "/favicon.ico" && request.method == "GET") {
        const indexFile = await fs.open("./public/favicon.ico", "r")
        const indexStream = indexFile.createReadStream()

        response.setHeader("Content-Type", "image/x-icon")
        response.statusCode = 200

        indexStream.pipe(response)

        indexStream.on("close", async () => {
            await indexFile.close()
        })
    }

    if (request.url == "/redirect") {
        response.end("You are not allowed")
    }

})

server.listen(8000, () => {
    console.log(`Server running @ http://localhost:8000`);
})

/**
 * If you see the above code there is so much repetition
 * to we need to optimize it using the OOPS
 */