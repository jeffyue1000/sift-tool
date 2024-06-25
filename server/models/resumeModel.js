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
    year: {
        type: Number,
        default: 0,
    },
    s3Key: {
        type: String,
        required: [true, "S3Key is required"],
    },
    rank: {
        type: Number,
        default: 0,
    },
    eloScore: {
        type: Number,
        default: 100,
    },
    numComparison: {
        type: Number,
        default: 0,
    },
});

const Resume = mongoose.models.resume || mongoose.model("resume", resumeSchema);

Resume.createIndex({ sessionID: 1 }); //for faster resume searching

module.exports = Resume;
