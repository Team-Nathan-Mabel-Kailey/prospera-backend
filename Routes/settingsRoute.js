const express = require('express');
const {
    updateUserName,
    updateUserEmail,
    updateUserSecurityAnswer,
    updateUserLanguage,
    updateUserTopics
} = require('../Controllers/settingsController');

const router = express.Router();

// Route to update user name by user ID
router.put('/name/:userId', updateUserName);

// Route to update user email by user ID
router.put('/email/:userId', updateUserEmail);

// Route to update user security answer by user ID
router.put('/security-answer/:userId', updateUserSecurityAnswer);

// Route to update user language by user ID
router.put('/language/:userId', updateUserLanguage);

// Route to update user topics by user ID
router.put('/topics/:userId', updateUserTopics);

module.exports = router;
