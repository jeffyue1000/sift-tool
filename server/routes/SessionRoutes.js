const express = require("express");

const {
    createSession,
    loginSession,
    logoutSession,
    getSessionFromToken,
    getUserFromToken,
    updateSessionSize,
    getCookies,
    updateUsePushOrReject,
    updateRequireAdminPushOrReject,
    updateRejectOrPushQuota,
    updateCompareTimer,
    updateUseTimer,
    addUser,
    getUsers,
    setUser,
} = require("../controllers/SessionController");

const router = express.Router();

router.post("/createSession", createSession);
router.post("/loginSession", loginSession);
router.get("/logoutSession", logoutSession);
router.get("/getSessionFromToken", getSessionFromToken);
router.get("/getUserFromToken", getUserFromToken);
router.post("/updateSessionSize", updateSessionSize);
router.get("/getCookies", getCookies);
router.post("/updateUsePushOrReject", updateUsePushOrReject);
router.post("/updateRequireAdminPushOrReject", updateRequireAdminPushOrReject);
router.post("/updateRejectOrPushQuota", updateRejectOrPushQuota);
router.post("/updateCompareTimer", updateCompareTimer);
router.post("/updateUseTimer", updateUseTimer);
router.post("/addUser", addUser);
router.get("/getUsers", getUsers);
router.post("/setUser", setUser);

module.exports = router;
