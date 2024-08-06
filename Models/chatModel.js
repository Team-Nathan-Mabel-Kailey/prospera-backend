const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL, // This should be set to your PostgreSQL connection string
        },
    },
});

// Function to get chat history for a specific user and conversation
const getChatHistory = async (userId, conversationId) => {
    return await prisma.chatbotInteraction.findMany({
        where: { 
            userId: parseInt(userId),
            conversationId: parseInt(conversationId) 
        },
        orderBy: { createdAt: 'asc' },
    });
};

// Function to save a chat message for a specific user and conversation
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
        return chatMessage;
    } catch (error) {
        throw error;
    }
};

// Function to find or create a new conversation for a specific user
// may imply that it will find an existing conversation if one exists and create a new one if not
const findOrCreateConversation = async (userId) => {
    if (!userId) {
        throw new Error("User ID is required to find or create a conversation");
    }

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

    const nextConversationId = highestConversation ? highestConversation.conversationId + 1 : 1; // Determine the next conversation ID

    let conversation = await prisma.conversation.create({
        data: {
            userId: parseInt(userId),
            conversationId: nextConversationId,
        },
    });

    return conversation;
};

// Function to get all conversations for a specific user
const getConversations = async (userId) => {
    return await prisma.conversation.findMany({
        where: { userId: parseInt(userId) },
        orderBy: { createdAt: 'desc' },
    });
};


// Function to create a new conversation for a specific user
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

    return conversation;
};

module.exports = {
    getChatHistory,
    saveChatMessage,
    findOrCreateConversation,
    getConversations,
    createNewConversation,
};
