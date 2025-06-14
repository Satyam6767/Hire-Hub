const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        company: { type: String, required: true },
        location: { type: String, required: true },
        salary: { type: String, default: "Not specified" },
        employerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
        // ❌ Removed applicants array
    },
    { timestamps: true }
);

module.exports = mongoose.model("Job", JobSchema);
