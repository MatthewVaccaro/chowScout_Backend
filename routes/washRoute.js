const router = require('express').Router();
const POST_scrape = require('../controllers/POST_scrape')
const GET_allDirty = require('../controllers/GET_allDirty')
require('dotenv').config();

router.post('/addScrape', POST_scrape());

router.get('/allDirty', GET_allDirty());

module.exports = router;