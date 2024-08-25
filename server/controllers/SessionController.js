const Session = require("../models/sessionModel");
const Resume = require("../models/resumeModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { DEFAULT_ELO } = require("../globals");
const dotenv = require("dotenv");

dotenv.config();

const createAndSetSessionCookie = require("../helpers/createAndSetSessionCookie");
const createAndSetUserCookie = require("../helpers/createAndSetUserCookie");

const updateRejectOrPushQuota = async (req, res) => {
    try {
        const { quota, sessionID, type } = req.body;
        const filter = { sessionID: sessionID };
        const update = type === "push" ? { pushQuota: quota } : { rejectQuota: -1 * quota };
        await Session.findOneAndUpdate(filter, update);
        res.status(200).json({
            updateSuccess: true,
        });
    } catch (error) {
        console.error("Error occurred in updateRejectOrPushQuota", error);
        res.status(500).json({
            message: "Error updating rejectQuota or pushQuota",
        });
    }
};
const updateRequireAdminPushOrReject = async (req, res) => {
    try {
        const { checked, sessionID, type } = req.body;
        const filter = { sessionID: sessionID };
        const update = type === "push" ? { pushRequireAdmin: checked } : { rejectRequireAdmin: checked };
        await Session.findOneAndUpdate(filter, update);
        res.status(200).json({
            updateSuccess: true,
        });
    } catch (error) {
        console.error("Error occurred in updateAdminRequiresPushOrReject", error);
        res.status(500).json({
            message: "Error updating requireAdminReject or requireAdminPush",
        });
    }
};
const updateUsePushOrReject = async (req, res) => {
    try {
        const { checked, sessionID, type } = req.body;
        const filter = { sessionID: sessionID };
        const update = type === "push" ? { usePush: checked } : { useReject: checked };
        await Session.findOneAndUpdate(filter, update);
        res.status(200).json({
            updateSuccess: true,
        });
    } catch (error) {
        console.error("Error occurred in updateUsePushOrReject", error);
        res.status(500).json({
            message: "Error updating useReject or usePush",
            error: error.message,
        });
    }
};

const calculateSessionStdDev = async (sessionID) => {
    try {
        const resumes = await Resume.find({ sessionID: sessionID });
        const session = await Session.findOne({ sessionID: sessionID });
        const meanScore = session.totalScore / session.resumeCount;
        let deviations = 0;

        for (let i = 0; i < resumes.length; i++) {
            deviations += Math.pow(resumes[i].eloScore - meanScore, 2);
        }
        return Math.sqrt(deviations / session.resumeCount);
    } catch (error) {
        console.error("Error occurred in calculateSessionStdDev", error);
        res.status(500).json({
            message: "Error calculating standard deviation",
            error: error.message,
        });
    }
};
const getCookies = async (req, res) => {
    try {
        const encodedSessionToken = req.cookies.session;
        const encodedUserToken = req.cookies.user;
        res.status(200).json({
            sessionCookieToken: encodedSessionToken,
            userCookieToken: encodedUserToken,
        });
    } catch (error) {
        console.error("Error occurred in getCookies", error);
        res.status(500).json({
            message: "Error getting cookie",
            error: error.message,
        });
    }
};
const getSessionFromToken = async (req, res) => {
    try {
        const { encodedSessionToken } = req.query;
        jwt.verify(encodedSessionToken, process.env.TOKEN_SECRET, async (err, decoded) => {
            if (err) {
                console.error("JWT Verification Error:", err);
                return res.status(401).json({ message: "Failed to authenticate token" });
            }
            const session = await Session.findOne({
                sessionID: decoded.sessionID,
            });
            if (session) {
                res.status(200).json({
                    valid: true,
                    session: session,
                    isAdmin: decoded.isAdmin,
                });
            } else {
                res.status(404).json({ valid: false });
            }
        });
    } catch (error) {
        console.error("Error occurred in getSessionFromToken", error);
        res.status(500).json({
            message: "Error checking session token",
            valid: false,
            error: error.message,
        });
    }
};

const getUserFromToken = async (req, res) => {
    try {
        const { encodedUserToken } = req.query;

        if (encodedUserToken) {
            jwt.verify(encodedUserToken, process.env.TOKEN_SECRET, (err, decoded) => {
                if (err) {
                    console.error("JWT verification error: ", err);
                    return res.status(401).json({ message: "Failed to authenticate token" });
                }
                res.status(200).json({ user: decoded.user });
            });
        } else {
            res.status(401).json({
                message: "User cookie not found",
            });
        }
    } catch (error) {
        console.error("Error occurred in getUserFromToken", error);
        res.status(500).json({
            message: "Error checking user token",
            error: error.message,
        });
    }
};

const logoutSession = async (req, res) => {
    //logout user by clearing cookies
    res.cookie("session", "", {
        httpOnly: true,
        // secure: true,
        sameSite: "Strict",
        maxAge: 0,
    });
    res.cookie("user", "", {
        httpOnly: true,
        // secure: true,
        sameSite: "Strict",
        maxAge: 0,
    });
    res.status(200).json({ cookieCleared: true });
};

const loginSession = async (req, res) => {
    try {
        const { sessionID, passkey, adminKey } = req.body;
        const session = await Session.findOne({ sessionID: sessionID });

        if (!session) {
            return res.status(401).json({ validLogin: false });
        }

        const passkeyMatch = await bcrypt.compare(passkey, session.passkey);
        const adminKeyMatch = await bcrypt.compare(adminKey, session.adminKey);

        if (passkeyMatch && adminKeyMatch) {
            await createAndSetSessionCookie(sessionID, adminKeyMatch, res);
            res.status(200).json({
                validLogin: true,
                admin: true,
                session: session,
            });
        } else if (passkeyMatch) {
            await createAndSetSessionCookie(sessionID, adminKeyMatch, res);
            res.status(200).json({
                validLogin: true,
                admin: false,
                session: session,
            });
        } else {
            res.status(401).json({ validLogin: false });
        }
    } catch (error) {
        console.error("Error occurred in loginSession", error);
        res.status(500).json({
            message: "Error logging in",
            error: error.message,
        });
    }
};

const createSession = async (req, res) => {
    try {
        const { sessionID, password, adminKey, maxResumes, duration } = req.body;
        const sessionExists = await Session.findOne({ sessionID: sessionID });

        if (sessionExists) {
            return res.status(200).json({ sessionExists: true });
        }

        //encrypt keys for security
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const hashedAdminKey = await bcrypt.hash(adminKey, salt);
        const expireAt = new Date(Date.now() + duration * 7 * 24 * 60 * 60 * 1000); //duration in weeks
        const session = new Session({
            sessionID: sessionID,
            passkey: hashedPassword,
            adminKey: hashedAdminKey,
            maxResumes: maxResumes,
            duration: duration,
            expireAt: expireAt,
        });

        await session.save();

        await createAndSetSessionCookie(sessionID, true, res); //authenticate user upon creating session

        res.status(200).json({
            creationSuccess: true,
            session: session,
        });
    } catch (error) {
        console.error("Error occurred in createSession", error);
        res.status(500).json({
            creationSuccess: false,
            error: error.message,
        });
    }
};

const updateSessionSize = async (req, res) => {
    try {
        const { sessionID } = req.body;
        const resumes = await Resume.find({ sessionID: sessionID });
        const session = await Session.findOne({ sessionID: sessionID }); //consider using findOneandUpdate

        if (resumes.length <= session.maxResumes) {
            session.totalScore += DEFAULT_ELO * (resumes.length - session.resumeCount);
            session.resumeCount = resumes.length;
            await session.save();
            res.status(200).json({
                updateSuccessful: true,
                resumeCount: resumes.length,
            });
        } else {
            //should never run; serves as backup check
            res.json({
                message: "Resume count exceeded maximum",
                resumeCount: resumes.length,
            });
        }
    } catch (error) {
        console.error("Error occurred in updateSessionSize", error);
        res.status(500).json({
            message: "Error occurred updating session size",
            error: error.message,
        });
    }
};
const updateUseTimer = async (req, res) => {
    try {
        const { sessionID, checked } = req.body;
        const filter = { sessionID: sessionID };
        const update = { useTimer: checked };
        await Session.findOneAndUpdate(filter, update);
        res.status(200).json({
            updateSuccess: true,
        });
    } catch (error) {
        console.error("Error occurred in updateUseTimer", error);
        res.status(500).json({
            message: "Error occurred updating useTimer",
            error: error.message,
        });
    }
};
const updateCompareTimer = async (req, res) => {
    try {
        const { sessionID, time } = req.body;
        const filter = { sessionID: sessionID };
        const update = { compareTimer: time };
        await Session.findOneAndUpdate(filter, update);
        res.status(200).json({
            updateSuccess: true,
        });
    } catch (error) {
        console.error("Error occurred in updateCompareTimer", error);
        res.status(500).json({
            message: "Error occurred updating compare timer",
            error: error.message,
        });
    }
};

const addUser = async (req, res) => {
    try {
        const { sessionID, user } = req.body;
        const session = await Session.findOne({ sessionID: sessionID });
        session.users.set(user, 0);
        await session.save();
        await createAndSetUserCookie(user, res);
        res.status(200).json({
            updateSuccessful: true,
            user: user,
        });
    } catch (error) {
        console.error("Error occurred in addUser: ", error);
        res.status(500).json({
            message: "Error occurred adding user",
            error: error.message,
        });
    }
};

const getUsers = async (req, res) => {
    try {
        const { sessionID } = req.query;
        const session = await Session.findOne({ sessionID: sessionID });
        res.status(200).json({
            getSuccess: true,
            users: session.users,
        });
    } catch (error) {
        console.error("Error occurred in getUsers: ", error);
        res.status(500).json({
            message: "Error occurred getting users",
            error: error.message,
        });
    }
};

const setUser = async (req, res) => {
    try {
        const { user } = req.body;
        await createAndSetUserCookie(user, res);
        res.status(200).json({
            updateSuccessful: true,
            user: user,
        });
    } catch (error) {
        console.error("Error occurred in setUser: ", error);
        res.status(500).json({
            message: "Error occurred setting user",
            error: error.message,
        });
    }
};

const saveUpdateAmount = async (req, res) => {
    try {
        const { updateAmount, sessionID } = req.body;
        const filter = { sessionID: sessionID };
        const update = { updateAmount: updateAmount };
        await Session.findOneAndUpdate(filter, update);
        res.status(200).json({
            updateSuccess: true,
        });
    } catch (error) {
        console.error("Error occurred in saveUpdateAmount: ", error);
        res.status(500).json({
            message: "Error occured saving update amount",
            error: error.message,
        });
    }
};

module.exports = {
    createSession,
    loginSession,
    getSessionFromToken,
    getUserFromToken,
    logoutSession,
    updateSessionSize,
    calculateSessionStdDev,
    getCookies,
    updateCompareTimer,
    updateUseTimer,
    updateUsePushOrReject,
    updateRequireAdminPushOrReject,
    updateRejectOrPushQuota,
    addUser,
    getUsers,
    setUser,
    saveUpdateAmount,
};
