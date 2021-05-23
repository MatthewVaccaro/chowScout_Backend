const basicActions = require("../../models/basicModel");
const helpers = require("../../utils/helpers");
const timeHelper = require("../../utils/timeHelpers");
const locationHelpers = require("../../utils/locationHelpers");

const url = require("url");

function POST_searchQuery() {
	return async (req, res, next) => {
		try {
			const { latitude, longitude } = req.body;

			// SECTION: Query Params to allow the url to control the Radiis to create and search through
			const startingMile = req.query.startingMile >= 0 ? parseInt(req.query.startingMile) : 0;
			const endMile = req.query.endMile >= 0 ? parseInt(req.query.endMile) : startingMile + 5;

			console.log(endMile);
			// SECTION Finding and valdiating the location given
			const findLocation = await locationHelpers.reverseGeoLocate(latitude, longitude);
			const foundLocation = await findLocation.adminArea3.toLowerCase();
			const validateLocation = await basicActions.findWithFilter("abbreviation", foundLocation, "states");
			helpers.checkLength(validateLocation, "location not found", res);

			// SECTION Find all restaurants with the location REF ID
			const findRestaurants = await basicActions.findWithMultiFilter({ state_ref: validateLocation[0].id, washed: true }, "restaurants");

			const searchableSections = locationHelpers.buildRadii(latitude, longitude, startingMile, endMile);

			const restaurantsSortedByDistance = {};

			// SECTION Sort the restaurants based on mile distance from the user
			// Looping through the items
			for (var index = 0; index < findRestaurants.length; index++) {
				// Looping through each bouding radius
				for (var section = 0; section < searchableSections.length; section++) {
					var bottomCoord = findRestaurants[index].lat > searchableSections[section][0].latitude;
					var leftCoord = findRestaurants[index].lon > searchableSections[section][0].longitude;
					var topCoord = findRestaurants[index].lat < searchableSections[section][1].latitude;
					var rightCoord = findRestaurants[index].lon < searchableSections[section][1].longitude;

					if (bottomCoord && leftCoord && topCoord && rightCoord) {
						if (restaurantsSortedByDistance[searchableSections[section][2]]) {
							restaurantsSortedByDistance[searchableSections[section][2]].push(findRestaurants[index]);
							break;
						} else {
							restaurantsSortedByDistance[searchableSections[section][2]] = [findRestaurants[index]];
							break;
						}
					}
				}
			}

			const results = {};
			// TODO: This double looping promise.all is most likely not scaleable. Needs stress tests
			const promiseFinal = await Promise.all(
				Object.keys(restaurantsSortedByDistance).map(async (mile) => {
					return (fullRestaurant = await Promise.all(
						restaurantsSortedByDistance[mile].map(async (restaurant) => {
							const foundDishes = await basicActions.searchQuery(req.params.query, restaurant.id);
							if (foundDishes.length > 0) {
								const getHours = await basicActions.findWithFilter("restaurant_ref", restaurant.id, "hours");
								restaurant.isOpen = timeHelper.isOpen(getHours[0]);
								if (results[mile]) {
									results[mile].push({ restaurant: restaurant, dishes: foundDishes });
								} else {
									results[mile] = [{ restaurant: restaurant, dishes: foundDishes }];
								}
							}
						})
					));
				})
			);

			return res.status(200).json(results);
		} catch (error) {
			next(error);
		}
	};
}

module.exports = POST_searchQuery;
