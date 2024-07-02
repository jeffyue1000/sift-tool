const jwt = require("jsonwebtoken");

const cookieJwtAuth = (req, res, next) => {
    const token = req.cookies.sessionID;
};
