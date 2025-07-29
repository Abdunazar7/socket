const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connect", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("newmessage", (m) => {
    const messageData = {
      text: m.text,
      from: socket.id,
      date: new Date(),
    };
    if (m.gr) {
      io.to(m.gr).emit("message", messageData);
    } else {
      io.emit("message", messageData);
    }
  });

  socket.on("join-gr", (groupName) => {
    socket.join(groupName);
    console.log(`${socket.id} User joined group ${groupName}`);
  });

  socket.on("leave-gr", (groupName) => {
    socket.leave(groupName);
    console.log(`${socket.id} User left group ${groupName}`);
  });

  socket.on("private-message", (data) => {
    const privateMessageData = {
      text: data.text,
      from: socket.id,
      date: new Date(),
    };
    io.to(data.to).emit("private-message", privateMessageData);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
  });
});

app.use(cors());

app.get("/", (req, res) => {
  res.json({ message: "home page" });
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});