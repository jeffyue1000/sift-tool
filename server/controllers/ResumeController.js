const multer = require("multer");
const storage = multer.memoryStorage(); //file uploads get stored in RAM
const upload = multer({ storage: storage });

const uploadResumes = async (req, res) => {
    try {
        console.log("Request received:", req.resumes);

        res.status(201).json({
            message: "Successfully uplaoded resumes",
        });
    } catch (error) {
        console.error("Error occured in uploadResumes", error);
        res.status(500).json({
            message: "Error uploading resumes",
            error: error.message,
        });
    }
};

module.exports = { uploadResumes };
