const dbConnect = require("../helpers/dbConnect");
const Session = require("../models/sessionModel");

dbConnect();

const createSession = async (req, res) => {
    try {
        const { sessionID, password } = req.body;
        const sessionExists = await Session.findOne({ sessionID: sessionID });

        if (!sessionExists) {
            res.send("Session exists");
        }

        const session = new Session({
            sessionID: sessionID,
            passkey: password,
        });

        await session.save();
        res.status(201).json({
            message: "Session created sucessfully",
        });
    } catch (error) {
        console.error("Error occurred in createSession", error);
        res.send(500).json({
            message: "Error creating session",
            error: error.message,
        });
    }
};

module.exports = { createSession };
