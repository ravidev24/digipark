const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "superSecretKeyPassword123!";

module.exports = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ message: "No token, authorization denied" });

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user || user.token !== token || !user.tokenExpires || user.tokenExpires < new Date()) {
      return res.status(401).json({ message: "Token has expired or is invalid, please relogin" });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token has expired or is invalid, please relogin" });
  }
};
