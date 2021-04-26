const basicActions = require('../../../models/basicModel')
const helpers = require('../../../utils/helpers')

function POST_newState() {
	return async (req, res, next) => {
        try {

            if (!req.body.stateName || !req.body.abbreviation){
                return res.status(400).json({message: "Missing data"})
            }

            if (req.body.abbreviation.length !== 2){
                return res.status(400).json({message: "Incorrect abbreviation"})
            }

            const checkUnique = await basicActions.findByAny("stateName", req.body.stateName, "states")
            helpers.checkUnique(checkUnique, "not unique", res)

            const data = {
                stateName: req.body.stateName.toLowerCase(),
                abbreviation: req.body.abbreviation.toLowerCase()
            }

            const newState = await basicActions.add(data, "states")

            res.status(201).json(newState)

        } catch (error) {
            next(error)
        }
    }
}

module.exports = POST_newState;