const basicActions = require("../models/basicModel");
const helpers = require("../utils/helpers");

function POST_addTag() {
	return async (req, res, next) => {
		try {
			if (!req.body.tag) {
				return res.status(400).json({ message: "Requires a tag" });
			}

			if (typeof req.body.tag === Number) {
				return res.status(400).json({ message: "Wrong Data Type" });
			}

			const { tag } = req.body;

			const checkUnique = await basicActions.findWithFilter("tag", tag, "dishTags");
			helpers.checkUnique(checkUnique, "already exists", res);

			const createTag = await basicActions.add({ tag: tag }, "dishTags");
			return res.status(200).json(createTag[0]);
		} catch (error) {
			next(error);
		}
	};
}

module.exports = POST_addTag;
