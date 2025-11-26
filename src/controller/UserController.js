import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

    
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already registered",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);


        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: { id: user._id, name: user.name, email: user.email },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};



export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password",
            });
        }

    
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password",
            });
        }

  
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET || "your-secret-key",
            { expiresIn: "7d" }
        );

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: { id: user._id, name: user.name, email: user.email },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};



export const getMe = async (req, res) => {
    try {
        
        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: "User not found" });
        }

        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
