const net = require("node:net");
const readline = require("node:readline");

const socket = net.createConnection({ port: 8080, host: "127.0.0.1" });

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let username = "";

socket.on("connect", () => {
    console.log("✅ Connected to server!");
    rl.question("> Enter your name: ", (name) => {
        username = name.trim();
        socket.write(username);
        rl.setPrompt("> Message: ");
        rl.prompt();
    });
});

socket.on("data", (data) => {
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
    console.log(data.toString());
    rl.prompt(true);
});

socket.on("end", () => {
    console.log("❌ Server ended connection.");
    rl.close();
});

socket.on("close", () => {
    console.log("🔒 Connection closed.");
    rl.close();
});

socket.on("error", (err) => {
    console.error("⚠️ Error:", err.message);
    rl.close();
});

rl.on("line", (line) => {
    if (line.trim().toLowerCase() === "exit") {
        socket.end();
        rl.close();
        return;
    }
    socket.write(line);
    rl.prompt();
});
