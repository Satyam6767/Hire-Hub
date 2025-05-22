const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const Application = require('../models/Application');
const mongoose = require("mongoose");
const router = express.Router();

// 📌 POST: Apply for a Job (Only Job Seekers)
router.post('/apply/:jobId', authMiddleware, async (req, res) => {
    if (req.user.role !== "job_seeker") {
        return res.status(403).json({ message: "Access denied. Only job seekers can apply." });
    }

    const { jobId } = req.params;

    // Validate jobId format
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
        return res.status(400).json({ message: "Invalid Job ID format" });
    }

    try {
        // Check if user already applied
        const alreadyApplied = await Application.findOne({
            job: jobId,
            jobSeeker: req.user.id
        });

        if (alreadyApplied) {
            return res.status(400).json({ message: "You have already applied for this job." });
        }

        const newApplication = new Application({
            job: jobId,
            jobSeeker: req.user.id
        });

        await newApplication.save();
        res.status(201).json({ message: "Application submitted successfully", application: newApplication });
    } catch (error) {
        console.error("Apply Error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// 📌 GET: Employer View Applications for a Job
router.get('/:jobId/applicants', authMiddleware, async (req, res) => {
    const { jobId } = req.params;

    // Validate jobId format
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
        return res.status(400).json({ message: "Invalid Job ID format" });
    }

    try {
        const applications = await Application.find({ job: jobId })
            .populate("jobSeeker", "name email");

        res.json(applications);
    } catch (error) {
        console.error("Fetch Applications Error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// 📌 GET: Job Seeker - Get All Their Applications with Job Details
router.get('/my-applications', authMiddleware, async (req, res) => {
    if (req.user.role !== "job_seeker") {
        return res.status(403).json({ message: "Access denied. Only job seekers can view their applications." });
    }

    try {
        const applications = await Application.find({ jobSeeker: req.user.id })
            .populate({
                path: "job",
                populate: { path: "employerId", select: "name email" }
            });

        res.status(200).json(applications);
    } catch (error) {
        console.error("Fetch User Applications Error:", error);
        res.status(500).json({ message: "Server error" });
    }
});




// Update application status
router.put("/status/:applicationId", authMiddleware, async (req, res) => {
    try {
        const { applicationId } = req.params;
        const { status } = req.body;

        // Optional: Validate status
        const validStatuses = ["pending", "reviewed", "accepted", "rejected"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        // Debug log
        console.log("Updating application:", applicationId, "to status:", status);

        const updated = await Application.findByIdAndUpdate(
            applicationId,
            { status },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ message: "Application not found" });
        }

        res.json({ message: "Status updated", updated });
    } catch (error) {
        console.error("Error updating application status:", error); // 👈 this will help debug
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});



module.exports = router;
