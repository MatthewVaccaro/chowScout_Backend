const basicActions = require('../models/basicModel')
const helpers = require('../utils/helpers')

function PUT_singleDirty() {
	return async (req, res, next) => {
        try {
            const {business, hours, menu} = req.body

            const findBusiness = await basicActions.findById(req.params.id, "restaurants")
            helpers.checkLength(findBusiness, "Couldn't find that place", res)
            await basicActions.update(findBusiness[0].id, business, "restaurants")

            const findHours = await basicActions.findByAny('restaurant_ref', findBusiness[0].id, 'hours')
            helpers.checkLength(findHours, "Couldn't find those hours", res)
             await basicActions.update(findHours[0].id, hours, "hours")

            menu.map( async sectionValue => {
                await basicActions.update( sectionValue.sectionId, {groupTitle : sectionValue.groupTitle}, 'menuGroups' )
                sectionValue.dishes.map( async dishValue => { 

                    const {dishTitle, price, description, tag_ref} = dishValue
                    await basicActions.update(dishValue.id, {dishTitle: dishTitle, price: price, description: description, tag_ref: tag_ref  }, 'dishes')
                }  )
            })

            res.status(200).json({message:'Update Successful'}) 


        } catch (error) {
            next(error)
        }
    }
}

module.exports = PUT_singleDirty;