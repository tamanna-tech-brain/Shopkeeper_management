import userModel from "../Models/User.js"
import { authMiddleware } from "../Middleware/userMiddleware.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"; 
import { generateAccessToken } from "../services/service.js";


export const registerUser = async (req,res) => {

    try{

        const { name, email, password, role } = req.body;
        const image = req.file?.path || (req.file?.filename ? `/uploads/${req.file.filename}` : req.body.image || "");

        const existingUser = await userModel.findOne({ email });

        if(existingUser){
            return res.status(400).json({
                success:false,
                message:"User already exists"
            });
        }

        const user = await userModel.create({
            name,
            email,
            password,
            role: role || "admin",
            image
        });

        const token = generateAccessToken(user);

        res.status(201).json({
            success:true,
            token,
            data:user
        });

    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
};

export const loginUser = async (req,res) => {

    try{

        const { email,password } = req.body;

        const user = await userModel.findOne({ email });

        if(!user){
            return res.status(400).json({
                success:false,
                message:"Invalid Email"
            });
        }

        const isMatch = await user.comparePassword(password);

        if(!isMatch){
            return res.status(400).json({
                success:false,
                message:"Invalid Password"
            });
        }

        const token = generateAccessToken(user);

        res.status(200).json({
            success:true,
            token,
            data:user
        });

    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
};

export async function getUserById(req, res) {
    try {
        const { id } = req.params;
        const user = await userModel.findById(id).select("-password");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        res.status(200).json({
            success: true,
            data: user,
            message: "User fetched successfully"
        });
    } catch(error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

export async function updateUserById(req, res) {
    try {
        const { id } = req.params;
        const updateData = { ...req.body };
        if (req.file) {
            updateData.image = req.file.path || (req.file.filename ? `/uploads/${req.file.filename}` : undefined);
        }
        if (updateData.password) {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(updateData.password, salt);
        }
        const updateUser = await userModel.findByIdAndUpdate(id, updateData, { new: true }).select("-password");
        if (!updateUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        res.status(200).json({
            success: true,
            data: updateUser,
            message: "User updated successfully"
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

export async function deleteUserById(req, res) {
    try {
        const { id } = req.params;
        const deleteUser = await userModel.findByIdAndDelete(id);
        if (!deleteUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        res.status(200).json({
            success: true,
            data: deleteUser,
            message: "User deleted successfully"
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}
