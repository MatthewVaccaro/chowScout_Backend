const basicActions = require('../models/basicModel')
const helpers = require("../utils/helpers")

function GET_allDirty() {
	return async (req, res, next) => {
        try {
            const findAllDirty = await basicActions.findAll('restaurants', 'washed', false)
            return res.status(200).json(findAllDirty)
        } catch (error) {
            next(error)
        }
    }
}

module.exports = GET_allDirty;