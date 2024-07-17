const axios = require('axios');
const { createArticle } = require('../Models/articleModel');

const getFinancialNews = async (req, res) => {
    const category = req.query.category || 'stock news';
    const language = req.query.lang || 'en';
    const pageSize = req.query.pageSize || 20;
    
    let query;
    switch (category) {
        case 'market news':
            query = 'market-news';
            break;
        case 'personal finance':
            query = 'personal-finance';
            break;
        case 'economic news':
            query = 'economic news';
            break;
        case 'stock news':
            query = 'stock-news';
            break;
        default:
            query = 'stock-news';
    }
    console.log(`Query: ${query}, Language: ${language}, PageSize: ${pageSize}`);

    try {
        const response = await axios.get('https://newsapi.org/v2/everything', {
            params: {
                q: query,
                language: language,
                pageSize: pageSize,
                apiKey: process.env.NEWS_API_KEY,
            },
        });

        console.log('API Response:', response.data);

        const articles = response.data.articles;

        for (const article of articles) {
            console.log('Saving Article:', article.title);
            await createArticle(article.title, article.content);
        }

        res.json(articles);
    } catch (error) {
        console.error('Error fetching news articles:', error);
        res.status(500).json({ error: 'Failed to fetch news articles' });
    }
};

module.exports = { getFinancialNews };
