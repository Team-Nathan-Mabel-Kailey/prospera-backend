const express = require('express');
const {
    getWidgetsByUserId,
    createWidget,
    deleteWidget,
    getStockData
} = require('../Controllers/widgetController');

const router = express.Router();

router.get('/user/:userId', getWidgetsByUserId);
router.post('/', createWidget);
router.delete('/:id', deleteWidget);
router.get('/stock', getStockData);

module.exports = router;
