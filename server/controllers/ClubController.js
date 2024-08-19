const Club = require("../models/clubModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config();

const createAndSetClubCookie = require("../helpers/createAndSetClubCookie");

const loginClub = async (req, res) => {
    try {
        const { clubName, passkey } = req.body;
        const club = await Club.findOne({ name: clubName });

        if (!club) {
            return res.status(401).json({ validLogin: false });
        }

        const passkeyMatch = await bcrypt.compare(passkey, club.passkey);

        if (passkeyMatch) {
            await createAndSetClubCookie(clubName, res);
            res.status(200).json({
                validLogin: true,
                club: club,
            });
        } else {
            res.status(401).json({ validLogin: false });
        }
    } catch (error) {
        console.error("Error occurred in loginClub: ", error);
    }
};
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
            passkey: hashedPassword,
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
                const club = await Club.findOne({ name: decoded.name });

                if (club) {
                    res.status(200).json({ valid: true, club: club });
                } else {
                    res.status(404).json({ valid: false });
                }
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
module.exports = {
    createClub,
    getClubFromToken,
    loginClub,
};
