const express = require("express");
const { register, login, forgotPassword, saveTopics, getTopics, getUser, getUserForSubscribe } = require("../Controllers/authController");

const router = express.Router();

router.post("/register", register); // Route to handle user registration
router.post("/login", login); // Route to handle user login
router.post("/forgot-password", forgotPassword); // Route to handle password reset
router.post("/save-topics", saveTopics); // Route to save user topics
router.get("/get-topics/:userId", getTopics); // Route to get user topics by user ID
router.get("/:userId", getUser); // Route to get user details by user ID

module.exports = router;
