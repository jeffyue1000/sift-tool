const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

// cookie setter helper function
const createAndSetUserCookie = async (user, res) => {
    try {
        const token = jwt.sign({ user: user }, process.env.TOKEN_SECRET, {
            expiresIn: "1h",
        });
        res.cookie("user", token, {
            httpOnly: true,
            // secure: true,
            sameSite: "Strict",
            maxAge: 3600000, // 1 hour in milliseconds
        });
        return true;
    } catch (error) {
        console.error("Error creating user token", error);
        throw error;
    }
};

module.exports = createAndSetUserCookie;
