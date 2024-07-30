const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL, // This should be set to your PostgreSQL connection string
        },
    },
});

const getChatHistory = async (conversationId) => {
    return await prisma.chatbotInteraction.findMany({
        where: { conversationId: parseInt(conversationId) },
        orderBy: { createdAt: "asc" },
    });
};

const saveChatMessage = async (conversationId, prompt, response, userId) => {
    try {
        const chatMessage = await prisma.chatbotInteraction.create({
            data: {
                conversationId: parseInt(conversationId),
                prompt,
                response,
                userId: parseInt(userId),
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

    // Create the conversation if the user exists
    let conversation = await prisma.conversation.create({
        data: {
            user: {
                connect: { userID: parseInt(userId) },
            },
        },
    });

    return conversation;
};


const getConversations = async (userId) => {
    return await prisma.conversation.findMany({
        where: { userId: parseInt(userId) }, // Ensure userId is being used correctly here
        orderBy: { createdAt: "desc" },
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
