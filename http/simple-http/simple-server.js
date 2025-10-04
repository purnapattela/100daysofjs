const http = require("node:http")

const server = http.createServer()

const headers = new Map()
headers.set("token", "i-love-you-man")

server.on("request", (req, res) => {
    console.log(`---------------=-------------`)
    console.log(`Method : ${req.method}`)
    console.log(`-----------------------------`)
    console.log(`Endpoint : ${req.url}`)
    console.log(`----------HEADERS------------`)
    console.log(req.headers)
    console.log(`------------------------------`)

    res.setHeaders(headers)
    res.writeHead(200, { "location": "http://localhost:8000/signup" })
    res.end("Data fetched successfully")
})

server.listen(8000, () => {
    console.log(`Server running @ ${server.address().address + "::" + server.address().port}`);
})