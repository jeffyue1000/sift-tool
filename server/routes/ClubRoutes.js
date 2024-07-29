const express = require("express");

const { createClub } = require("../controllers/ClubController");

const router = express.Router();

router.post("/createClub", createClub);

module.exports = router;
