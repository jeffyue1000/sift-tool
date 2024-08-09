const express = require("express");

const { createClub, getClubFromToken, loginClub } = require("../controllers/ClubController");

const router = express.Router();

router.post("/createClub", createClub);
router.get("/getClubFromToken", getClubFromToken);
router.post("/loginClub", loginClub);

module.exports = router;
