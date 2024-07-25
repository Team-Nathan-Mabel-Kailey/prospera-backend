const express = require("express");
const { register, login, forgotPassword, saveTopics, getTopics, getUser, updateUserProfile } = require("../Controllers/authController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/save-topics", saveTopics);
router.get("/get-topics/:userId", getTopics);
router.get("/:userId", getUser);
router.put("/:userId", updateUserProfile);

module.exports = router;
