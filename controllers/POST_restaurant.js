const basicActions = require("../models/basicModel");
const helpers = require("../utils/helpers");
const locationHelpers = require("../utils/locationHelpers");
require("dotenv").config();
const axios = require("axios");

function POST_restaurant() {
	return async (req, res, next) => {
		try {
			const { restaurant, menu, hours } = req.body;
			//Check body to ensure vital elements are there
			helpers.checkLength(restaurant.businessName, "needs a business name", res);
			helpers.checkLength(restaurant.cuisine, "needs a cuisine", res);
			helpers.checkLength(restaurant.streetAddress1, "needs a streetAddress1", res);
			helpers.checkLength(menu, "missing Menu", res);

			//Check to see if the restaurant is unique or a duplicate
			const checkUnique = await basicActions.findWithFilter("businessName", restaurant.businessName, "restaurants");
			helpers.checkUnique(checkUnique, "It's already on the menu errer Code: 1001", res);

			//Get location details from MapQuest API
			const location = await axios.get("https://maps.googleapis.com/maps/api/geocode/json", {
				params: {
					address: restaurant.streetAddress1,
					key: process.env.GEOCODING_KEY,
				},
			});

			const { lat, lng } = location.data.results[0].geometry.location;
			const { formatted_address } = location.data.results[0];
			const addressSections = formatted_address.split(",");
			console.log(restaurant.businessName);
			console.log("\x1b[33m%s\x1b[0m", formatted_address);

			restaurant.businessName = restaurant.businessName.toLowerCase();
			restaurant.streetAddress1 = addressSections[0].toLowerCase().trim();
			restaurant.lat = lat;
			restaurant.lon = lng;
			restaurant.city = addressSections[1].toLowerCase().trim();
			restaurant.zip = parseInt(addressSections[2].trim().split(" ")[1]);
			const state = addressSections[2].trim().split(" ")[0].toLowerCase().trim();
			console.log("----->", addressSections[2].trim().split(" "));
			const findStateRef = await basicActions.findWithFilter("abbreviation", state, "states");
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
