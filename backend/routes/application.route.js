
import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";

import {
    applyJob,
    getApplicants,
    getAppliedJobs,
    updateStatus,
    getApplicantResume
} from "../controllers/application.controller.js";

const router = express.Router();

router.route("/apply/:id").get(isAuthenticated, applyJob);
router.route("/get").get(isAuthenticated, getAppliedJobs);
router.route("/:id/applicants").get(isAuthenticated, getApplicants);
router.route("/status/:id/update").post(isAuthenticated, updateStatus);

// Generate a secure S3 resume download link for an applicant
router.route("/resume/:id").get(isAuthenticated, getApplicantResume);

export default router;
