// const { getChatHistory, saveChatMessage, findOrCreateConversation, getConversations, createNewConversation } = require("../Models/chatModel");
// const OpenAI = require("openai");

// const openai = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY,
// });

// const getChatHistoryById = async (req, res) => {
//     const { conversationId } = req.params;

//     try {
//         const messages = await getChatHistory(conversationId);
//         res.json({ messages });
//     } catch (error) {
//         console.error('Error fetching chat history:', error);
//         res.status(500).json({ error: "Failed to fetch chat history" });
//     }
// };

// const chatHandler = async (req, res) => {
//     const { prompt, conversationId } = req.body;
//     const userId = req.user; // Replace this with your logic for getting the user ID

//     if (!prompt) {
//         return res.status(400).send("Prompt is empty - it is required");
//     }

//     try {
//         let messages = [
//             { role: "system", content: "You are a helpful Financial Literacy assistant. Only answer questions related to financial literacy and personal finance advice." },
//         ];

//         if (conversationId) {
//             const previousMessages = await getChatHistory(conversationId);
//             previousMessages.forEach((msg) => {
//                 messages.push({ role: "user", content: msg.prompt });
//                 messages.push({ role: "assistant", content: msg.response });
//             });
//         }

//         messages.push({ role: "user", content: prompt });

//         let chatResponse;
//         try {
//             const completion = await openai.chat.completions.create({
//                 model: "gpt-3.5-turbo",
//                 messages: messages,
//             });

//             chatResponse = completion.choices[0].message.content.trim();
//             console.log("Chat response:", chatResponse);
//         } catch (apiError) {
//             console.error(apiError);
//             if (apiError.code === 'insufficient_quota') {
//                 chatResponse = "This is a mocked response. Your OpenAI API quota has been exceeded.";
//             } else {
//                 throw apiError;
//             }
//         }

//         let newConversationId;
//         if (!conversationId) {
//             const conversation = await findOrCreateConversation(userId);
//             newConversationId = conversation.conversationId;
//         } else {
//             newConversationId = conversationId;
//         }
        
//         // Save the chat message (both prompt and response)
//         await saveChatMessage(newConversationId, prompt, chatResponse, userId);
//         console.log(`Saved chat message to conversation ${newConversationId}: User: ${prompt}, Assistant: ${chatResponse}`);

//         res.json({
//             prompt: prompt,
//             response: chatResponse,
//             conversationId: newConversationId,
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send("Something went wrong");
//     }
// };

// const getConversationsByUserId = async (req, res) => {
//     const { userId } = req.params;

//     try {
//         const conversations = await getConversations(userId);
//         res.json({ conversations });
//     } catch (error) {
//         console.error('Error fetching conversations:', error);
//         res.status(500).json({ error: "Failed to fetch conversations" });
//     }
// };

// const startNewConversation = async (req, res) => {
//     const { userId } = req.body;

//     try {
//         const conversation = await createNewConversation(userId);
//         res.json({ conversationId: conversation.conversationId });
//     } catch (error) {
//         console.error('Error starting new conversation:', error);
//         res.status(500).json({ error: "Failed to start new conversation" });
//     }
// };

// module.exports = {
//     chatHandler,
//     getChatHistoryById,
//     getConversationsByUserId,
//     startNewConversation,
// };


const { getChatHistory, saveChatMessage, findOrCreateConversation, getConversations, createNewConversation } = require("../Models/chatModel");
const OpenAI = require("openai");

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const getChatHistoryById = async (req, res) => {
    const { userId, conversationId } = req.params;

    if (!userId || !conversationId) {
        return res.status(400).json({ error: "userId and conversationId are required" });
    }

    try {
        const messages = await getChatHistory(userId, conversationId);
        res.json({ messages });
    } catch (error) {
        console.error('Error fetching chat history:', error);
        res.status(500).json({ error: "Failed to fetch chat history" });
    }
};

const chatHandler = async (req, res) => {
    const { prompt, conversationId, userId } = req.body;

    if (!prompt || !userId) {
        return res.status(400).json({ error: "Prompt and userId are required" });
    }

    try {
        let messages = [
            { role: "system", content: "You are a helpful Financial Literacy assistant. Only answer questions related to financial literacy and personal finance advice." },
        ];

        if (conversationId) {
            const previousMessages = await getChatHistory(userId, conversationId);
            previousMessages.forEach((msg) => {
                messages.push({ role: "user", content: msg.prompt });
                messages.push({ role: "assistant", content: msg.response });
            });
        }

        messages.push({ role: "user", content: prompt });

        let chatResponse;
        try {
            const completion = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: messages,
            });

            chatResponse = completion.choices[0].message.content.trim();
            console.log("Chat response:", chatResponse);
        } catch (apiError) {
            console.error(apiError);
            if (apiError.code === 'insufficient_quota') {
                chatResponse = "This is a mocked response. Your OpenAI API quota has been exceeded.";
            } else {
                throw apiError;
            }
        }

        let newConversationId = conversationId;
        if (!conversationId) {
            const conversation = await findOrCreateConversation(userId);
            newConversationId = conversation.conversationId;
        }

        await saveChatMessage(userId, newConversationId, prompt, chatResponse);
        console.log(`Saved chat message to conversation ${newConversationId}: User: ${prompt}, Assistant: ${chatResponse}`);

        res.json({
            prompt: prompt,
            response: chatResponse,
            conversationId: newConversationId,
        });
    } catch (error) {
        console.error(error);
        console.log('error is:',)
        res.status(500).send("Something went wrong");
    }
};

const getConversationsByUserId = async (req, res) => {
    const { userId } = req.params;

    try {
        const conversations = await getConversations(userId);
        res.json({ conversations });
    } catch (error) {
        console.error('Error fetching conversations:', error);
        res.status(500).json({ error: "Failed to fetch conversations" });
    }
};

const startNewConversation = async (req, res) => {
    const { userId } = req.body;

    try {
        if (!userId) {
            throw new Error("User ID is missing in the request body");
        }

        console.log(`Starting new conversation for user ID: ${userId}`);

        const conversation = await createNewConversation(userId);

        console.log(`New conversation created with ID: ${conversation.conversationId}`);

        res.json({ conversationId: conversation.conversationId });
    } catch (error) {
        console.error('Error starting new conversation:', error);
        res.status(500).json({ error: "Failed to start new conversation", details: error.message });
    }
};

module.exports = {
    chatHandler,
    getChatHistoryById,
    getConversationsByUserId,
    startNewConversation,
};
