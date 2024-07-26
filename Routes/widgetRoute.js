// const express = require('express');
// const {
//     getWidgetsByUserId,
//     createWidget,
//     updateWidgetLayout,
//     updateWidgetContent,
//     deleteWidget,
//     getStockData
// } = require('../Controllers/widgetController');

// const router = express.Router();

// router.get('/user/:userId', getWidgetsByUserId);
// router.post('/', createWidget);
// router.put('/layout/:id', updateWidgetLayout);
// router.put('/content/:id', updateWidgetContent);
// router.delete('/:id', deleteWidget);
// router.get('/stock', getStockData);

// module.exports = router;

// const express = require('express');
// const {
//     getWidgetsByUserId,
//     createWidget,
//     updateWidgetLayout,
//     updateWidgetContent,
//     deleteWidget,
//     getStockData
// } = require('../Controllers/widgetController');
// const router = express.Router();
// router.get('/user/:userId', getWidgetsByUserId);
// router.post('/', createWidget);
// router.put('/layout/:id', updateWidgetLayout);
// router.put('/content/:id', updateWidgetContent);
// router.delete('/:id', deleteWidget);
// router.get('/stock', getStockData);
// module.exports = router;
const express = require('express');
const {
    getWidgetsByUserId,
    addWidget,
    updateWidgetLayout,
    updateWidgetContent,
    deleteWidget,
    getStockData
} = require('../Controllers/widgetController');
const router = express.Router();
router.get('/user/:userId', getWidgetsByUserId);
router.post('/create', addWidget);
router.put('/layout/:id', updateWidgetLayout);
router.put('/content/:id', updateWidgetContent);
router.delete('/:id', deleteWidget);
router.get('/stock', getStockData);
module.exports = router;