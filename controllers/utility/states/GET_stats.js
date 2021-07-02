const basicActions = require("../../../models/basicModel");

function GET_stats() {
	return async (req, res, next) => {
		var findRestaurant = await basicActions.fullTable("restaurants");
		var findDishes = await basicActions.fullTable("dishes");
		var findGroups = await basicActions.fullTable("menuGroups");

		var avgDishPerRestaurant = findDishes.length / findRestaurant.length;

		res
			.status(200)
			.json({ restaurants: findRestaurant.length, dishes: findDishes.length, menuGroups: findGroups.length, dishAVG: avgDishPerRestaurant });
	};
}

module.exports = GET_stats;
