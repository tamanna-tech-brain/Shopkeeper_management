import connectDB from "./Connection/db.js";
import app from "./app.js";
import http from "http";
import { Server } from "socket.io";
import express from "express";


const server = http.createServer(app);

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    await connectDB();

    server.on("error", (err) => {
        if (err.code === "EADDRINUSE") {
            console.error(`❌ Port ${PORT} is already in use by another process. Run: Stop-Process -Id (Get-NetTCPConnection -LocalPort ${PORT}).OwningProcess -Force`);
            process.exit(1);
        } else {
            console.error("Server error:", err.message);
        }
    });

    server.listen(PORT, ()=> {
       console.log(`🚀 Server running on port ${PORT}`);
    });
};
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.set("io", io);

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

export { io };
export default server;

startServer();