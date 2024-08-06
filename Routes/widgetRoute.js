const express = require('express');
const {
    getWidgetsByUserId,
    addWidget,
    updateWidgetLayout,
    updateWidgetContent,
    deleteWidget,
    getStockData,
    getFinancialGoalsByUserId,
    checkGoalExists
} = require('../Controllers/widgetController');

const router = express.Router();

// Route to get widgets by user ID
router.get('/user/:userId', getWidgetsByUserId);

// Route to create a new widget
router.post('/create', addWidget);

// Route to update widget layout
router.put('/layout', updateWidgetLayout);

// Route to update widget content by widget ID
router.put('/content/:id', updateWidgetContent);

// Route to delete a widget by widget ID
router.delete('/:id', deleteWidget);

// Route to get stock data
router.get('/stock', getStockData);

// Route to get financial goals by user ID
router.get('/user/financial-goals/:userId', getFinancialGoalsByUserId);

// Route to check if a goal exists by goal ID
router.get('/user/goals/:goalId', checkGoalExists);

module.exports = router;
