const Club = require("../models/clubModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");

dotenv.config();

const createAndSetClubCookie = require("../helpers/createAndSetClubCookie");

const createClub = async (req, res) => {
    try {
        const { name, password } = req.body;

        const clubExists = await Club.findOne({ name: name });

        if (clubExists) {
            return res.status(200).json({ clubExists: true });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const club = new Club({
            name: name,
            password: hashedPassword,
        });

        await club.save();

        await createAndSetClubCookie(name, res);

        res.status(200).json({
            creationSuccess: true,
            club: club,
        });
    } catch (error) {
        console.error("Error occurred in createClub: ", error);
        res.status(500).json({
            error: error.message,
        });
    }
};

const getClubFromToken = async (req, res) => {
    try {
        const { encodedClubToken } = req.query;
        if (encodedClubToken) {
            jwt.verify(encodedClubToken, process.env.TOKEN_SECRET, async (err, decoded) => {
                if (err) {
                    console.error("JWT verification error: ", err);
                    return res.status(401).json({ message: "Failed to authenticate token" });
                }
                res.status(200).json({ name: decoded.name });
            });
        } else {
            res.status(401).json({
                message: "User cookie not found",
            });
        }
    } catch (error) {
        console.error("Error occurred in getClubFromToken", error);
        res.status(500).json({
            message: "Error checking user token",
            error: error.message,
        });
    }
};
module.exports = { createClub, getClubFromToken };
