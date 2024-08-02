const express = require('express');
const {
    getWidgetsByUserId,
    addWidget,
    updateWidgetLayout,
    updateWidgetContent,
    deleteWidget,
    getStockData,
    getFinancialGoalsByUserId
} = require('../Controllers/widgetController');

const router = express.Router();

router.get('/user/:userId', getWidgetsByUserId);
router.post('/create', addWidget);
router.put('/layout', updateWidgetLayout);
router.put('/content/:id', updateWidgetContent);
router.delete('/:id', deleteWidget);
router.get('/stock', getStockData);
router.get('/user/financial-goals/:userId', getFinancialGoalsByUserId);

module.exports = router;
