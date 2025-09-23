import express from "express";
import bodyParser from "body-parser";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import { SocketAddress } from "net";
import connectToDB from "./db/index.js";

const PORT = 5000;

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "http://10.53.88.118:5173"], // your frontend
  })
);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://10.53.88.118:5173"],
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
server.listen(PORT, async () => {
  console.log(`Server running at http://localhost:${PORT}`);
  try {
    await connectToDB().then(console.log("Connected to DB"));
  } catch (e) {
    console.log("Connection Error");
  }
});
