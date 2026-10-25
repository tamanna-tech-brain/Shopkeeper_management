import connectDB from "./Connection/db.js";
import app from "./app.js";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";

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

    server.listen(PORT, "0.0.0.0", () => {
       console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
    });
};

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  },
});

app.set("io", io);

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Graceful shutdown handling for container platforms (Render, Railway, Docker, etc.)
const gracefulShutdown = (signal) => {
  console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`);
  server.close(async () => {
    console.log("🔒 HTTP & WebSocket server closed.");
    try {
      await mongoose.connection.close(false);
      console.log("💾 MongoDB connection closed.");
    } catch (e) {
      console.error("Error closing MongoDB connection:", e);
    }
    process.exit(0);
  });

  setTimeout(() => {
    console.error("⚠️ Forcefully shutting down due to timeout.");
    process.exit(1);
  }, 10000);
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

export { io };
export default server;

startServer();