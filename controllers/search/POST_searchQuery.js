const basicActions = require("../../models/basicModel");
const helpers = require("../../utils/helpers");
const geolib = require("geolib");
const axios = require("axios");

function POST_searchQuery() {
	return async (req, res, next) => {
		try {
			// TODO Lat & Lng should grab the data given in the request
			const findLocation = {
				location: {
					latLng: {
						lat: 36.1254902176224,
						lng: -86.78860731230652,
					},
				},
			};
			const searchQuery = "pizza";
			// SECTION Finding and valdiating the location given
			const locationDetails = await axios.post("http://www.mapquestapi.com/geocoding/v1/reverse?key=i8qSZ0ywgd3UA6JANlugttQlGJTNeeYm", findLocation);
			const foundLocation = await locationDetails.data.results[0].locations[0].adminArea3.toLowerCase();
			const validateLocation = await basicActions.findByAny("abbreviation", foundLocation, "states");
			helpers.checkLength(validateLocation, "location not found", res);

			// SECTION Find all restaurants with the location REF ID
			const findRestaurants = await basicActions.findAll("restaurants", {
				state_ref: validateLocation[0].id,
				washed: true,
			});

			// SECTION Create all of the radius groups needed

			const { latitude, longitude } = req.body;
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

			console.log(searchableSections);

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

			console.log(restaurantsSortedByDistance);

			const results = {};

			for (const mileSection in restaurantsSortedByDistance) {
				const result = await restaurantsSortedByDistance[mileSection].map(async (restaurant, i) => {
					const fullMenu = await basicActions.searchQuery(searchQuery, restaurant.id);
					if (fullMenu.length !== 0) {
					}
				});
			}
		} catch (error) {
			next(error);
		}
	};
}

module.exports = POST_searchQuery;
