const basicActions = require("../models/basicModel");
const helpers = require("../utils/helpers");
const locationHelpers = require("../utils/locationHelpers");
require("dotenv").config();

function POST_restaurant() {
	return async (req, res, next) => {
		try {
			const { restaurant, menu, hours } = req.body;
			//Check body to ensure vital elements are there
			helpers.checkLength(restaurant.businessName, "needs a business name", res);
			helpers.checkLength(restaurant.cuisine, "needs a cuisine", res);
			helpers.checkLength(restaurant.streetAddress1, "needs a streetAddress1", res);
			// helpers.checkLength(menu, "missing Menu", res);

			//Check to see if the restaurant is unique or a duplicate
			const checkUnique = await basicActions.findWithFilter("businessName", restaurant.businessName, "restaurants");
			helpers.checkUnique(checkUnique, "It's already on the menu errer Code: 1001", res);

			//Get location details from MapQuest API
			const getLocation = await locationHelpers.getGeoLocationDetails(restaurant.streetAddress1);
			//admin Area 5 = City  |  Admin Area 3 = State
			const { adminArea5, adminArea3, postalCode, latLng, street } = getLocation;
			const { lat, lng } = latLng;

			//Assign GEO data
			restaurant.businessName = restaurant.businessName.toLowerCase();
			restaurant.streetAddress1 = street.toLowerCase();
			restaurant.lat = lat;
			restaurant.lon = lng;
			restaurant.city = adminArea5.toLowerCase();
			restaurant.zip = parseInt(postalCode.split("-")[0]);
			const findStateRef = await basicActions.findWithFilter("abbreviation", adminArea3.toLowerCase(), "states");
			helpers.checkLength(findStateRef, "no state found", res);
			restaurant.state_ref = findStateRef[0].id;

			// add restaurant to the DB
			const createRestaurant = await basicActions.add(restaurant, "restaurants");
			// Leverage the Restaurant ID for Foreign Keys
			const restaurantID = createRestaurant[0].id;
			// Add Hours to the DB
			hours.restaurant_ref = restaurantID;
			const addHours = await basicActions.add(hours, "hours");

			// Add Menu Items and sections to the DB
			const addMenu = await Promise.all(
				menu.map(async (section) => {
					const addSection = await basicActions.add({ groupTitle: section.groupTitle, restaurant_ref: restaurantID }, "menuGroups");

					section.dishs.map((item) => {
						item.menuGroup_ref = addSection[0].id;
						item.restaurant_ref = restaurantID;
						basicActions.add(item, "dishes");
					});
				})
			);
			const result = {
				restaurant: createRestaurant,
				hours: addHours,
				menu: addMenu,
			};
			return res.status(201).json(result);
		} catch (error) {
			next(error);
		}
	};
}

module.exports = POST_restaurant;
