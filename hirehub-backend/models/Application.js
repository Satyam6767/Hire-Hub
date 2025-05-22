const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
        required: true
    },
    jobSeeker: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    resume: {
        type: String // Store file path
    },
    status: {
        type: String,
        enum: ["pending", "reviewed", "accepted", "rejected"],
        default: "pending"
    }
}, { timestamps: true });

module.exports = mongoose.model('Application', ApplicationSchema);
