const router = require('express').Router();
const POST_scrape = require('../controllers/POST_scrape')
require('dotenv').config();

router.post('/addScrape', POST_scrape());

module.exports = router;