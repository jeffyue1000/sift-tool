import mongoose from "mongoose";

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
});

const Session = mongoose.models.session || mongoose.model("session", sessionSchema);

export default Session;
