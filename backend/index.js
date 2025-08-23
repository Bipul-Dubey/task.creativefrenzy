require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const { connectDatabase } = require("./database");
const userRoutes = require("./services/users.js");
const columnsRoutes = require("./services/columns.js");
const taskRoutes = require("./services/tasks.js");

const app = express();
app.use(cors({ origin: process.env.CLIENT_ORIGIN || "*", credentials: false }));
app.use(express.json());

app.use("/users", userRoutes);
app.use("/columns", columnsRoutes);
app.use("/tasks", taskRoutes);

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: { origin: process.env.CLIENT_ORIGIN || "*", credentials: false },
  transports: ["websocket"],
});

app.set("io", io);

async function start() {
  await connectDatabase(process.env.MONGO_URI);
  httpServer.listen(process.env.PORT || 4000, () => {
    console.log("Server listening on", process.env.PORT || 4000);
  });
}
start();
