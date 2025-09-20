const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const { SocketAddress } = require("net");

const PORT = 5000;

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", // your frontend
  })
);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("user-message", (message) => {
    io.emit("message", message);
    console.log(message);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

app.get("/", (req, res) => {
  res.send("NEW");
});
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
