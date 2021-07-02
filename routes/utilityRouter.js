const POST_newState = require("../controllers/utility/states/POST_newState");
const POST_scrapedData = require("../controllers/utility/states/POST_scrapedData");
const GET_scrapedData = require("../controllers/utility/states/GET_scrapedData");
const GET_stats = require("../controllers/utility/states/GET_stats");

// /api/internal/utility

const router = require("express").Router();

router.post("/addState", POST_newState());

router.post("/scrapedData", POST_scrapedData());

router.get("/scrapedData", GET_scrapedData());

router.get("/stats", GET_stats());

module.exports = router;
