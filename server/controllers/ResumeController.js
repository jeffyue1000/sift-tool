const multer = require("multer");
const dbConnect = require("../helpers/dbConnect");
const Resume = require("../models/resumeModel");
const storage = multer.memoryStorage(); //file uploads get stored in RAM
const upload = multer({ storage: storage });

const uploadResumeConfig = upload.fields([{ name: "resumes" }, { name: "sessionID" }]); //middleware to handle resume upload

dbConnect(); //connect to MongoDB

const uploadResumesMongoDB = async (req, res) => {
    try {
        const resumeArray = req.files["resumes"];
        const { sessionID, duration } = req.body;
        const durationMs = parseInt(duration, 10);
        const expireAt = new Date(Date.now() + durationMs);

        for (const resume of resumeArray) {
            //write metadata of each resume into MongoDB
            const fileName = resume.originalname.split("_");
            const name = fileName[0].concat(" ", fileName[1]);
            const gradYear = fileName[3].split(".")[0];
            const resumeExists = await Resume.findOne({ name: name, gradYear: gradYear });

            if (!resumeExists) {
                const newResume = new Resume({
                    sessionID: sessionID,
                    name: name,
                    gradYear: gradYear,
                    s3Key: "test", //FILL THIS IN LATER
                    expireAt: expireAt,
                });
                await newResume.save();
            }
        }

        res.status(201).json({
            message: "Successfully uploaded resumes",
        });
    } catch (error) {
        console.error("Error occured in uploadResumesMongoDB", error);
        res.status(500).json({
            message: "Error uploading resumes to MongoDB",
            error: error.message,
        });
    }
};

module.exports = { uploadResumesMongoDB, uploadResumeConfig };
