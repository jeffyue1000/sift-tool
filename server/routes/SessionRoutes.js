const express = require("express");

const {
    createSession,
    loginSession,
    logoutSession,
    getSessionFromToken,
    updateSessionSize,
    getCookie,
} = require("../controllers/SessionController");

const router = express.Router();

router.post("/createSession", createSession);
router.post("/loginSession", loginSession);
router.get("/logoutSession", logoutSession);
router.get("/getSessionFromToken", getSessionFromToken);
router.post("/updateSessionSize", updateSessionSize);
router.get("/getCookie", getCookie);

module.exports = router;
