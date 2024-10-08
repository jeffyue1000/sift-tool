const express = require("express");
const multer = require("multer");

const storage = multer.memoryStorage(); //file uploads get stored in RAM
const upload = multer({ storage: storage });
const uploadResumeConfig = upload.fields([{ name: "resumes" }, { name: "sessionID" }, { name: "duration" }]); //middleware to handle resume upload

const {
    uploadResumes,
    getResumePDF,
    getAllResumes,
    getComparisonResumes,
    compareResumes,
    updateAutoPush,
    updateAutoReject,
    updateScore,
} = require("../controllers/ResumeController");

const router = express.Router();

router.post("/uploadResumes", uploadResumeConfig, uploadResumes);
router.get("/getResumePDF", getResumePDF);
router.get("/getAllResumes", getAllResumes);
router.get("/getComparisonResumes", getComparisonResumes);
router.post("/compareResumes", compareResumes);
router.post("/updateAutoPush", updateAutoPush);
router.post("/updateAutoReject", updateAutoReject);
router.post("/updateScore", updateScore);

module.exports = router;
