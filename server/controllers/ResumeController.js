const dbConnect = require("../helpers/dbConnect");
const Resume = require("../models/resumeModel");
const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const crypto = require("crypto");
const dotenv = require("dotenv");

dotenv.config();

const s3 = new S3Client({
    //accessing sift S3 bucket
    credentials: {
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
    },
    region: process.env.BUCKET_REGION,
});

dbConnect(); //connect to MongoDB

const getResumePDF = async (req, res) => {
    try {
        const { name, gradYear, sessionID } = req.query;

        const resume = await Resume.findOne({ name: name, gradYear: gradYear, sessionID: sessionID });

        if (!resume) {
            res.status(500).json({
                message: "Could not find a resume with that information",
            });
        }

        const s3Key = resume.s3Key;

        const command = new GetObjectCommand({
            Bucket: process.env.BUCKET_NAME,
            Key: s3Key,
        });

        const url = await getSignedUrl(s3, command, { expiresIn: 180 }); //signedURL will last 3 minutes
        res.send(url);
    } catch (error) {
        console.error("Error occurred in getResumePDF", error);
        res.status(500).json({
            message: "Error retrieving resume PDF",
            error: error.message,
        });
    }
};

const uploadResumes = async (req, res) => {
    try {
        //retrieve resumes info from request
        const resumeArray = req.files["resumes"];
        const { sessionID, duration } = req.body;
        const durationMs = parseInt(duration, 10);
        const expireAt = new Date(Date.now() + durationMs);

        //upload each resume to S3, then store metadata in MongoDB
        for (const resume of resumeArray) {
            const randomName = (bytes = 32) => crypto.randomBytes(bytes).toString("hex"); //if resuems have duplicate names, they will still get stored in S3 separately

            const s3Key = `${sessionID}/${randomName()}`;

            const putCommand = new PutObjectCommand({
                Bucket: process.env.BUCKET_NAME,
                Key: s3Key,
                Body: resume.buffer,
                ContentType: resume.mimetype,
            });

            await s3.send(putCommand);

            //write metadata of each resume into MongoDB
            const fileName = resume.originalname.split("_");
            const name = fileName[0].concat(" ", fileName[1]);
            const gradYear = fileName[3].split(".")[0];
            const resumeExists = await Resume.findOne({ name: name, gradYear: gradYear, sessionID: sessionID });
            if (!resumeExists) {
                const newResume = new Resume({
                    sessionID: sessionID,
                    name: name,
                    gradYear: gradYear,
                    s3Key: s3Key,
                    expireAt: expireAt,
                });
                await newResume.save();
            }
        }

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

module.exports = { uploadResumes, getResumePDF };
