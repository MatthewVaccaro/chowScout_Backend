const router = require("express").Router();
const POST_scrape = require("../controllers/POST_scrape");
const GET_all = require("../controllers/GET_all");
const GET_singleDirty = require("../controllers/GET_singleDirty");
const GET_allTags = require("../controllers/GET_allTags");
const POST_createTag = require("../controllers/POST_createTag");
const DEL_singleDirty = require("../controllers/DEL_singleDirty");
const PUT_singleDirty = require("../controllers/PUT_singleDirty");
const PUT_cleanToggle = require("../controllers/PUT_cleanToggle");
require("dotenv").config();

// ANCHOR: Base Route: /api/internal/washer

router.post("/addRestaurant", POST_scrape());
// router.post('/addScrape', POST_scrape());

router.get("/allRestaurants/:washStatus", GET_all());
// router.get('/all/:washStatus', GET_all());

router.get("/singleRestaurant/:id", GET_singleDirty()); // NOTE: Update to be GET_singleRestaurant
// router.get('/singleEntry/:id', GET_singleDirty())

router.delete("/singleRestaurant/:id", DEL_singleDirty());
// router.delete('/singleDirty/:id', DEL_singleDirty())

router.put("/singleRestaurant/:id", PUT_singleDirty());
// router.put('/singleDirty/:id', PUT_singleDirty())

router.put("/washStatus/:id", PUT_cleanToggle());
// router.put('/cleanToggle/:id', PUT_cleanToggle())

router.post("/addTag", POST_createTag());
// router.post('/createTag', POST_createTag())

router.get("/allTags", GET_allTags());

module.exports = router;
