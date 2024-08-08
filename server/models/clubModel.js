const mongoose = require("mongoose");

const clubSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Club name is required"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    sessionBudget: {
        type: Number,
        default: 0,
    },
    activeSessions: {
        type: Array,
        default: [],
    },
    expiredSessions: {
        type: Array,
        default: [],
    },
});

clubSchema.index({ name: 1 });

const Club = mongoose.models.club || mongoose.model("club", clubSchema);

module.exports = Club;
