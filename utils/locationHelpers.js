const axios = require("axios");
const geolib = require("geolib");

async function reverseGeoLocate(latitude, longitude) {
	const usersCoords = {
		location: {
			latLng: {
				lat: latitude,
				lng: longitude,
			},
		},
	};

	const results = await axios.post("http://www.mapquestapi.com/geocoding/v1/reverse?key=i8qSZ0ywgd3UA6JANlugttQlGJTNeeYm", usersCoords);

	return results.data.results[0].locations[0];
}

function buildRadii(latitude, longitude, startMile = 0, endMile = 6) {
	// SECTION Create all of the radius groups needed
	const searchRadius = 1.609; // NOTE 1km = 1.609 miles
	const searchableSections = [];
	for (startMile; startMile < endMile; startMile++) {
		//SECTION for each loop we grab a set of bounds and cross the sections (below) to get the four points of our bounding box.
		const findRadius = geolib.getBoundsOfDistance(
			{
				latitude: latitude,
				longitude: longitude,
			},
			searchRadius * startMile * 1000 // 1000 = 1km
		);

		findRadius.push((searchRadius * startMile) / searchRadius);
		searchableSections.push(findRadius);
	}

	return searchableSections;
}

module.exports = {
	reverseGeoLocate,
	buildRadii,
};
