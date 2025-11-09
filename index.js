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
    origin: ["*"],
    credentials: true,
  })
);

//socket
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["*"],
    methods: ["GET", "POST"],
    credentials: true,
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
