const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Function to Register user - (create - prisma)
const createUser = async (username, email, password) => {
    return await prisma.user.create({
        data: { username, email, password },
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

module.exports = {
    createUser,
    findUserByUsername,
    findUserByEmail,
};
