const express = require("express");
const { uploadResumesMongoDB, uploadResumeConfig } = require("../controllers/ResumeController");

const router = express.Router();

router.post("/uploadResumesMongoDB", uploadResumeConfig, uploadResumesMongoDB);

module.exports = router;
