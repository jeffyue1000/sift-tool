const express = require("express");
const { uploadResumes, uploadResumeConfig } = require("../controllers/ResumeController");

const router = express.Router();

router.post("/uploadResumes", uploadResumeConfig, uploadResumes);

module.exports = router;
