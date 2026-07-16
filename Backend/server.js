import connectDB from "./Connection/db.js";
import app from "./app.js";
import http from "http";
import { Server } from "socket.io";
import express from "express";


const server = http.createServer(app);

const startServer = async () => {
    await connectDB();

    server.listen(3000, ()=> {
       console.log(" Server running on port 3000");
     
    });
};
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

export { io };
export default server;

startServer();