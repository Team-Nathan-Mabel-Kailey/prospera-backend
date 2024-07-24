const { updateUserName, updateUserEmail, updateUserSecurityAnswer, updateUserLanguage, updateUserTopics } = require('../Models/settingsModel');
const bcrypt = require('bcryptjs');

const updateUserNameHandler = async (req, res) => {
    const { userId } = req.params;
    const { firstName, lastName } = req.body;

    try {
        const updatedUser = await updateUserName(userId, firstName, lastName);
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating user name' });
    }
};

const updateUserEmailHandler = async (req, res) => {
    const { userId } = req.params;
    const { email, securityAnswer } = req.body;

    try {
        const updatedUser = await updateUserEmail(userId, email, securityAnswer);
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating user email' });
    }
};

const updateUserSecurityAnswerHandler = async (req, res) => {
    const { userId } = req.params;
    const { email, password, newSecurityAnswer } = req.body;

    try {
        const updatedUser = await updateUserSecurityAnswer(userId, email, password, newSecurityAnswer);
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating security answer' });
    }
};

const updateUserLanguageHandler = async (req, res) => {
    const { userId } = req.params;
    const { preferredLanguage } = req.body;

    try {
        const updatedUser = await updateUserLanguage(userId, preferredLanguage);
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating language preference' });
    }
};

const updateUserTopicsHandler = async (req, res) => {
    const { userId } = req.params;
    const { topics } = req.body;

    try {
        const updatedUser = await updateUserTopics(userId, topics);
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating topic preferences' });
    }
};

module.exports = {
    updateUserName: updateUserNameHandler,
    updateUserEmail: updateUserEmailHandler,
    updateUserSecurityAnswer: updateUserSecurityAnswerHandler,
    updateUserLanguage: updateUserLanguageHandler,
    updateUserTopics: updateUserTopicsHandler
};
