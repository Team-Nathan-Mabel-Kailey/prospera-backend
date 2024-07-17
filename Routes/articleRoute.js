const express = require('express');
const { getFinancialNews } = require('../Controllers/articleController');

const router = express.Router();

router.get('/news-and-articles', getFinancialNews);

module.exports = router;
