const POST_searchQuery = require("../controllers/search/POST_searchQuery");

const router = require("express").Router();

router.post("/:query", POST_searchQuery());

module.exports = router;
