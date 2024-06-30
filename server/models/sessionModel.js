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
});

const Session = mongoose.models.session || mongoose.model("session", sessionSchema);

module.exports = Session;
