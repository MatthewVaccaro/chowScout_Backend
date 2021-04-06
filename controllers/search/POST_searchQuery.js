/*

NOTE Process:
- Given a single Lat and Lon which will represent the users current location
- Take lat and long and find it's bouding boxes
    - Bounding box can be found using the GEOLib function "getBoundsOfDistance( OBJ:{latitude: INT, longitude: INT}, INT: Radius in KM)"
- We will than fetch each restuarant in the bounding box
- For each restaurant found we will parse menu items for the correct dishes.
- Dishes will be return in a array sorted by distance. GEOLib has a function for this as well

*/

const basicActions = require('../../models/basicModel')
const geolib = require('geolib');

function POST_searchQuery() {
	return async (req, res, next) => {
        try {


            const {latitude, longitude} = req.body
            const searchRadius = 0.621371 // NOTE 1km = 0.621371 miles

            const searchableSections = []

            for (var i = 1; i < 6; i++){

                const findRadius = geolib.getBoundsOfDistance(
                    { latitude: latitude, longitude: longitude },
                    searchRadius * i * 1000
                );
                findRadius.push({ latitude: findRadius[0].latitude , longitude: findRadius[1].longitude }) // Bottom Right
                // findRadius.push({ latitude: findRadius[1].latitude , longitude: findRadius[0].longitude }) // Top Left

                searchableSections.push(findRadius)
            }

            const findAllBounds = geolib.getBounds(searchableSections);

            res.status(200).json(findAllBounds)
        } catch (error) {
            next(error)
        }
    }
}

module.exports = POST_searchQuery;

    