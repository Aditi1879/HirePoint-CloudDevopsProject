import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { profile } from "console";


export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;
        // Validate fullname
if (!fullname) {
    return res.status(400).json({
        message: "Full name is required",
        success: false
    });
}

// Validate email
if (!email) {
    return res.status(400).json({
        message: "Email is required",
        success: false
    });
}
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
if (!emailRegex.test(email)) {
    return res.status(400).json({
        message: "Please provide a valid email address",
        success: false
        
    });
}

// Validate phone number
if (!phoneNumber) {
    return res.status(400).json({
        message: "Phone number is required",
        success: false
    });
}
const phoneRegex = /^[0-9]{10}$/; // Validates a 10-digit phone number
if (!phoneRegex.test(phoneNumber)) {
    return res.status(400).json({
        message: "Phone number must be 10 digits long",
        success: false
    });
}

// Validate password
if (!password) {
    return res.status(400).json({
        message: "Password is required",
        success: false
    });
}
const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/; // Minimum 8 characters, including one letter, one number, and one special character
if (!passwordRegex.test(password)) {
    return res.status(400).json({
        message: "Password must be at least 8 characters long and include a letter, number, and special character",
        success: false
    });
}

// Validate role
if (!role) {
    return res.status(400).json({
        message: "Role is required",
        success: false
    });
}

        const file= req.file;
        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: 'User already exist with this email.',
                success: false,
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
            profile:{
                profilePhoto: cloudResponse.secure_url,
            }
        });
        return res.status(201).json({
            message: "Account created successfully",
            success: true
        });
    } catch (error) {
        console.log(error);

    }
}


export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        };
        
        
        
        
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            })
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect password.",
                success: false,
            })
        };
        //check role is correct or not
        if (role != user.role) {
            return res.status(400).json({
                message: "Account does not exist with current role.",
                success: false,
            })
        };
        const tokenData = {
            userId: user._id
        }
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });
        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }
        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpsOnly: true, sameSite: 'strict' }).json({
            message: `Welcome back ${user.fullname}`,
            user,
            success: true
        })


    } catch (error) {
        console.log(error);
    }
}


export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully",
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}


export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body;
        console.log(fullname, email, phoneNumber, bio, skills);
        const file = req.file;


        //cloudinary comes here later....
        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);


        let skillsArray;
        if(skills){
             skillsArray = skills.split(",");
        }
        const userId = req.id;    //middleware authentication
        let user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({
                message: "User not found.",
                success: false
            })
        }


        //updating data
        if(fullname) user.fullname = fullname
        if(email)  user.email = email
        if(phoneNumber)  user.phoneNumber = phoneNumber
        if(bio)   user.profile.bio = bio
        if(skills)   user.profile.skills = skillsArray

        //resume comes later here.....
        if(cloudResponse){
            user.profile.resume = cloudResponse.secure_url  //save the cloudinary url
            user.profile.resumeOriginalName = file.originalname //save the original  file name
        }


        await user.save();

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }
        return res.status(200).json({
            message:"Profile updated successfully.",
            user,
            success:true
        })

    } catch (error) {
        console.log(error);
    }
}