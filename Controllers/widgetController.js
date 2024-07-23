const { PrismaClient } = require('@prisma/client');
const axios = require('axios');
const prisma = new PrismaClient();

const getWidgetsByUserId = async (req, res) => {
    const { userId } = req.params;

    try {
        const widgets = await prisma.widget.findMany({
            where: { userId: parseInt(userId) }
        });
        res.status(200).json(widgets);
    } catch (error) {
        console.error(error);  // Log the error for debugging
        res.status(500).json({ error: 'Error retrieving widgets' });
    }
};

const createWidget = async (req, res) => {
    const { userId, type, configuration } = req.body;

    try {
        // Check if the user exists
        const user = await prisma.user.findUnique({
            where: { userID: parseInt(userId) }
        });

        if (!user) {
            return res.status(400).json({ error: 'User does not exist' });
        }

        const newWidget = await prisma.widget.create({
            data: {
                userId: parseInt(userId),
                type,
                configuration
            }
        });
        res.status(201).json(newWidget);
    } catch (error) {
        console.error(error);  // Log the error for debugging
        res.status(500).json({ error: 'Error creating widget' });
    }
};

const deleteWidget = async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.widget.delete({
            where: { id: parseInt(id) }
        });
        res.status(200).json({ message: 'Widget deleted successfully' });
    } catch (error) {
        console.error(error);  // Log the error for debugging
        res.status(500).json({ error: 'Error deleting widget' });
    }
};

const getStockData = async (req, res) => {
    const { symbol, period } = req.query;

    const options = {
        method: 'GET',
        url: 'https://real-time-finance-data.p.rapidapi.com/stock-time-series',
        params: { symbol, period, language: 'en' },
        headers: {
            'x-rapidapi-key': process.env.RAPIDAPI_KEY,
            'x-rapidapi-host': 'real-time-finance-data.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        res.status(200).json(response.data);
    } catch (error) {
        console.error(error);  // Log the error for debugging
        res.status(500).json({ error: 'Error fetching stock data' });
    }
};

module.exports = {
    getWidgetsByUserId,
    createWidget,
    deleteWidget,
    getStockData
};
