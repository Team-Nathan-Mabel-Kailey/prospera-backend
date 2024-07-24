const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Function to Register user - (create - prisma)
const createUser = async (username, email, password, securityAnswer) => {
    return await prisma.user.create({
        data: { username, email, password, securityAnswer },
    });
};

// Function to find user by username
const findUserByUsername = async (username) => {
    return await prisma.user.findUnique({
        where: { username },
    });
};

// Function to find user by email
const findUserByEmail = async (email) => {
    return await prisma.user.findUnique({
        where: { email },
    });
};

// Function to update the user's password by username
const updateUserPasswordByUsername = async (username, newPassword) => {
    return await prisma.user.update({
        where: { username },
        data: { password: newPassword },
    });
};

const updateUserTopics = async (userId, topics) => {
    return await prisma.user.update({
        where: { userID: parseInt(userId) },  // Ensure userID is an integer
        data: { topics: { set: topics }, hasCompletedTopics: true },
    });
};

const getUserById = async (userId) => {
    return await prisma.user.findUnique({
      where: { userID: parseInt(userId) },  // Use userID instead of id
        include: {
            Conversations: true,
            ChatbotInteractions: true,
            Widgets: true,
        }
    });
};

module.exports = {
    createUser,
    findUserByUsername,
    findUserByEmail,
    updateUserPasswordByUsername,
    updateUserTopics,
    getUserById,
};
