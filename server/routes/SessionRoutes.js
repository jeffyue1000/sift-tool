const express = require("express");

const {
    createSession,
    loginSession,
    logoutSession,
    getSessionFromToken,
    updateSessionSize,
    hasResumeCapacity,
    updateTotalComparisons,
    getCookie,
    updateUsePushOrReject,
    updateRequireAdminPushOrReject,
    updateRejectOrPushQuota,
} = require("../controllers/SessionController");

const router = express.Router();

router.post("/createSession", createSession);
router.post("/loginSession", loginSession);
router.get("/logoutSession", logoutSession);
router.get("/getSessionFromToken", getSessionFromToken);
router.post("/updateSessionSize", updateSessionSize);
router.get("/hasResumeCapacity", hasResumeCapacity);
router.post("/updateNumComparisons", updateTotalComparisons);
router.get("/getCookie", getCookie);
router.post("/updateUsePushOrReject", updateUsePushOrReject);
router.post("/updateRequireAdminPushOrReject", updateRequireAdminPushOrReject);
router.post("/updateRejectOrPushQuota", updateRejectOrPushQuota);

module.exports = router;
