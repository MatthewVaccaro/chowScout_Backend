const basicActions = require("../models/basicModel");
const helpers = require("../utils/helpers");
const axios = require("axios");
require("dotenv").config();

function POST_restaurant() {
	return async (req, res, next) => {
		try {
			const { restaurant, menu, hours } = req.body;

			console.log(restaurant, hours);

			// SECTION Get Location
			const geolocationURL = (street, city, state) => {
				return `https://www.mapquestapi.com/geocoding/v1/address?key=${process.env.MAP_QUEST_KEY}&inFormat=json&outFormat=json&json={"location":{"street":"${street},${city},${state}"},"options":{"thumbMaps":false}}`;
			};

			// SECTION Validate business info
			helpers.checkLength(restaurant.businessName, "needs a business name", res);
			helpers.checkLength(restaurant.cuisine, "needs a cuisine", res);
			helpers.checkLength(restaurant.streetAddress1, "needs a streetAddress1", res);
			helpers.checkLength(restaurant.city, "needs a city", res);
			helpers.checkLength(restaurant.state_ref, "needs a state", res);

			// SECTION Validate the restaurant isn't a dupliacte
			const checkUnique = await basicActions.findWithFilter("businessName", restaurant.businessName, "restaurants");
			if (checkUnique.length > 0) {
				if (checkUnique[0].streetAddress1 === restaurant.streetAddress1) {
					return res.status(400).json({ message: "It's already on the menu errer Code: 1001" });
				}
			}

			console.log(
				"section 1 ------->",
				restaurant.streetAddress1,
				restaurant.city,
				restaurant.state_ref,
				"\n",
				geolocationURL(restaurant.streetAddress1, restaurant.city, restaurant.state_ref)
			);

			// SECTION create location object
			const foundLocation = await axios.get(geolocationURL(restaurant.streetAddress1, restaurant.city, restaurant.state_ref));
			const { displayLatLng, postalCode } = foundLocation.data.results[0].locations[0];
			// restaurant.zip = parseInt(postalCode.split("-")[0]);
			restaurant.lat = displayLatLng.lat;
			restaurant.lon = displayLatLng.lng;

			console.log("section 2 ------->");

			const findStateRef = await basicActions.findWithFilter("abbreviation", restaurant.state_ref, "states");
			console.log("state:", restaurant.state_ref);
			helpers.checkLength(findStateRef, "no state found", res);
			restaurant.state_ref = findStateRef[0].id;

			console.log("section 3 ------->");

			const createRestaurant = await basicActions.add(restaurant, "restaurants");

			const restaurantID = createRestaurant[0].id;
			hours.restaurant_ref = restaurantID;
			const addHours = await basicActions.add(hours, "hours");

			console.log("section 4 ------->");

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

			console.log("section 5 ------->");

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
