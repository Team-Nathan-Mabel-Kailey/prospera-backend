const { updateUserName, updateUserEmail, updateUserSecurityAnswer, updateUserLanguage, updateUserTopics } = require('../Models/settingsModel');
const bcrypt = require('bcryptjs');

// Handler to update the user's name
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

// Handler to update the user's email
const updateUserEmailHandler = async (req, res) => {
    const { userId } = req.params; // Extract userId from request parameters
    const { email, securityAnswer } = req.body; // Extract email and securityAnswer from request body

    try {
        const updatedUser = await updateUserEmail(userId, email, securityAnswer); // Call model function to update email
        res.status(200).json(updatedUser); // Send updated user data as response
    } catch (error) {
        console.error(error); // Log any errors
        res.status(500).json({ error: 'Error updating user email' }); // Send error response
    }
};

// Handler to update the user's security answer
const updateUserSecurityAnswerHandler = async (req, res) => {
    const { userId } = req.params; // Extract userId from request parameters
    const { email, password, newSecurityAnswer } = req.body; // Extract email, password, and newSecurityAnswer from request body

    try {
        const updatedUser = await updateUserSecurityAnswer(userId, email, password, newSecurityAnswer); // Call model function to update security answer
        res.status(200).json(updatedUser); // Send updated user data as response
    } catch (error) {
        console.error(error); // Log any errors
        res.status(500).json({ error: 'Error updating security answer' }); // Send error response
    }
};

// Handler to update the user's preferred language
const updateUserLanguageHandler = async (req, res) => {
    const { userId } = req.params; // Extract userId from request parameters
    const { preferredLanguage } = req.body; // Extract preferredLanguage from request body

    try {
        const updatedUser = await updateUserLanguage(userId, preferredLanguage); // Call model function to update language preference
        res.status(200).json(updatedUser); // Send updated user data as response
    } catch (error) {
        console.error(error); // Log any errors
        res.status(500).json({ error: 'Error updating language preference' }); // Send error response
    }
};

// Handler to update the user's topic preferences
const updateUserTopicsHandler = async (req, res) => {
    const { userId } = req.params; // Extract userId from request parameters
    const { topics } = req.body; // Extract topics from request body

    try {
        const updatedUser = await updateUserTopics(userId, topics); // Call model function to update topics
        res.status(200).json(updatedUser); // Send updated user data as response
    } catch (error) {
        console.error(error); // Log any errors
        res.status(500).json({ error: 'Error updating topic preferences' }); // Send error response
    }
};

module.exports = {
    updateUserName: updateUserNameHandler,
    updateUserEmail: updateUserEmailHandler,
    updateUserSecurityAnswer: updateUserSecurityAnswerHandler,
    updateUserLanguage: updateUserLanguageHandler,
    updateUserTopics: updateUserTopicsHandler
};
