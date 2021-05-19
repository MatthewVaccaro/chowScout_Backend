const basicActions = require("../../models/basicModel");
const helpers = require("../../utils/helpers");
const timeHelper = require("../../utils/timeHelpers");
const geolib = require("geolib");
const axios = require("axios");

function POST_searchQuery() {
	return async (req, res, next) => {
		try {
			const { latitude, longitude } = req.body;

			const usersCoords = {
				location: {
					latLng: {
						lat: latitude,
						lng: longitude,
					},
				},
			};

			// SECTION Finding and valdiating the location given
			const findLocation = await axios.post("http://www.mapquestapi.com/geocoding/v1/reverse?key=i8qSZ0ywgd3UA6JANlugttQlGJTNeeYm", usersCoords);
			const foundLocation = await findLocation.data.results[0].locations[0].adminArea3.toLowerCase();
			const validateLocation = await basicActions.findWithFilter("abbreviation", foundLocation, "states");
			helpers.checkLength(validateLocation, "location not found", res);

			// SECTION Find all restaurants with the location REF ID
			const findRestaurants = await basicActions.findWithMultiFilter({ state_ref: validateLocation[0].id, washed: true }, "restaurants");

			// SECTION Create all of the radius groups needed
			const searchRadius = 1.609; // NOTE 1km = 1.609 miles
			const searchableSections = [];
			for (var i = 1; i < 11; i++) {
				//SECTION for each loop we grab a set of bounds and cross the sections (below) to get the four points of our bounding box.
				const findRadius = geolib.getBoundsOfDistance(
					{
						latitude: latitude,
						longitude: longitude,
					},
					searchRadius * i * 1000 // 1000 = 1km
				);

				findRadius.push((searchRadius * i) / searchRadius);
				searchableSections.push(findRadius);
			}

			const restaurantsSortedByDistance = {};

			// SECTION Sort the restaurants based on mile distance from the user
			// Looping through the items
			for (var index = 0; index < findRestaurants.length; index++) {
				// Looping through each bouding radius
				for (var section = 0; section < searchableSections.length; section++) {
					if (
						findRestaurants[index].lat > searchableSections[section][0].latitude && // Bottom
						findRestaurants[index].lon > searchableSections[section][0].longitude && // Left
						findRestaurants[index].lat < searchableSections[section][1].latitude && //Top
						findRestaurants[index].lon < searchableSections[section][1].longitude // Right
					) {
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

			// var fakeObject = {
			// 	// Normal
			// 	mon: "5:00 AM 11:00 AM",
			// 	tue: "5:00 AM 11:00 AM",
			// 	wed: "11:00 AM 10:00 PM",
			// 	thu: "11:00 AM 8:00 PM",
			// 	fri: "11:00 AM 8:00 PM",
			// 	sat: "11:00 AM 3:00 PM",
			// 	sun: "Closed",
			// };

			// console.log(timeHelper.isOpen(fakeObject));

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
