const POST_newState = require("../controllers/utility/states/POST_newState");

// /api/internal/utility

const router = require("express").Router();

router.post("/addState", POST_newState());

module.exports = router;
