import express from "express";
import bodyParser from "body-parser";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import connectToDB from "./db/index.js";
import { PORT } from "./const.js";

const app = express();

import signup from "./routes/signup.js";
import signin from "./routes/signin.js";
import morgan from "morgan";

// middlewares
app.use(bodyParser.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://10.53.88.118:5173"], // your frontend
  })
);

//socket
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

app.use(morgan("dev"));

//routes
app.use("/api/signup", signup);
app.use("/api/signin", signin);

//connections
server.listen(PORT, async () => {
  console.log(`Server running at http://localhost:${PORT}`);
  try {
    await connectToDB();
    console.log("Connected to DB");
  } catch (e) {
    console.log("Connection Error");
  }
});
