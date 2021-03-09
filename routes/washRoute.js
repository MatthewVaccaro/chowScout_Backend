const router = require('express').Router();
const POST_scrape = require('../controllers/POST_scrape')
const GET_all = require('../controllers/GET_all');
const GET_singleDirty = require('../controllers/GET_singleDirty');
const GET_allTags = require('../controllers/GET_allTags');
const POST_createTag = require('../controllers/POST_createTag');
const DEL_singleDirty = require('../controllers/DEL_singleDirty')
const PUT_singleDirty = require('../controllers/PUT_singleDirty');
const PUT_cleanToggle = require('../controllers/PUT_cleanToggle');
require('dotenv').config();

router.post('/addScrape', POST_scrape());

router.get('/all/:washStatus', GET_all());

router.get('/singleEntry/:id', GET_singleDirty())

router.post('/createTag', POST_createTag())

router.get('/allTags', GET_allTags())

router.delete('/singleDirty/:id', DEL_singleDirty())

router.put('/singleDirty/:id', PUT_singleDirty())

router.put('/cleanToggle/:id', PUT_cleanToggle())

module.exports = router;