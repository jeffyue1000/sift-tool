const express = require("expres");

const { createSession } = require("../controllers/SessionController");

const router = express.Router();

router.post("/createSession", createSession);

module.exports = router;
