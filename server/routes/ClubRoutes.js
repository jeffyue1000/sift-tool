const express = require("express");

const { createClub, getClubFromToken } = require("../controllers/ClubController");

const router = express.Router();

router.post("/createClub", createClub);
router.get("/getClubFromToken", getClubFromToken);

module.exports = router;
