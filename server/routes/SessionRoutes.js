const express = require("express");

const {
    createSession,
    loginSession,
    logoutSession,
    getSessionFromToken,
    updateSessionSize,
    hasResumeCapacity,
} = require("../controllers/SessionController");

const router = express.Router();

router.post("/createSession", createSession);
router.post("/loginSession", loginSession);
router.get("/logoutSession", logoutSession);
router.get("/getSessionFromToken", getSessionFromToken);
router.post("/updateSessionSize", updateSessionSize);
router.get("/hasResumeCapacity", hasResumeCapacity);

module.exports = router;
