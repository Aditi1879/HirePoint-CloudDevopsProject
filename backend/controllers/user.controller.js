
import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import {
    uploadResumeToS3,
    getResumeDownloadUrl
} from "../utils/s3.js";

// REGISTER USER
export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;

        if (!fullname) {
            return res.status(400).json({
                message: "Full name is required",
                success: false
            });
        }

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

        if (!phoneNumber) {
            return res.status(400).json({
                message: "Phone number is required",
                success: false
            });
        }

        const phoneRegex = /^[0-9]{10}$/;

        if (!phoneRegex.test(phoneNumber)) {
            return res.status(400).json({
                message: "Phone number must be 10 digits long",
                success: false
            });
        }

        if (!password) {
            return res.status(400).json({
                message: "Password is required",
                success: false
            });
        }

        const passwordRegex =
            /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                message:
                    "Password must be at least 8 characters long and include a letter, number, and special character",
                success: false
            });
        }

        if (!role) {
            return res.status(400).json({
                message: "Role is required",
                success: false
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exist with this email.",
                success: false
            });
        }

        const file = req.file;

        if (!file) {
            return res.status(400).json({
                message: "Profile photo is required.",
                success: false
            });
        }

        // Profile photo continues to use Cloudinary
        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(
            fileUri.content
        );

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
            profile: {
                profilePhoto: cloudResponse.secure_url
            }
        });

        return res.status(201).json({
            message: "Account created successfully",
            success: true
        });

    } catch (error) {
        console.error("Registration error:", error);

        return res.status(500).json({
            message: "Registration failed. Please try again.",
            success: false
        });
    }
};

// LOGIN USER
export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        }

        let user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false
            });
        }

        const isPasswordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect password.",
                success: false
            });
        }

        if (role !== user.role) {
            return res.status(400).json({
                message: "Account does not exist with current role.",
                success: false
            });
        }

        const tokenData = {
            userId: user._id
        };

        const token = jwt.sign(
            tokenData,
            process.env.SECRET_KEY,
            { expiresIn: "1d" }
        );

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        };

        return res.status(200).cookie("token", token, {
            maxAge: 1 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: true,
            sameSite: "none"
        }).json({
            message: `Welcome back ${user.fullname}`,
            user,
            success: true
        });

    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            message: "Login failed. Please try again.",
            success: false
        });
    }
};

// LOGOUT USER
export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", {
            maxAge: 0,
            httpOnly: true,
            secure: true,
            sameSite: "none"
        }).json({
            message: "Logged out successfully",
            success: true
        });

    } catch (error) {
        console.error("Logout error:", error);

        return res.status(500).json({
            message: "Logout failed.",
            success: false
        });
    }
};

// UPDATE USER PROFILE
export const updateProfile = async (req, res) => {
    try {
        const {
            fullname,
            email,
            phoneNumber,
            bio,
            skills
        } = req.body;

        const file = req.file;
        const userId = req.id;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found.",
                success: false
            });
        }

        // Update basic profile information
        if (fullname) {
            user.fullname = fullname;
        }

        if (email) {
            user.email = email;
        }

        if (phoneNumber) {
            user.phoneNumber = phoneNumber;
        }

        if (bio !== undefined) {
            user.profile.bio = bio;
        }

        if (skills !== undefined) {
            user.profile.skills = skills
                ? skills.split(",").map(skill => skill.trim())
                : [];
        }

        // Upload resume to private AWS S3 bucket
        // Profile photos are still handled by Cloudinary.
        if (file) {
            const allowedTypes = [
                "application/pdf",
                "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            ];

            if (!allowedTypes.includes(file.mimetype)) {
                return res.status(400).json({
                    message: "Only PDF, DOC, and DOCX resumes are allowed.",
                    success: false
                });
            }

            const resumeKey = await uploadResumeToS3(file, userId);

            // Store the S3 object key, not a public URL
            user.profile.resume = resumeKey;
            user.profile.resumeOriginalName = file.originalname;
        }

        await user.save();

        const updatedUser = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        };

        return res.status(200).json({
            message: "Profile updated successfully.",
            user: updatedUser,
            success: true
        });

    } catch (error) {
        console.error("Profile update error:", error);

        return res.status(500).json({
            message: "Profile update failed. Please try again.",
            success: false
        });
    }
};

// GET MY RESUME DOWNLOAD URL
export const getMyResumeDownloadUrl = async (req, res) => {
    try {
        const user = await User.findById(req.id);

        if (!user || !user.profile?.resume) {
            return res.status(404).json({
                message: "Resume not found.",
                success: false
            });
        }

        const downloadUrl = await getResumeDownloadUrl(
            user.profile.resume
        );

        return res.status(200).json({
            downloadUrl,
            success: true
        });

    } catch (error) {
        console.error("My resume download error:", error);

        return res.status(500).json({
            message: "Unable to generate resume download link.",
            success: false
        });
    }
};
