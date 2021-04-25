const POST_newState = require('../controllers/utility/states/POST_newState');

const router = require('express').Router();

router.post('/createState', POST_newState());

module.exports = router;