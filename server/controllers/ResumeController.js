const Resume = require("../models/resumeModel");
const Session = require("../models/sessionModel");
const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { calculateSessionStdDev } = require("./SessionController");
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

const shuffle = require("../helpers/shuffleArray");

const getComparisonResumes = async (req, res) => {
    try {
        const { sessionID } = req.query;
        const filteredResumesByComparison = await Resume.find({ sessionID: sessionID, excluded: false }).sort({
            numComparison: 1,
        });

        if (filteredResumesByComparison.length < 2) {
            return res.json({
                message: "Not enough resumes to compare",
            });
        }

        const leftResume = filteredResumesByComparison[0]; //choose a resume that has been compared the least
        const leftElo = leftResume.eloScore;

        const shuffledFilteredResumes = shuffle(filteredResumesByComparison); // Randomly shuffle the matched resumes

        for (let i = 0; i < shuffledFilteredResumes.length; i++) {
            const eloDifference = Math.abs(shuffledFilteredResumes[i].eloScore - leftElo);
            if (
                shuffledFilteredResumes[i]._id.toString() !== leftResume._id.toString() &&
                shuffledFilteredResumes[i].numComparison - leftResume.numComparison <= 5
            ) {
                if (
                    (leftResume.numComparison <= 8 && eloDifference <= 100) ||
                    (leftResume.numComparison <= 16 && eloDifference <= 50) ||
                    eloDifference <= 25
                ) {
                    return res.status(200).json({
                        leftResume: leftResume,
                        rightResume: shuffledFilteredResumes[i],
                    });
                }
            }
        }

        const rightResume = filteredResumesByComparison
            .sort((a, b) => Math.abs(a.eloScore - leftElo) - Math.abs(b.eloScore - leftElo))
            .slice(1)[0];

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
        const resumes = await Resume.find({ sessionID: sessionID }).sort({
            eloScore: -1,
        });
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

        const url = await getSignedUrl(s3, command, { expiresIn: 120 }); //signedURL will last 2 minutes
        res.status(200).json({
            getPdfSuccess: true,
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
        const { leftResume, rightResume, winner, sessionID, user } = req.body;
        const filterSession = { sessionID: sessionID };
        const updateSession = {
            $inc: {
                totalComparisons: 1,
                [`users.${user}`]: 1,
            },
        };
        await Session.findOneAndUpdate(filterSession, updateSession);

        const leftExpected = 1.0 / (1.0 + Math.pow(10, (rightResume.eloScore - leftResume.eloScore) / 400.0));
        const rightExpected = 1.0 / (1.0 + Math.pow(10, (leftResume.eloScore - rightResume.eloScore) / 400.0));

        let ELO_ADJUSTMENT;

        if (leftResume.numComparison <= 8) {
            ELO_ADJUSTMENT = 32;
        } else if (leftResume.numComparison <= 16) {
            ELO_ADJUSTMENT = 24;
        } else {
            ELO_ADJUSTMENT = 16;
        }

        const leftNewScore = leftResume.eloScore + ELO_ADJUSTMENT * ((winner === "leftWin" ? 1 : 0) - leftExpected);
        const rightNewScore = rightResume.eloScore + ELO_ADJUSTMENT * ((winner === "rightWin" ? 1 : 0) - rightExpected);

        const updateLeftResume = { eloScore: leftNewScore, numComparison: leftResume.numComparison + 1 };
        const updateRightResume = { eloScore: rightNewScore, numComparison: rightResume.numComparison + 1 };

        await Resume.findByIdAndUpdate(leftResume._id, updateLeftResume);
        await Resume.findByIdAndUpdate(rightResume._id, updateRightResume);

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

const updateAutoPush = async (req, res) => {
    try {
        const { resume, pushQuota } = req.body;
        const newAuto = resume.auto + 1;
        const filter = { s3Key: resume.s3Key };
        const update = newAuto >= pushQuota ? { auto: newAuto, excluded: true } : { auto: newAuto };
        await Resume.findOneAndUpdate(filter, update);
        res.status(200).json({
            updateAutoSuccess: true,
        });
    } catch (error) {
        console.error("Error occurred in updateAutoPush", error);
        res.status(500).json({
            message: "Error updating auto push",
            error: error.message,
        });
    }
};

const updateAutoReject = async (req, res) => {
    try {
        const { resume, rejectQuota } = req.body;
        const newAuto = resume.auto - 1;
        const filter = { s3Key: resume.s3Key };
        const update = newAuto <= rejectQuota ? { auto: newAuto, excluded: true } : { auto: newAuto };
        await Resume.findOneAndUpdate(filter, update);
        res.status(200).json({
            updateAutoSuccess: true,
        });
    } catch (error) {
        console.error("Error occurred in updateAutoReject", error);
        res.status(500).json({
            message: "Error updating auto reject",
            error: error.message,
        });
    }
};

const updateScore = async (req, res) => {
    try {
        const { id, updateAmount, currentScore } = req.body;
        const filter = { _id: id };
        const update = { eloScore: currentScore + updateAmount };
        await Resume.findOneAndUpdate(filter, update);
        res.status(200).json({
            updateScoreSuccess: true,
        });
    } catch (error) {
        console.error("Error occurred in updateScore: ", error);
        res.status(500).json({
            message: "Error updating score",
            error: error.message,
        });
    }
};

module.exports = {
    uploadResumes,
    getResumePDF,
    getAllResumes,
    getComparisonResumes,
    compareResumes,
    updateAutoPush,
    updateAutoReject,
    updateScore,
};
