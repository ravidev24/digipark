const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/forgot-password", authController.forgotPassword);
router.post("/logout", auth, authController.logout);
router.get("/profile", auth, authController.getProfile);
router.put("/profile", auth, authController.updateProfile);

router.get("/users", auth, admin, authController.getUsers);
router.post("/users", auth, admin, authController.createUser);
router.put("/users/:id", auth, admin, authController.updateUser);
router.delete("/users/:id", auth, admin, authController.deleteUser);

module.exports = router;
