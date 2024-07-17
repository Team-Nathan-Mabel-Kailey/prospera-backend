const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getChatHistory = async (conversationId) => {
    return await prisma.chatbotInteraction.findMany({
        where: { conversationId: parseInt(conversationId) },
        orderBy: { createdAt: "asc" },
    });
};

const saveChatMessage = async (conversationId, prompt, response, userId) => {
    await prisma.chatbotInteraction.create({
        data: {
            conversationId: parseInt(conversationId),
            prompt,
            response,
            userId: userId,
        },
    });
};

const findOrCreateConversation = async (userId) => {
    console.log("Creating conversation for user:", userId);
    let conversation = await prisma.conversation.create({
        data: {
            user: {
                connect: { userID: userId },
            }
        },
    });
    return conversation;
};

module.exports = {
    getChatHistory,
    saveChatMessage,
    findOrCreateConversation,
};
