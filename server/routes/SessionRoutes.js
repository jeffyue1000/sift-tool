const express = require("express");

const { createSession, loginSession, logoutSession, getSessionFromToken } = require("../controllers/SessionController");

const router = express.Router();

router.post("/createSession", createSession);
router.post("/loginSession", loginSession);
router.get("/logoutSession", logoutSession);
router.get("/getSessionFromToken", getSessionFromToken);

module.exports = router;
