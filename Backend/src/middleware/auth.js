const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "phool-basket-dev-secret";

function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Authentication required." });
  }
  try {
    const token = header.slice(7);
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ success: false, message: "Invalid or expired token." });
  }
}

module.exports = { authMiddleware, JWT_SECRET };
