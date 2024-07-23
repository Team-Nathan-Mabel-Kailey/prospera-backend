const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getChatHistory = async (conversationId) => {
    return await prisma.chatbotInteraction.findMany({
        where: { conversationId: parseInt(conversationId) },
        orderBy: { createdAt: "asc" },
    });
};

const saveChatMessage = async (conversationId, prompt, response, userId) => {
    const chatMessage = await prisma.chatbotInteraction.create({
        data: {
            conversationId: parseInt(conversationId),
            prompt,
            response,
            userId: userId,
        },
    });
    console.log(`Chat message saved: ${JSON.stringify(chatMessage)}`);
};

const findOrCreateConversation = async (userId) => {
    console.log("Creating conversation for user:", userId);

    // Check if the user exists
    const user = await prisma.user.findUnique({
        where: { userID: userId },
    });

    if (!user) {
        throw new Error(`User with ID ${userId} not found`);
    }

    // Create the conversation if the user exists
    let conversation = await prisma.conversation.create({
        data: {
            user: {
                connect: { userID: userId },
            },
        },
    });

    return conversation;
};

const getConversations = async (userId) => {
    return await prisma.conversation.findMany({
        where: { userId: parseInt(userId) },
        orderBy: { createdAt: "asc" },
    });
};

const createNewConversation = async (userId) => {
    const user = await prisma.user.findUnique({
        where: { userID: parseInt(userId) },
    });

    if (!user) {
        throw new Error(`User with ID ${userId} not found`);
    }

    const conversation = await prisma.conversation.create({
        data: {
            userId: parseInt(userId),
        },
    });

    console.log(`New conversation created: ${JSON.stringify(conversation)}`);
    return conversation;
};

module.exports = {
    getChatHistory,
    saveChatMessage,
    findOrCreateConversation,
    getConversations,
    createNewConversation,
};
