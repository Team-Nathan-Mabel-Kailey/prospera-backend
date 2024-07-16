const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getChatHistory = async (conversationId) => {
    return await prisma.chatbotInteraction.findMany({
        where: { conversationId: parseInt(conversationId) },  // Ensure conversationId is an integer
        orderBy: { createdAt: "asc" },
    });
};

// const saveChatMessage = async (conversationId, prompt, response, userId) => {
//     await prisma.chatbotInteraction.create({
//         data: {
//         conversationId: parseInt(conversationId),  // Ensure conversationId is an integer
//         prompt,
//         response,
//         userId,
//         },
//     });
// };

const saveChatMessage = async (conversationId, prompt, response, userId) => {
    await prisma.chatbotInteraction.create({
        data: {
            conversationId: parseInt(conversationId),
            prompt,
            response,
            user: {
                connect: { userID: 1 },  // Connect the existing user
            },
        },
    });
};

const findOrCreateConversation = async (conversationId, userId) => {
    let conversation = await prisma.conversation.findUnique({
        where: {
        conversationId: parseInt(conversationId),  // Ensure conversationId is an integer
        },
    });

    if (!conversation) {
        conversation = await prisma.conversation.create({
        data: {
            conversationId: parseInt(conversationId),  // Ensure conversationId is an integer
            userId: 1,
            
        },
        });
    }
    return conversation;
};

module.exports = {
    getChatHistory,
    saveChatMessage,
    findOrCreateConversation,
};
