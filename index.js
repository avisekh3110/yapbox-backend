import express from "express";
import bodyParser from "body-parser";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import connectToDB from "./db/index.js";
import { PORT } from "./const.js";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import signup from "./routes/signup.js";
import signin from "./routes/signin.js";
import refresh from "./routes/refresh.js";
import information from "./routes/information.js";
const app = express();

// middlewares
app.use(bodyParser.json());
app.use(cookieParser());

app.use(
  cors({
    origin: [
      "http://10.135.42.118:5173",
      "http://localhost:5173",
      "https://yapbox.vercel.app",
    ],
    credentials: true,
  })
);

//socket
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "http://10.135.42.118:5173",
      "http://localhost:5173",
      "https://yapbox.vercel.app",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
});

const userToSocketId = new Map();
const socketIdToUser = new Map();

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("user-message", (message) => {
    io.emit("message", message);
    console.log(message);
  });

  socket.on("join-room", (data) => {
    const { callId, username } = data;
    userToSocketId.set(username, socket.id);
    socketIdToUser.set(socket.id, username);
    io.to(callId).emit("user-joined", { username, id: socket.id });
    socket.join(callId);
    io.to(socket.id).emit("join-room", { callId, username });
  });

  socket.on("user-call", ({ to, offer }) => {
    io.to(to).emit("incomming-call", { from: socket.id, offer });
  });

  socket.on("call-accepted", ({ to, ans }) => {
    io.to(to).emit("call-accepted", { from: socket.id, ans });
  });

  socket.on("peer-nego-needed", ({ offer, to }) => {
    io.to(to).emit("peer-nego-needed", { from: socket.is, offer });
  });

  socket.on("peer-nego-done", ({ to, ans }) => {
    io.to(to).emit("peer-nego-done", { from: socket.id, ans });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

app.use(morgan("dev"));

//routes
app.use("/", information);
app.use("/api/signup", signup);
app.use("/api/signin", signin);
app.use("/api/refresh", refresh);

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
