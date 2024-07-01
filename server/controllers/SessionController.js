const dbConnect = require("../helpers/dbConnect");
const Session = require("../models/sessionModel");
const bcrypt = require("bcrypt");

dbConnect();

const createSession = async (req, res) => {
    try {
        const { sessionID, password, maxResumes, duration } = req.body;
        const sessionExists = await Session.findOne({ sessionID: sessionID });

        if (sessionExists) {
            return res.status(409).send("Session exists");
        }

        //encrypt password for security
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const session = new Session({
            sessionID: sessionID,
            passkey: hashedPassword,
            maxResumes: maxResumes,
            duration: duration,
        });

        await session.save();
        res.status(201).json({
            message: "Session created sucessfully",
        });
    } catch (error) {
        console.error("Error occurred in createSession", error);
        res.status(500).json({
            message: "Error creating session",
            error: error.message,
        });
    }
};

module.exports = { createSession };
