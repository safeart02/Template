const jwt = require("jsonwebtoken");
const verifyjwt = (req, res, next) => {
    const token = req.body.jwt
    if (!token){
        return res.status(401).json({ message: "Unauthorized" });
    }
    next();
};

module.exports = verifyjwt;