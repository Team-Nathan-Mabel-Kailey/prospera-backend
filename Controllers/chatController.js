const { getChatHistory, saveChatMessage, findOrCreateConversation } = require("../Models/chatModel");
const OpenAI = require("openai");
const jwt = require("jsonwebtoken");

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const getChatHistoryById = async (req, res) => {
    const { conversationId } = req.params;

    try {
        const messages = await getChatHistory(conversationId);
        res.json({ messages });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch chat history" });
    }
};

const chatHandler = async (req, res) => {
    const { prompt, conversationId } = req.body;
    let userId = 1;

    // const token = req.header('Authorization')?.split(' ')[1];
    // if (token) {
    //     try {
    //         const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //         userId = decoded.userId;
    //     } catch (ex) {
    //         return res.status(401).json({ error: "Invalid token" });
    //     }
    // } else {
    //     return res.status(401).json({ error: "No token provided" });
    // }

    if (!prompt) {
        return res.status(400).send("Prompt is empty - it is required");
    }

    try {
        let messages = [
            { role: "system", content: "You are a helpful Financial Literacy assistant." },
        ];

        if (conversationId) {
            const previousMessages = await getChatHistory(conversationId);
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

        let newConversationId;
        if (!conversationId) {
            const conversation = await findOrCreateConversation(userId);
            newConversationId = conversation.conversationId;
        } else {
            newConversationId = conversationId;
        }
        await saveChatMessage(newConversationId, prompt, chatResponse, userId);

        res.json({
            prompt: prompt,
            response: chatResponse,
            conversationId: newConversationId,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Something went wrong");
    }
};

module.exports = {
    chatHandler,
    getChatHistoryById,
};
