// widgetcontroller
const { getWidgetsByUserId, updateWidgetContent, deleteWidget, getFinancialGoalsByUserId } = require('../Models/widgetModel');
const axios = require('axios');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Handler to get widgets by user ID
const getWidgetsByUserIdHandler = async (req, res) => {
    const { userId } = req.params;
    try {
        const widgets = await getWidgetsByUserId(userId); // Call model function to get widgets
        res.status(200).json(widgets);
    } catch (error) {
        console.error(error);  // Log the error for debugging
        res.status(500).json({ error: 'Error retrieving widgets' });
    }
};

// Handler to add a new widget
const addWidget = async (req, res) => {
    const { userId, type, x, y, w, h, configuration, i, minW, maxW, minH, maxH } = req.body;
    try {
      const newWidget = await prisma.widget.create({
        data: {
          i,
          type,
          x,
          y,
          w,
          h,
          minW,
          maxW,
          minH,
          maxH,
          configuration,
          user: {
            connect: { userID: parseInt(userId) }, // Connect widget to user
          },
        },
      });
      res.status(201).json(newWidget); // Send created widget as response
    } catch (error) {
      console.error('Error adding widget:', error);
      res.status(500).json({ error: 'Error adding widget' });
    }
  };

// Handler to update widget layout
const updateWidgetLayout = async (req, res) => {
  const { id, x, y, w, h } = req.body; // Extract layout details from request body
  try {
    const updatedWidget = await prisma.widget.update({
      where: { id: parseInt(id) },
      data: { x, y, w, h },
    });
    res.status(200).json(updatedWidget); // Send updated widget as response
  } catch (error) {
    console.error('Error updating widget layout:', error);
    res.status(500).json({ error: 'Error updating widget layout' });
  }
};

// Handler to update widget content
const updateWidgetContentHandler = async (req, res) => {
    const { id } = req.params;
    const { configuration } = req.body; // Extract configuration from request body
    try {
        const updatedWidget = await updateWidgetContent(id, configuration); // Call model function to update widget content
        res.status(200).json(updatedWidget);
    } catch (error) {
        console.error(error);  // Log the error for debugging
        res.status(500).json({ error: 'Error updating widget content' });
    }
};

// Handler to delete a widget
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

// Handler to get stock data
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
        const response = await axios.request(options); // Make API request to get stock data
        res.status(200).json(response.data); // Send stock data as response
    } catch (error) {
        console.error(error);  // Log the error for debugging
        res.status(500).json({ error: 'Error fetching stock data' });
    }
};

// Handler to get financial goals by user ID
const getFinancialGoalsByUserIdHandler = async (req, res) => {
  const { userId } = req.params;
  try {
      const financialGoals = await getFinancialGoalsByUserId(userId);
      res.status(200).json(financialGoals);  // Send retrieved financial goals as response
  } catch (error) {
      console.error('Error retrieving financial goals:', error);
      res.status(500).json({ error: 'Error retrieving financial goals' });
  }
};

// Handler to check if a goal exists
const checkGoalExists = async (req, res) => {
  const { goalId } = req.params;
  try {
      const goal = await prisma.goal.findUnique({
          where: { id: parseInt(goalId) } // Find goal by ID
      });
      res.json({ exists: !!goal }); // Send response indicating whether goal exists
  } catch (error) {
      console.error('Error checking goal existence:', error);
      res.status(500).json({ error: 'Error checking goal existence' });
  }
};

module.exports = {
    getWidgetsByUserId: getWidgetsByUserIdHandler,
    updateWidgetContent: updateWidgetContentHandler,
    deleteWidget: deleteWidgetHandler,
    getStockData: getStockDataHandler,
    addWidget,
    updateWidgetLayout,
    getFinancialGoalsByUserId: getFinancialGoalsByUserIdHandler,
    checkGoalExists
};