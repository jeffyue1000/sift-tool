const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema({
    //defines a resume
    sessionID: {
        type: String,
        required: [true, "SessionID is required"],
    },
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    gradYear: {
        type: String,
        default: 0,
    },
    s3Key: {
        type: String,
        required: [true, "S3Key is required"],
    },
    eloScore: {
        type: Number,
        default: 100,
    },
    numComparison: {
        type: Number,
        default: 0,
    },
    expireAt: {
        type: Date,
        required: true,
    },
});

resumeSchema.index({ sessionID: 1 }); //for faster resume searching
resumeSchema.index({ eloScore: 1 });

const Resume = mongoose.models.resume || mongoose.model("resume", resumeSchema);

module.exports = Resume;
