const basicActions = require('../models/basicModel')
const helpers = require("../utils/helpers")
const axios = require("axios")
require('dotenv').config();

function POST_scrape() {
	return async (req, res, next) => {
        try {

            const {restaurant, menu, hours} = req.body

            const geolocationURL = (street, city, state)=> {
                return `https://www.mapquestapi.com/geocoding/v1/address?key=${process.env.MAP_QUEST_KEY}&inFormat=json&outFormat=json&json={"location":{"street":"${street}, ${city}, ${state}"},"options":{"thumbMaps":false}}`}

            helpers.checkLength(restaurant.businessName, "needs a business name", res)
            helpers.checkLength(restaurant.cuisine, "needs a cuisine", res)
            helpers.checkLength(restaurant.streetAddress1, "needs a streetAddress1", res)

            const checkUnique = await basicActions.findByAny('businessName', restaurant.businessName, 'restaurants')
            console.log(checkUnique, restaurant.streetAddress1)
            if (checkUnique.length > 0){
                if (checkUnique[0].streetAddress1 === restaurant.streetAddress1 ){
                    return res.status(400).json({message: "It's already on the menu errer Code: 1001"})
                }
            }

            const foundLocation = await axios.get(geolocationURL(restaurant.streetAddress1, restaurant.city, restaurant.state))
            const {displayLatLng, postalCode} = foundLocation.data.results[0].locations[0]
            restaurant.zip = parseInt(postalCode.split('-')[0])
            restaurant.lat = displayLatLng.lat
            restaurant.lon = displayLatLng.lng

            const createRestaurant = await basicActions.add(restaurant, "restaurants")

            const restaurantID = createRestaurant[0].id
            hours.restaurant_ref = restaurantID
            const addHours = await basicActions.add(hours, "hours")

            const addMenu = await Promise.all(menu.map(async (section) => {
                
                const addSection = await basicActions.add({groupTitle:section.groupTitle, restaurant_ref:restaurantID}, 'menuGroups')
                
                section.dishs.map(item => { 
                    
                    item.menuGroup_ref = addSection[0].id
                    basicActions.add(item, 'dishes')
                 })
            }));
            
            const result = {
                restaurant: createRestaurant,
                hours: addHours,
                menu: addMenu
            }

            return res.status(201).json(result)
  
        } catch (error) {
            next(error)
        }

    }}

    module.exports = POST_scrape;