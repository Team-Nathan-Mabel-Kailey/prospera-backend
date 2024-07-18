const axios = require('axios');
const { createArticle } = require('../Models/articleModel');

const getFinancialNews = async (req, res) => {
    const category = req.query.category || 'stock-news';
    const language = req.query.lang || 'en';
    const pageSize = req.query.pageSize || 20;
    
    let query;
    switch (category) {
        case 'market-news':
            query = 'market-news';
            break;
        case 'personal-finance':
            query = 'personal-finance';
            break;
        case 'economic-news':
            query = 'economic-news';
            break;
        case 'stock-news':
            query = 'stock-news';
            break;
        default:
            query = 'stock-news';
    }
    
    console.log(`Query: ${query}, Language: ${language}, PageSize: ${pageSize}`);

    try {
        let articles = [];
        if (query === 'stock-news') {
            const options = {
                method: 'GET',
                url: 'https://real-time-finance-data.p.rapidapi.com/market-trends',
                params: {
                    trend_type: 'MARKET_INDEXES',
                    country: 'us',
                    language: language
                },
                headers: {
                    'x-rapidapi-key': process.env.RAPIDAPI_KEY,
                    'x-rapidapi-host': 'real-time-finance-data.p.rapidapi.com'
                }
            };

            const response = await axios.request(options);
            console.log('API Response:', response.data);

            articles = response.data.data.news.map(newsItem => ({
                title: newsItem.article_title,
                content: newsItem.article_url,
                source: newsItem.source,
                url: newsItem.article_url,
                publishedAt: new Date(newsItem.post_time_utc),
                type: query
            }));
        } else {
            const response = await axios.get('https://newsapi.org/v2/everything', {
                params: {
                    q: query,
                    language: language,
                    pageSize: pageSize,
                    apiKey: process.env.NEWS_API_KEY,
                },
            });
            console.log('API Response:', response.data);

            articles = response.data.articles.map(article => ({
                title: article.title,
                content: article.content,
                source: article.source.name,
                url: article.url,
                publishedAt: new Date(article.publishedAt),
                type: query
            }));
        }

        for (const article of articles) {
            console.log('Saving Article:', article.title);
            await createArticle(article.title, article.content, article.source, article.url, article.publishedAt, article.type);
        }

        res.json(articles);
    } catch (error) {
        console.error('Error fetching news articles:', error);
        res.status(500).json({ error: 'Failed to fetch news articles' });
    }
};

module.exports = { getFinancialNews };
