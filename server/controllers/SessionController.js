const Session = require("../models/sessionModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const loginSession = async (req, res) => {
    try {
        const { sessionID, passkey } = req.body;
        const session = await Session.findOne({ sessionID: sessionID });

        if (!session) {
            return res.status(401).send("Session with that ID does not exist");
        }
        const passkeyMatch = await bcrypt.compare(passkey, session.passkey);

        if (passkeyMatch) {
            const sessionData = { sessionID: session.sessionID };
            const token = await jwt.sign(sessionData, process.env.TOKEN_SECRET, { expiresIn: "1h" });
            res.cookie("sessionID", token, {
                httpOnly: true,
                // secure: true,  -> uncomment in production
                sameSite: "Strict",
                maxAge: 3600000, // 1 hour in milliseconds
            });
            res.status(200).send("Logged in successfully");
        } else {
            res.status(401).send("Password is incorrect");
        }
    } catch (error) {
        console.error("Error occurred in loginSession", error);
        res.status(500).json({
            message: "Error logging in",
            error: error.message,
        });
    }
};

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

module.exports = { createSession, loginSession };
