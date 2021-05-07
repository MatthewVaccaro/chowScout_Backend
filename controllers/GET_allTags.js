const basicActions = require("../models/basicModel");

function GET_allTags() {
	return async (req, res, next) => {
		try {
			const findAllTags = await basicActions.fullTable("dishTags");
			return res.status(200).json(findAllTags);
		} catch (error) {
			next(error);
		}
	};
}

module.exports = GET_allTags;
