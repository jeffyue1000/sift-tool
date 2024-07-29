const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

// cookie setter helper function
const createAndSetClubCookie = async (club, res) => {
    try {
        const token = jwt.sign({ club: club }, process.env.TOKEN_SECRET, {
            expiresIn: "1h",
        });
        res.cookie("club", token, {
            httpOnly: true,
            // secure: true,
            sameSite: "Strict",
            maxAge: 3600000, // 1 hour in milliseconds
        });
        return true;
    } catch (error) {
        console.error("Error creating club token", error);
        throw error;
    }
};

module.exports = createAndSetClubCookie;
