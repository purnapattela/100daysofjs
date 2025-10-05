const Zeee = require("./Zeee")

const server = new Zeee(3000, () => {
    console.log(`Server running on http://localhost:3000`);
})

server.route('get', "/", (req, res) => {
    res.sendFile("./src/index.html", "text/html")
})

server.route("get", "/data", (req, res) => {
    return res.status(200).send("Hello World")
})
