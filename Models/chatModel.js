const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL, // This should be set to your PostgreSQL connection string
        },
    },
});

const getChatHistory = async (userId, conversationId) => {
    console.log(`Getting chat history for userId: ${userId}, conversationId: ${conversationId}`);
    return await prisma.chatbotInteraction.findMany({
        where: { 
            userId: parseInt(userId),
            conversationId: parseInt(conversationId) 
        },
        orderBy: { createdAt: 'asc' },
    });
};

const saveChatMessage = async (userId, conversationId, prompt, response) => {
    try {
        const chatMessage = await prisma.chatbotInteraction.create({
            data: {
                userId: parseInt(userId),
                conversationId: parseInt(conversationId),
                prompt,
                response,
            },
        });
        console.log(`Chat message saved: ${JSON.stringify(chatMessage)}`);
        return chatMessage;
    } catch (error) {
        console.error('Error saving chat message:', error);
        throw error;
    }
};

const findOrCreateConversation = async (userId) => {
    if (!userId) {
        throw new Error("User ID is required to find or create a conversation");
    }

    console.log("Creating conversation for user:", userId);

    // Check if the user exists
    const user = await prisma.user.findUnique({
        where: { userID: parseInt(userId) },
    });

    if (!user) {
        throw new Error(`User with ID ${userId} not found`);
    }

   // Find the highest conversationId for this user
    const highestConversation = await prisma.conversation.findFirst({
    where: { userId: parseInt(userId) },
    orderBy: { conversationId: 'desc' },
    });

    const nextConversationId = highestConversation ? highestConversation.conversationId + 1 : 1;

    let conversation = await prisma.conversation.create({
        data: {
            userId: parseInt(userId),
            conversationId: nextConversationId,
        },
    });

    console.log(`New conversation created: ${JSON.stringify(conversation)}`);
    return conversation;
};


const getConversations = async (userId) => {
    console.log(`Getting conversations for userId: ${userId}`);
    return await prisma.conversation.findMany({
        where: { userId: parseInt(userId) },
        orderBy: { createdAt: 'desc' },
    });
};

const createNewConversation = async (userId) => {
    const user = await prisma.user.findUnique({
        where: { userID: parseInt(userId) },
    });

    if (!user) {
        throw new Error(`User with ID ${userId} not found`);
    }

    // Find the highest conversationId for this user
    const highestConversation = await prisma.conversation.findFirst({
        where: { userId: parseInt(userId) },
        orderBy: { conversationId: 'desc' },
    });

    const nextConversationId = highestConversation ? highestConversation.conversationId + 1 : 1;

    const conversation = await prisma.conversation.create({
        data: {
            userId: parseInt(userId),
            conversationId: nextConversationId,
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
