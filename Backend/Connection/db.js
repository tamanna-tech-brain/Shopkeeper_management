import mongoose from "mongoose";
import config from "../config/config.js";

const connectDB = async () => {
    try {
        console.log(" connecting to DB....");

        await mongoose.connect(config.MONGO_URI)
        console.log("Database connected");
    }catch(error){
        console.log("DB error: ", error.message);

    }
} ;
export default connectDB;