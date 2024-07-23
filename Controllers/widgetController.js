const { getWidgetsByUserId, createWidget, updateWidgetLayout, updateWidgetContent, deleteWidget } = require('../Models/widgetModel');
const axios = require('axios');

const getWidgetsByUserIdHandler = async (req, res) => {
    const { userId } = req.params;

    try {
        const widgets = await getWidgetsByUserId(userId);
        res.status(200).json(widgets);
    } catch (error) {
        console.error(error);  // Log the error for debugging
        res.status(500).json({ error: 'Error retrieving widgets' });
    }
};

const createWidgetHandler = async (req, res) => {
    const { userId, type, configuration, w, h, x, y, i } = req.body;

    try {
        const newWidget = await createWidget(userId, type, configuration, w, h, x, y, i);
        res.status(201).json(newWidget);
    } catch (error) {
        console.error(error);  // Log the error for debugging
        res.status(500).json({ error: 'Error creating widget' });
    }
};

const updateWidgetLayoutHandler = async (req, res) => {
    const { id } = req.params;
    const { w, h, x, y, i } = req.body;

    try {
        const updatedWidget = await updateWidgetLayout(id, w, h, x, y, i);
        res.status(200).json(updatedWidget);
    } catch (error) {
        console.error(error);  // Log the error for debugging
        res.status 500).json({ error: 'Error updating widget layout' });
    }
};

const updateWidgetContentHandler = async (req, res) => {
    const { id } = req.params;
    const { configuration } = req.body;

    try {
        const updatedWidget = await updateWidgetContent(id, configuration);
        res.status(200).json(updatedWidget);
    } catch (error) {
        console.error(error);  // Log the error for debugging
        res.status 500).json({ error: 'Error updating widget content' });
    }
};

const deleteWidgetHandler = async (req, res) => {
    const { id } = req.params;

    try {
        await deleteWidget(id);
        res.status(200).json({ message: 'Widget deleted successfully' });
    } catch (error) {
        console.error(error);  // Log the error for debugging
        res.status(500).json({ error: 'Error deleting widget' });
    }
};

const getStockDataHandler = async (req, res) => {
    const { symbol, period } = req.query;

    if (!symbol || !period) {
        return res.status(400).json({ error: 'Missing required query parameters: symbol, period' });
    }

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
    getWidgetsByUserId: getWidgetsByUserIdHandler,
    createWidget: createWidgetHandler,
    updateWidgetLayout: updateWidgetLayoutHandler,
    updateWidgetContent: updateWidgetContentHandler,
    deleteWidget: deleteWidgetHandler,
    getStockData: getStockDataHandler
};
