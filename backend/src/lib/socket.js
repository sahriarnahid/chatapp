import { Server } from 'socket.io';
import http from 'http';

let io;
let userSocketMap = {};

export function initializeSocket(app) {
  const server = http.createServer(app);

  io = new Server(server, {
    cors: {
      origin: true,
      credentials: true,
    },
  });

  io.on('connection', socket => {
    const userId = socket.handshake.query.userId;
    if (userId) userSocketMap[userId] = socket.id;

    io.emit('getOnlineUsers', Object.keys(userSocketMap));

    // 🔹 Handle friend request events
    socket.on('send_friend_request', friend => {
      const friendSocket = userSocketMap[friend._id];
      if (friendSocket)
        io.to(friendSocket).emit('receive_friend_request', friend);
    });

    socket.on('accept_friend_request', friend => {
      const friendSocket = userSocketMap[friend._id];
      if (friendSocket)
        io.to(friendSocket).emit('friend_request_accepted', friend);
    });

    socket.on('sendMessage', message => {
      const receiverSocketId = userSocketMap[message.receiverId];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('receiveMessage', message);
      }
    });

    socket.on('disconnect', () => {
      delete userSocketMap[userId];
      io.emit('getOnlineUsers', Object.keys(userSocketMap));
    });
  });

  return { io, server };
}

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

export { io };
