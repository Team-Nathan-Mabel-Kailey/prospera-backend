const express = require('express');
const {
    updateUserName,
    updateUserEmail,
    updateUserSecurityAnswer,
    updateUserLanguage,
    updateUserTopics
} = require('../Controllers/settingsController');

const router = express.Router();

router.put('/name/:userId', updateUserName);
router.put('/email/:userId', updateUserEmail);
router.put('/security-answer/:userId', updateUserSecurityAnswer);
router.put('/language/:userId', updateUserLanguage);
router.put('/topics/:userId', updateUserTopics);

module.exports = router;
