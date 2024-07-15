//imports the chat model
const { getChatHistory, saveChatMessage } = require("../Models/chatModel");

const OpenAI = require("openai");

// OpenAI API key
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

//handles chat functuin to handle chat prompts and responses
const chatHandler = async (req, res) => {
    const { prompt, conversationId } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
    }

    //connects to openai api
    try {
        let messages = [
            { role: "system", content: "You are a helpful financial literacy assistant." }, 
        ];
        if (conversationId) {
            const previousMessages = await getChatHistory(conversationId);
            previousMessages.forEach((message) => {
                messages.push({ role: "user", content: message.prompt });
                messages.push({ role: "assistant", content: message.response });
            });
        }
        messages.push({ role: "user", content: prompt });

        //interaction with openai api
        const completion = await openai.complete({
            model: "gpt-3.5-turbo-16k",
            messages: messages,
        });

        //processes the response from openai
        const chatResponse = completion.choices[0].message.content.trim();

        //new conversation id and saves the chat message to the database
        const newConversationId = conversationId || Date.now().toString();
        await saveChatMessage(newConversationId, prompt, chatResponse);

        res.json({ response: chatResponse, conversationId: newConversationId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = { chatHandler };
