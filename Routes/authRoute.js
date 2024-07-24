const express = require("express");
const { register, login, forgotPassword, saveTopics, getTopics, getUser } = require("../Controllers/authController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/save-topics", saveTopics);
router.get("/get-topics/:userId", getTopics);
router.get("/user/:userId", getUser);

module.exports = router;
