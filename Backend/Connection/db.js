import mongoose from "mongoose";
import config from "../config/config.js";

const connectDB = async () => {
    mongoose.connection.on("error", (err) => {
        console.log("Mongoose connection error: ", err.message);
    });

    try {
        console.log("Connecting to DB....");

        await mongoose.connect(config.MONGO_URI);
        console.log("✅ Database connected successfully");
    } catch(error) {
        console.error("❌ DB connection error:", error.message);
        if (error.message.includes("bad auth") || error.message.includes("authentication failed")) {
            console.error("👉 Please verify your username and password in Backend/.env, and check MongoDB Atlas -> Security -> Database Access.");
        } else if (error.message.includes("whitelist") || error.message.includes("timed out")) {
            console.error("👉 Please check MongoDB Atlas -> Security -> Network Access -> Add IP Address (allow 0.0.0.0/0 or your current IP).");
        }
    }
} ;
export default connectDB;