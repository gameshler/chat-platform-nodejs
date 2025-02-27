import { Server, Socket } from "socket.io";
import http from "http";
import express from "express";
import { CLIENT_URL } from "../constants/env";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: CLIENT_URL,
  },
});

interface UserSocketMap {
  [key: string]: string;
}

const userSocketMap: UserSocketMap = {};

interface SocketEvents {
  getOnlineUsers: (users: string[]) => void;
}

export function getReceiverSocketId(userId: string): string | undefined {
  return userSocketMap[userId];
}

io.on("connection", (socket: Socket<SocketEvents>) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.auth?.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    if (userId) {
      delete userSocketMap[userId];
    }
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
