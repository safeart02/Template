const jwt = require("jsonwebtoken");

const verifyjwt = (req, res, next) => {
  console.log("🔍 Incoming request to:", req.path);

  if (req.path === "/login" || req.path === "/favicon.ico") {
    return next();
  }

  // Get token from session or Authorization header
  const token = req.session.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    req.user = decoded;  // ✅ Attach decoded JWT payload
    req.session.userId = decoded.id;  // ✅ Store userId in session
    console.log("✅ Token verified:", decoded);
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

module.exports = verifyjwt;
