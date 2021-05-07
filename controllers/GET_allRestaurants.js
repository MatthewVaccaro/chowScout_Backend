const basicActions = require("../models/basicModel");

function GET_allRestaurants() {
	return async (req, res, next) => {
		try {
			const findAllDirty = await basicActions.findAll("restaurants", "washed", req.params.washStatus);
			return res.status(200).json(findAllDirty);
		} catch (error) {
			next(error);
		}
	};
}

module.exports = GET_allRestaurants;
