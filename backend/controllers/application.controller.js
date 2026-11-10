
import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import { getResumeDownloadUrl } from "../utils/s3.js";

export const applyJob = async (req, res) => {
    try {
        const userId = req.id;
        const jobId = req.params.id;

        if (!jobId) {
            return res.status(400).json({
                message: "Job id is required.",
                success: false
            });
        }

        const existingApplication = await Application.findOne({
            job: jobId,
            applicant: userId
        });

        if (existingApplication) {
            return res.status(400).json({
                message: "You have already applied for this jobs",
                success: false
            });
        }

        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false
            });
        }

        const newApplication = await Application.create({
            job: jobId,
            applicant: userId
        });

        job.applications.push(newApplication._id);
        await job.save();

        return res.status(201).json({
            message: "Job applied successfully.",
            success: true
        });

    } catch (error) {
        console.log(error);
    }
};

export const getAppliedJobs = async (req, res) => {
    try {
        const userId = req.id;

        const application = await Application.find({
            applicant: userId
        }).sort({ createdAt: -1 }).populate({
            path: "job",
            options: { sort: { createdAt: -1 } },
            populate: {
                path: "company",
                options: { sort: { createdAt: -1 } }
            }
        });

        if (!application) {
            return res.status(404).json({
                message: "No applications",
                success: false
            });
        }

        return res.status(200).json({
            application,
            success: true
        });

    } catch (error) {
        console.log(error);
    }
};

// Admin can see how many users have applied for the job
export const getApplicants = async (req, res) => {
    try {
        const jobId = req.params.id;

        const job = await Job.findById(jobId).populate({
            path: "applications",
            options: { sort: { createdAt: -1 } },
            populate: {
                path: "applicant"
            }
        });

        if (!job) {
            return res.status(404).json({
                message: "Job not found.",
                success: false
            });
        }

        return res.status(200).json({
            job,
            success: true
        });

    } catch (error) {
        console.log(error);
    }
};

export const updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const applicationId = req.params.id;

        if (!status) {
            return res.status(400).json({
                message: "status is required",
                success: false
            });
        }

        const application = await Application.findOne({
            _id: applicationId
        });

        if (!application) {
            return res.status(404).json({
                message: "Application not found.",
                success: false
            });
        }

        application.status = status.toLowerCase();
        await application.save();

        return res.status(200).json({
            message: "Status updated successfully",
            success: true
        });

    } catch (error) {
        console.log(error);
    }
};

// Generate a temporary S3 resume download link for an authorized recruiter
export const getApplicantResume = async (req, res) => {
    try {
        const recruiterId = req.id;
        const applicationId = req.params.id;

        const application = await Application.findById(applicationId)
            .populate("applicant")
            .populate({
                path: "job",
                populate: {
                    path: "company"
                }
            });

        if (!application || !application.job || !application.applicant) {
            return res.status(404).json({
                message: "Application not found.",
                success: false
            });
        }

        const company = application.job.company;

        if (
            !company ||
            !company.userId ||
            company.userId.toString() !== recruiterId.toString()
        ) {
            return res.status(403).json({
                message: "You are not authorized to access this resume.",
                success: false
            });
        }

        const resumeKey = application.applicant.profile?.resume;

        if (!resumeKey) {
            return res.status(404).json({
                message: "Resume not found.",
                success: false
            });
        }

        const downloadUrl = await getResumeDownloadUrl(resumeKey);

        return res.status(200).json({
            downloadUrl,
            success: true
        });

    } catch (error) {
        console.error("Resume download error:", error);

        return res.status(500).json({
            message: "Unable to generate resume download link.",
            success: false
        });
    }
};
