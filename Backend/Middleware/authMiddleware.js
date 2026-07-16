import jwt from "jsonwebtoken";
import User from "../Models/User.js";

const protect = async (req,res,next) => {

    try{

        let token;

        if(req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ){

            token = req.headers.authorization.split(" ")[1];

            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET
            );

            req.user = await User.findById(decoded.id).select("-password");

            next();

        }else{
            return res.status(401).json({
                success:false,
                message:"Not Authorized"
            });
        }

    }catch(error){
        res.status(401).json({
            success:false,
            message:"Token Failed"
        });
    }
};

export default protect;