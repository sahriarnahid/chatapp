import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === "production"
      ? "https://chatapp-1wf7-git-main-nadeen-menacys-projects.vercel.app"
      : "http://localhost:5173",
    credentials: true,
  },
});

const userSocketMap = {};
export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // 🔹 Handle friend request events
  socket.on("send_friend_request", (friend) => {
    const friendSocket = userSocketMap[friend._id];
    if (friendSocket) io.to(friendSocket).emit("receive_friend_request", friend);
  });

  socket.on("accept_friend_request", (friend) => {
    const friendSocket = userSocketMap[friend._id];
    if (friendSocket) io.to(friendSocket).emit("friend_request_accepted", friend);
  });

  socket.on("sendMessage", (message) => {
    const receiverSocketId = userSocketMap[message.receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receiveMessage", message);
    }
  });

  socket.on("disconnect", () => {
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
