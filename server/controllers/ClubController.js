const Club = require("../models/clubModel");
const Session = require("../models/sessionModel");
const bcrypt = require("bcrypt");
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

module.exports = { createClub };
