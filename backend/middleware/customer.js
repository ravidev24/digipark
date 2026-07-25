module.exports = (req, res, next) => {
  const role = req.user?.role || "customer";
  if (role === "customer") {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Customer authorization required." });
  }
};
