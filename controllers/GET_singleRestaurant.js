const basicActions = require("../models/basicModel");
const helpers = require("../utils/helpers");

function GET_singleRestaurant() {
	return async (req, res, next) => {
		try {
			const business = await basicActions.findById(req.params.id, "restaurants");
			helpers.checkLength(business, "business not Found", res);
			const businessID = business[0].id;

			const menu = [];

			const hours = await basicActions.findWithFilter("restaurant_ref", businessID, "hours");

			const sections = await basicActions.findWithFilter("restaurant_ref", businessID, "menuGroups");
			for (let index = 0; index < sections.length; index++) {
				const items = await basicActions.findWithFilter("menuGroup_ref", sections[index].id, "dishes");
				menu.push({ sectionId: sections[index].id, groupTitle: sections[index].groupTitle, dishes: items });
			}

			res.status(200).json({ business: business[0], hours: hours[0], menu: menu });
		} catch (error) {
			next(error);
		}
	};
}

module.exports = GET_singleRestaurant;
