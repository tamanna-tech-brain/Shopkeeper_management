import userModel from "../Models/User.js"
import { authMiddleware } from "../Middleware/userMiddleware.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"; 

export async function register (req, res){
    try{
        const {name, email, password } = req.body;
        const normalizedEmail = email.toLowerCase();
        const existingUser = await userModel.findOne({email: normalizedEmail});
        if(existingUser){
            return res.status(400).json({
                success: false,
                message : "User already exists"
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await userModel.create({
            name,
            email: normalizedEmail,
            password: hashedPassword
        });
        let accessToken = jwt.sign({ id: user._id}, process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 30 * 1000
        });
        res.status(200).json({
            success: true,
            data: user,
            message: "User registered successfully"
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

export async function login (req , res) {
    try{
        const { email , password} = req.body;
        const normalizedEmail = email.toLowerCase();
        const user = await userModel.findOne({email : normalizedEmail});
        if (!user || !(await bcrypt.compare(password, user.password))){
            return res.status(400).json({
                success: false,
                message: "Invalid email or password"
            });
        }
        let accessToken = jwt.sign({
        id: user._id,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d"
        }
    )
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7* 24 * 60 * 60 * 1000
    })
    res.status(200).json({
        success: true,
        data: user,
        token: accessToken,
        message: "User Logged In Success "
    });
    }
    catch(error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

export async function getUserById(req, res) {
    try{
        const {id} = req.params;
        const user = await userModel.findById(id);
        if(!user) {
            return res.status(404).json({
                success: false,
                message: "USer not found"
            });
        }
        res.status(201).json({
            success: true,
            data: user,
            message: "user not found"
        });
    }
    catch(error) {
        res.status(400).json({
            success: false,
            message: error.message
    });
    }
}

export async function updateUserById(req, res) {
    try{
        const {id} = req.params;
        const updateUser = await userModel.findByIdAndUpdate(id, req.body, {new: true});
        if(!updateUser) {
            return res.status(404).json({
                success: true,
                message:"user not found"
            });
        }
        res.status(200).json({
            success: true,
            data: updateUser,
            message: "user updated success"
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

export async function deleteUserById(req, res) {
    try{
        const { id} = req.params;
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
      message: "User updated"
    });
    

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}
