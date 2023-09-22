const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const { PrismaClient } = require("@prisma/client");
const cors = require("cors");

const prisma = new PrismaClient();
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

let usersOnline = [];

io.on("connection", (socket) => {
  console.log("Connection established");
  socket.on("join", (name) => {
    usersOnline[socket.id] = name;
    io.emit("userList", Object.values(usersOnline));
  });
  socket.on("join", (name) => {
    usersOnline[socket.id] = name;
    io.emit("userList", Object.values(usersOnline));
  });

  socket.on("sendMessage", async ({ name, message }) => {
    console.log(message);
    try {
      const savedMessage = await prisma.chat.create({
        data: {
          name: name,
          message: message,
        },
      });

      io.emit("message", {
        user: savedMessage.name,
        text: savedMessage.message,
      });
    } catch (error) {
      console.error("Error saving message:", error);
    }
  });

  socket.on("disconnect", () => {
    delete usersOnline[socket.id];
    io.emit("userList", Object.values(usersOnline));
  });
});

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
