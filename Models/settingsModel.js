const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL, // This should be set to your PostgreSQL connection string
        },
    },
});
const bcrypt = require('bcryptjs');

// Function to get user by ID
const getUserById = async (userId) => {
    return await prisma.user.findUnique({
        where: { userID: parseInt(userId) }
    });
};

// Function to update user first and last name
const updateUserName = async (userId, firstName, lastName) => {
    return await prisma.user.update({
        where: { userID: parseInt(userId) },
        data: { firstName, lastName }
    });
};

// Function to update user email
const updateUserEmail = async (userId, email, securityAnswer) => {
    const user = await getUserById(userId);
    if (user.securityAnswer !== securityAnswer) {
        throw new Error('Incorrect security answer');
    }

    return await prisma.user.update({
        where: { userID: parseInt(userId) },
        data: { email }
    });
};

// Function to update user security answer
const updateUserSecurityAnswer = async (userId, email, password, newSecurityAnswer) => {
    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user || user.userID !== parseInt(userId) || !(await bcrypt.compare(password, user.password))) {
        throw new Error('Invalid email or password');
    }

    return await prisma.user.update({
        where: { userID: parseInt(userId) },
        data: { securityAnswer: newSecurityAnswer }
    });
};

// Function to update user language preference
const updateUserLanguage = async (userId, preferredLanguage) => {
    return await prisma.user.update({
        where: { userID: parseInt(userId) },
        data: { preferredLanguage }
    });
};

// Function to update user topic preferences
const updateUserTopics = async (userId, topics) => {
    return await prisma.user.update({
        where: { userID: parseInt(userId) },
        data: { topics: { set: topics }, hasCompletedTopics: true }
    });
};

module.exports = {
    getUserById,
    updateUserName,
    updateUserEmail,
    updateUserSecurityAnswer,
    updateUserLanguage,
    updateUserTopics
};
