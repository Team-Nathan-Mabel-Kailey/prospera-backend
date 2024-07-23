const express = require('express');
const {
    getWidgetsByUserId,
    createWidget,
    updateWidgetLayout,
    updateWidgetContent,
    deleteWidget,
    getStockData
} = require('../Controllers/widgetController');

const router = express.Router();

router.get('/user/:userId', getWidgetsByUserId);
router.post('/', createWidget);
router.put('/layout/:id', updateWidgetLayout);
router.put('/content/:id', updateWidgetContent);
router.delete('/:id', deleteWidget);
router.get('/stock', getStockData);

module.exports = router;
