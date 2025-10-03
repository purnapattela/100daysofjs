const net = require("node:net");

const clients = new Map();

const server = net.createServer((socket) => {
    let username = "";

    socket.on("data", (data) => {
        const message = data.toString().trim();

        if (!username) {
            username = message;
            clients.set(socket, username);
            console.log(`✅ ${username} joined`);
            broadcast(`📩 Welcome ${username}!`, socket);
            return;
        }

        broadcast(`< ${username}: ${message}`, socket);
    });

    socket.on("end", () => {
        if (username) {
            console.log(`❌ ${username} disconnected`);
            clients.delete(socket);
            broadcast(`🔒 ${username} left the chat.`, socket);
        }
    });

    socket.on("close", () => {
        if (clients.has(socket)) {
            console.log(`🔒 ${username} connection closed`);
            clients.delete(socket);
            broadcast(`🔒 ${username} left the chat.`, socket);
        }
    });

    socket.on("error", (err) => {
        console.error("⚠️ Socket error:", err.message);
    });
});

function broadcast(message, sender) {
    for (const [client] of clients) {
        if (client !== sender) {
            client.write(message);
        }
    }
}

server.listen(8080, () => {
    console.log("🚀 Server running on port 8080");
});
