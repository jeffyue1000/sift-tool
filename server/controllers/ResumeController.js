const Resume = require("../models/resumeModel");
const Session = require("../models/sessionModel");
const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { calculateSessionStdDev } = require("./SessionController");
const { MAX_ELO_ADJUSTMENT } = require("../globals");
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

const getComparisonResumes = async (req, res) => {
    try {
        const { sessionID } = req.query;
        const resumesByComparison = await Resume.find({ sessionID: sessionID }).sort({ numComparison: 1 });

        if (resumesByComparison.length < 2) {
            return res.status(400).json({
                message: "Not enough resumes to compare",
            });
        }

        const leftResume = resumesByComparison[0]; //choose a resume that has been compared the least
        const leftElo = leftResume.eloScore;
        const sessionStdDev = await calculateSessionStdDev(sessionID);

        const allResumes = await Resume.find({ sessionID: sessionID });

        for (let i = 0; i < allResumes.length; i++) {
            console.log(allResumes[i]);
            if (
                Math.abs(allResumes[i].eloScore - leftElo) <= 0.2 * sessionStdDev &&
                allResumes[i]._id.toString() !== leftResume._id.toString()
            ) {
                return res.status(200).json({
                    leftResume: leftResume,
                    rightResume: allResumes[i],
                });
            }
        }

        const rightResume = resumesByComparison[1]; //fallback in case no suitable resume found

        return res.status(200).json({
            leftResume: leftResume,
            rightResume: rightResume,
        });
    } catch (error) {
        console.error("Error occurred in getComparisonResumes", error);
        res.status(500).json({
            message: "Error getting resumes for comparison",
            error: error.message,
        });
    }
};
const getAllResumes = async (req, res) => {
    try {
        const { sessionID } = req.query;
        const resumes = await Resume.find({ sessionID: sessionID }).sort({ eloScore: 1 });
        res.status(200).json(resumes);
    } catch (error) {
        console.error("Error occurred in getAllResumes", error);
        res.status(500).json({
            message: "Error getting all resumes",
            error: error.message,
        });
    }
};

const getResumePDF = async (req, res) => {
    try {
        const { id } = req.query;
        const resume = await Resume.findById(id);
        // const resume = await Resume.findOne({
        //     name: name,
        //     gradYear: gradYear,
        //     sessionID: sessionID,
        // });

        if (!resume) {
            return res.status(500).json({
                message: "Could not find a resume with that information",
            });
        }

        const s3Key = resume.s3Key;

        const command = new GetObjectCommand({
            Bucket: process.env.BUCKET_NAME,
            Key: s3Key,
        });

        const url = await getSignedUrl(s3, command, { expiresIn: 180 }); //signedURL will last 3 minutes
        res.status(200).json({
            getPdfSucess: true,
            url: url,
        });
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
            const randomName = (bytes = 16) => crypto.randomBytes(bytes).toString("hex"); //if resuems have duplicate names, they will still get stored in S3 separately

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
            const resumeExists = await Resume.findOne({
                name: name,
                gradYear: gradYear,
                sessionID: sessionID,
            });
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

const compareResumes = async (req, res) => {
    try {
        const { leftResume, rightResume, winner, sessionID } = req.body;
        const session = await Session.findOne({ sessionID: sessionID });
        const mongoLeft = await Resume.findById(leftResume._id);
        const mongoRight = await Resume.findById(rightResume._id);

        session.totalComparisons++;
        mongoLeft.numComparison++;
        mongoRight.numComparison++;

        const leftExpectedScore = 1 / (1 + Math.pow(10, (rightResume.eloScore - leftResume.eloScore) / 400));
        const rightExpectedScore = 1 / (1 + Math.pow(10, (leftResume.eloScore - rightResume.eloScore) / 400));
        const leftNewScore =
            leftResume.eloScore + MAX_ELO_ADJUSTMENT * (winner == leftResume ? 1 : 0 - leftExpectedScore);
        const rightNewScore =
            rightResume.eloScore + MAX_ELO_ADJUSTMENT * (winner == rightResume ? 1 : 0 - rightExpectedScore);

        mongoLeft.eloScore = leftNewScore;
        mongoRight.eloScore = rightNewScore;

        await session.save();
        await mongoLeft.save();
        await mongoRight.save();
        res.status(200).json({
            comparisonSuccess: true,
        });
    } catch (error) {
        console.error("Error occurred in compareResumes", error);
        res.status(500).json({
            message: "Error comparing resumes",
            error: error.message,
        });
    }
};

module.exports = { uploadResumes, getResumePDF, getAllResumes, getComparisonResumes, compareResumes };
