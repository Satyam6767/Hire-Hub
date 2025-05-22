const express = require("express");
const Job = require("../models/Job");
const Application = require("../models/Application"); // Import Application model
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/upload"); // Multer config for resume
const mongoose = require("mongoose");

const router = express.Router();

// ✅ Post a Job (Employer Only)
router.post("/post", authMiddleware, async (req, res) => {
    if (req.user.role !== "employer") {
        return res.status(403).json({ message: "Access denied!" });
    }

    const { title, description, company, location, salary } = req.body;

    try {
        const job = new Job({
            title,
            description,
            company,
            location,
            salary,
            employerId: req.user.id
        });
        await job.save();
        res.status(201).json({ message: "Job posted successfully", job });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// ✅ Get All Jobs
router.get("/all", async (req, res) => {
    try {
        const jobs = await Job.find().populate("employerId", "name email");
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// ✅ Apply for a Job using Application model
router.post("/apply/:jobId", authMiddleware, upload.single("resume"), async (req, res) => {
    try {
        const { jobId } = req.params;
        const userId = req.user.id;

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        // Check if already applied
        const alreadyApplied = await Application.findOne({ job: jobId, jobSeeker: userId });
        if (alreadyApplied) {
            return res.status(400).json({ message: "You have already applied for this job" });
        }

        const application = new Application({
            job: jobId,
            jobSeeker: userId,
            resume: req.file ? req.file.path : undefined
        });

        await application.save();

        res.status(200).json({ message: "Application submitted successfully" });
    } catch (error) {
        console.error("Apply error:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

// ✅ Get Jobs the User Applied To
router.get("/applied", authMiddleware, async (req, res) => {
    try {
        const applications = await Application.find({ jobSeeker: req.user.id })
            .populate("job")
            .exec();

        res.json(applications);
    } catch (error) {
        console.error("Error fetching applied jobs:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// ✅ Get Applicants for a Job (Employer Only)
router.get("/:jobId/applicants", authMiddleware, async (req, res) => {
    try {
        const job = await Job.findById(req.params.jobId);
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        if (job.employerId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized access" });
        }

        const applicants = await Application.find({ job: req.params.jobId })
            .populate("jobSeeker", "name email")
            .exec();

        res.status(200).json(applicants);
    } catch (error) {
        console.error("Error fetching applicants:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

// ✅ Employer - Get their posted jobs
router.get('/my-jobs', authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== "employer") {
            return res.status(403).json({ message: "Only employers can view their jobs" });
        }

        const jobs = await Job.find({ employerId: req.user.id });
        res.json(jobs);
    } catch (error) {
        console.error("Error fetching employer jobs:", error);
        res.status(500).json({ message: "Server error" });
    }
});


// ✅ Get Applicants for a Job (Employer Only)
router.get("/:jobId/applicants", authMiddleware, async (req, res) => {
    try {
        const job = await Job.findById(req.params.jobId);
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        if (job.employerId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized access" });
        }

        const applicants = await Application.find({ job: req.params.jobId })
            .populate("jobSeeker", "name email")
            .exec();

        res.status(200).json(applicants);
    } catch (error) {
        console.error("Error fetching applicants:", error);
        res.status(500).json({ message: "Server error", error });
    }
});


// Get single job by ID
router.get("/:jobId", authMiddleware, async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.json(job);
  } catch (error) {
    console.error("Error fetching job:", error);
    res.status(500).json({ message: "Server error", error });
  }
});



module.exports = router;
