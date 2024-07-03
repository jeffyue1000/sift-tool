const express = require("express");

const { createSession, loginSession, logoutSession, checkSessionToken } = require("../controllers/SessionController");

const router = express.Router();

router.post("/createSession", createSession);
router.post("/loginSession", loginSession);
router.get("/logoutSession", logoutSession);
router.get("/checkSessionLogin", checkSessionToken);

module.exports = router;
