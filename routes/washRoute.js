const router = require("express").Router();
const POST_restaurant = require("../controllers/POST_restaurant");
const GET_allRestaurants = require("../controllers/GET_allRestaurants");
const GET_singleRestaurant = require("../controllers/GET_singleRestaurant");
const GET_allTags = require("../controllers/GET_allTags");
const POST_addTag = require("../controllers/POST_addTag");
const DEL_singleRestaurant = require("../controllers/DEL_singleRestaurant");
const PUT_singleRestaurant = require("../controllers/PUT_singleRestaurant");
const PUT_washStatus = require("../controllers/PUT_washStatus");
require("dotenv").config();

// ANCHOR: Base Route: /api/internal/washer

router.post("/addRestaurant", POST_restaurant());

router.get("/allRestaurants/:washStatus", GET_allRestaurants());

router.get("/singleRestaurant/:id", GET_singleRestaurant()); // NOTE: Update to be GET_singleRestaurant

router.delete("/singleRestaurant/:id", DEL_singleRestaurant());

router.put("/singleRestaurant/:id", PUT_singleRestaurant());

router.put("/washStatus/:id", PUT_washStatus());

router.post("/addTag", POST_addTag());

router.get("/allTags", GET_allTags());

module.exports = router;
