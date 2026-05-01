import connectDB from "./Connection/db.js";
import app from "./app.js";

const startServer = async () => {
    await connectDB();

    app.listen(3000, ()=> {
       console.log(" Server running on port 3000");
     
    });
};

startServer();