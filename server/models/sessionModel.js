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
    adminKey: {
        type: String,
        required: [true, "Admin key is required"],
    },
    duration: {
        type: Number,
        default: 1, //in weeks
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
    useReject: {
        type: Boolean,
        default: false,
    },
    usePush: {
        type: Boolean,
        default: false,
    },
    rejectRequireAdmin: {
        type: Boolean,
        default: true,
    },
    pushRequireAdmin: {
        type: Boolean,
        default: true,
    },
    rejectQuota: {
        type: Number,
        default: -1,
    },
    pushQuota: {
        type: Number,
        default: 1,
    },
    useTimer: {
        type: Boolean,
        default: false,
    },
    compareTimer: {
        type: Number,
        default: 0,
    },
    expireAt: {
        type: Date,
        required: true,
        expires: 0,
    },
    users: {
        type: Map,
        of: Number,
        default: {},
    },
});

sessionSchema.index({ sessionID: 1 });

const Session = mongoose.models.session || mongoose.model("session", sessionSchema);

module.exports = Session;
