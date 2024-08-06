const { workflow } = require('@novu/framework');
const { z } = require('zod');
const axios = require('axios');

// Define a workflow named 'hourly-headlines'
const hourlyHeadlinesWorkflow = workflow('hourly-headlines', async ({ step }) => {
    // Function to fetch headlines from the news API
    const fetchHeadlines = async () => {
        const response = await axios.get('https://newsapi.org/v2/everything', {
            params: {
                q: 'finance',
                language: 'en',
                sortBy: 'publishedAt',
                pageSize: 9,
                apiKey: process.env.NEWS_API_KEY,
            },
        });
        return response.data.articles.map((article) => article.title);
    };

    const headlines = await fetchHeadlines();

     // Step to send in-app notification with the fetched headlines
    await step.inApp('send-headlines', async () => {
        return {
            body: `Here are the latest headlines:\n\n${headlines.join('\n')}`,
        };
    });
}, {
    payloadSchema: z.object({}), // Define an empty payload schema using zod
});

module.exports = { hourlyHeadlinesWorkflow };
