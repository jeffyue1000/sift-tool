const express = require("express");
const { uploadResumes } = require("../controllers/ResumeController");

const router = express.Router();

router.post("/uploadResumes", uploadResumes);

module.exports = router;
