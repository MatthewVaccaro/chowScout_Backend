const basicActions = require('../models/basicModel')
const helpers = require('../utils/helpers')

function PUT_cleanToggle() {
	return async (req, res, next) => {
        try {

            const findRestaurant = await basicActions.findById(req.params.id, "restaurants")
            helpers.checkLength(findRestaurant, "Couldn't find that place", res)

            findRestaurant[0].washed === true ? findRestaurant[0].washed = false : findRestaurant[0].washed = true

            console.log(findRestaurant)

            const update = await basicActions.update(req.params.id, findRestaurant[0], "restaurants")
            res.status(201).json(update)

        } catch (error) {
            next(error)
        }
    }
}

module.exports = PUT_cleanToggle;