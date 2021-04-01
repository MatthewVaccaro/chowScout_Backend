const basicActions = require('../models/basicModel')
const helpers = require('../utils/helpers')

function DEL_singleDirty() {
	return async (req, res, next) => {
        try {

            const business = await basicActions.findById(req.params.id, "restaurants")
            helpers.checkLength(business, "Couldn't find that place", res)
            const remove = await basicActions.remove(business[0].id, "restaurants")

            res.status(200).json(remove)  
        } catch (error) {
            next(error)
        }
    }
}

module.exports = DEL_singleDirty;