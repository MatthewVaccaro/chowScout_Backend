const basicActions = require('../../../models/basicModel')
const helpers = require('../../../utils/helpers')

function POST_newState() {
	return async (req, res, next) => {
        try {

            if (!req.body.stateName){
                return res.status(400).json({message: "Missing name"})
            }

            const checkUnique = await basicActions.findByAny("stateName", req.body.stateName, "states")
            helpers.checkUnique(checkUnique, "not unique", res)

            const newState = await basicActions.add(req.body, "states")

            res.status(201).json(newState)

        } catch (error) {
            next(error)
        }
    }
}

module.exports = POST_newState;