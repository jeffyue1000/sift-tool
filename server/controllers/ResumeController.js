const multer = require("multer");
const storage = multer.memoryStorage(); //file uploads get stored in RAM
const upload = multer({ storage: storage });

const uploadResumeConfig = upload.array("resumes"); //middleware to handle resume upload

const uploadResumes = async (req, res) => {
    try {
        console.log("Request received:", req.files);

        res.status(201).json({
            message: "Successfully uploaded resumes",
        });
    } catch (error) {
        console.error("Error occured in uploadResumes", error);
        res.status(500).json({
            message: "Error uploading resumes",
            error: error.message,
        });
    }
};

module.exports = { uploadResumes, uploadResumeConfig };
