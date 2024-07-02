const express = require("express");

const { createSession, loginSession } = require("../controllers/SessionController");

const router = express.Router();

router.post("/createSession", createSession);
router.post("/loginSession", loginSession);

module.exports = router;
