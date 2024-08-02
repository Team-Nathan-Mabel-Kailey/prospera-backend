// const { getWidgetsByUserId, updateWidgetContent, deleteWidget } = require('../Models/widgetModel');
// const axios = require('axios');

// const getWidgetsByUserIdHandler = async (req, res) => {
//     const { userId } = req.params;

//     try {
//         const widgets = await getWidgetsByUserId(userId);
//         res.status(200).json(widgets);
//     } catch (error) {
//         console.error(error);  // Log the error for debugging
//         res.status(500).json({ error: 'Error retrieving widgets' });
//     }
// };

// const createWidgetHandler = async (req, res) => {
//     const { userId, type, x, y, w, h, configuration, i } = req.body;
//     try {
//     const newWidget = await prisma.widget.create({
//         data: {
//         i,
//         type,
//         x,
//         y,
//         w,
//         h,
//         configuration,
//         user: {
//             connect: { userID: parseInt(userId) },
//         },
//         },
//     });
//     res.status(201).json(newWidget);
//     } catch (error) {
//     console.error('Error adding widget:', error);
//     res.status(500).json({ error: 'Error adding widget' });
//     }
// };

// const updateWidgetLayoutHandler = async (req, res) => {
//     const { id, x, y, w, h } = req.body;
//     try {
//         const updatedWidget = await prisma.widget.update({
//         where: { id: parseInt(id) },
//         data: { x, y, w, h },
//         });
//         res.status(200).json(updatedWidget);
//     } catch (error) {
//         console.error('Error updating widget layout:', error);
//         res.status(500).json({ error: 'Error updating widget layout' });
//     }
// };

// const updateWidgetContentHandler = async (req, res) => {
//     const { id } = req.params;
//     const { configuration } = req.body;

//     try {
//         const updatedWidget = await updateWidgetContent(id, configuration);
//         res.status(200).json(updatedWidget);
//     } catch (error) {
//         console.error(error);  // Log the error for debugging
//         res.status(500).json({ error: 'Error updating widget content' });
//     }
// };

// const deleteWidgetHandler = async (req, res) => {
//     const { id } = req.params;

//     try {
//         await deleteWidget(id);
//         res.status(200).json({ message: 'Widget deleted successfully' });
//     } catch (error) {
//         console.error(error);  // Log the error for debugging
//         res.status(500).json({ error: 'Error deleting widget' });
//     }
// };

// const getStockDataHandler = async (req, res) => {
//     const { symbol, period } = req.query;

//     if (!symbol || !period) {
//         return res.status(400).json({ error: 'Missing required query parameters: symbol, period' });
//     }

//     const options = {
//         method: 'GET',
//         url: 'https://real-time-finance-data.p.rapidapi.com/stock-time-series',
//         params: { symbol, period, language: 'en' },
//         headers: {
//             'x-rapidapi-key': process.env.RAPIDAPI_KEY,
//             'x-rapidapi-host': 'real-time-finance-data.p.rapidapi.com'
//         }
//     };

//     try {
//         const response = await axios.request(options);
//         res.status(200).json(response.data);
//     } catch (error) {
//         console.error(error);  // Log the error for debugging
//         res.status(500).json({ error: 'Error fetching stock data' });
//     }
// };

// module.exports = {
//     getWidgetsByUserId: getWidgetsByUserIdHandler,
//     createWidget: createWidgetHandler,
//     updateWidgetLayout: updateWidgetLayoutHandler,
//     updateWidgetContent: updateWidgetContentHandler,
//     deleteWidget: deleteWidgetHandler,
//     getStockData: getStockDataHandler
// };

// widgetcontroller
const { getWidgetsByUserId, updateWidgetContent, deleteWidget, getFinancialGoalsByUserId } = require('../Models/widgetModel');
const axios = require('axios');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
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
// const createWidgetHandler = async (req, res) => {
//     const { userId, type, configuration, w, h, x, y, i } = req.body;
//     try {
//         const newWidget = await createWidget(userId, type, configuration, w, h, x, y, i);
//         res.status(201).json(newWidget);
//     } catch (error) {
//         console.error(error);  // Log the error for debugging
//         res.status(500).json({ error: 'Error creating widget' });
//     }
// };
const addWidget = async (req, res) => {
    const { userId, type, x, y, w, h, configuration, i } = req.body;
    try {
      const newWidget = await prisma.widget.create({
        data: {
          i,
          type,
          x,
          y,
          w,
          h,
          configuration,
          user: {
            connect: { userID: parseInt(userId) },
          },
        },
      });
      res.status(201).json(newWidget);
    } catch (error) {
      console.error('Error adding widget:', error);
      res.status(500).json({ error: 'Error adding widget' });
    }
  };
  const updateWidgetLayout = async (req, res) => {
    const { id, x, y, w, h } = req.body;
    try {
      const updatedWidget = await prisma.widget.update({
        where: { id: parseInt(id) },
        data: { x, y, w, h },
      });
      res.status(200).json(updatedWidget);
    } catch (error) {
      console.error('Error updating widget layout:', error);
      res.status(500).json({ error: 'Error updating widget layout' });
    }
  };
// const createWidget = async (req, res) => {
//     const { userId, type, x, y, w, h, configuration, i } = req.body;
//     try {
//       const newWidget = await prisma.widget.create({
//         data: {
//           i,
//           type,
//           x,
//           y,
//           w,
//           h,
//           configuration,
//           user: {
//             connect: { userID: parseInt(userId) },
//           },
//         },
//       });
//       res.status(201).json(newWidget);
//     } catch (error) {
//       console.error('Error adding widget:', error);
//       res.status(500).json({ error: 'Error adding widget' });
//     }
//   };
// const updateWidgetLayoutHandler = async (req, res) => {
//     const { id, x, y, w, h } = req.body;
//     try {
//     const updatedWidget = await prisma.widget.update({
//         where: { id: parseInt(id) },
//         data: { x, y, w, h },
//     });
//     res.status(200).json(updatedWidget);
//     } catch (error) {
//     console.error('Error updating widget layout:', error);
//     res.status(500).json({ error: 'Error updating widget layout' });
//     }
// };
const updateWidgetContentHandler = async (req, res) => {
    const { id } = req.params;
    const { configuration } = req.body;
    try {
        const updatedWidget = await updateWidgetContent(id, configuration);
        res.status(200).json(updatedWidget);
    } catch (error) {
        console.error(error);  // Log the error for debugging
        res.status(500).json({ error: 'Error updating widget content' });
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

const getFinancialGoalsByUserIdHandler = async (req, res) => {
  const { userId } = req.params;
  try {
      const financialGoals = await getFinancialGoalsByUserId(userId);
      res.status(200).json(financialGoals);
  } catch (error) {
      console.error('Error retrieving financial goals:', error);
      res.status(500).json({ error: 'Error retrieving financial goals' });
  }
};

module.exports = {
    getWidgetsByUserId: getWidgetsByUserIdHandler,
    updateWidgetContent: updateWidgetContentHandler,
    deleteWidget: deleteWidgetHandler,
    getStockData: getStockDataHandler,
    addWidget,
    updateWidgetLayout,
    getFinancialGoalsByUserId: getFinancialGoalsByUserIdHandler
};