const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

// cookie setter helper function
const createAndSetSessionCookie = async (sessionID, isAdmin, res) => {
    try {
        const token = jwt.sign({ sessionID: sessionID, isAdmin: isAdmin }, process.env.TOKEN_SECRET, {
            expiresIn: "1h",
        });
        res.cookie("session", token, {
            httpOnly: true,
            // secure: true,
            sameSite: "Strict",
            maxAge: 3600000, // 1 hour in milliseconds
        });
        return true;
    } catch (error) {
        console.error("Error creating session token", error);
        throw error;
    }
};

module.exports = createAndSetSessionCookie;
