const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL, // This should be set to your PostgreSQL connection string
        },
    },
});

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

// Function to update the user's topics
const updateUserTopics = async (userId, topics) => {
    return await prisma.user.update({
        where: { userID: parseInt(userId) },  // Ensure userID is an integer
        data: { topics: { set: topics }, hasCompletedTopics: true },
    });
};

// Function to get a user by user ID
const getUserById = async (userId) => {
    console.log('userid is', userId);
    return await prisma.user.findUnique({
      where: { userID: parseInt(userId) },  // Use userID instead of id
        include: {
            Conversations: true,
            ChatbotInteractions: true,
            Widgets: true
        },
    });
};

// Function to get all users
const getAllUsers = async () => {
    return await prisma.user.findMany({
    select: {
        userID: true,
        email: true,
        firstName: true,
        lastName: true,
    },
    });
};

module.exports = {
    createUser,
    findUserByUsername,
    findUserByEmail,
    updateUserPasswordByUsername,
    updateUserTopics,
    getUserById,
    getAllUsers
};
