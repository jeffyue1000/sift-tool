const mongoose = require("mongoose");

const clubSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Club name is required"],
    },
    passkey: {
        type: String,
        required: [true, "Password is required"],
    },
    sessionBudget: {
        type: Number,
        default: 10000,
    },
    activeSession: {
        type: Object,
    },
});

clubSchema.index({ name: 1 });

const Club = mongoose.models.club || mongoose.model("club", clubSchema);

module.exports = Club;
