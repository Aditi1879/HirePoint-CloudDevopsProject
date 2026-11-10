
import express from "express";

import {
    login,
    logout,
    register,
    updateProfile,
    getMyResumeDownloadUrl
} from "../controllers/user.controller.js";

import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/mutler.js";

const router = express.Router();

router.route("/register").post(singleUpload, register);
router.route("/login").post(login);
router.route("/logout").get(logout);

router.route("/profile/update").post(
    isAuthenticated,
    singleUpload,
    updateProfile
);

// Secure S3 download link for the logged-in user's resume
router.route("/resume/download").get(
    isAuthenticated,
    getMyResumeDownloadUrl
);

export default router;
