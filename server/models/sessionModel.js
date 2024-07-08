const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
    //defines a sifting session
    sessionID: {
        type: String,
        required: [true, "Session ID is required"],
        unique: true,
    },
    passkey: {
        type: String,
        required: [true, "Passkey is required"],
    },
    duration: {
        type: Number,
        default: 2 * 7 * 24 * 60 * 60 * 1000, //two weeks in ms
    },
    maxResumes: {
        type: Number,
        required: [true, "Resume capacity is required"],
    },
    resumeCount: {
        type: Number,
        default: 0,
    },
    totalComparisons: {
        type: Number,
        default: 0,
    },
    totalScore: {
        type: Number,
        default: 0,
    },
});
sessionSchema.index({ sessionID: 1 });

const Session = mongoose.models.session || mongoose.model("session", sessionSchema);

module.exports = Session;
