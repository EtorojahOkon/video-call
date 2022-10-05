const express = require("express");
const app = express();
const server = require("http").Server(app);
const { ExpressPeerServer } = require("peer");
const peerServer = ExpressPeerServer(server, {
    debug: true,
});
const WebSocketServer = require('ws').Server;
const WebSocket = require("ws")
const wss = new WebSocketServer({ port : 8080 })

app.set("view engine", "ejs");

app.use("/peerjs", peerServer);
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/room", (req, res) => {
    res.render("room");
});

/* Websocket interactions */
wss.on('connection', function connection(ws) {

    ws.on("message", data => {
        let message = JSON.parse(data.toString())
        if (message.status == 'joined') {
            wss.clients.forEach(function each(client) {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({
                        status : 'call',
                        id : message.id,
                        name : message.name
                    }));
                }
            });
        }
    });
      
});

const port = process.env.PORT || 8000

server.listen(port);

