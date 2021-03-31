const router = require('express').Router();
const {google} = require('googleapis')
const keys = require('../keys.json')

router.post('/signup', async (req, res, next)=>{

    if (!req.body.email || !req.body.email){
        return res.status(400).json({message: "Needs email & or city"})
    }

const client = new google.auth.JWT(
    keys.client_email,
    null,
    keys.private_key,
    [ 'https://www.googleapis.com/auth/spreadsheets' ]
);

client.authorize(function (err, tokens){
    if(err){
        console.log(err)
        return
    }else{
        console.log('connected')
        gsRun(client)
    }
})

async function gsRun( client ){
    const gsAPI = await google.sheets({version: 'v4', auth: client})

    const getOptions = {
        spreadsheetId: '1o9j2g1Ab7zvhTAQL6YJz4PSqmU2FV-NEAE7t33hUD2Q',
        range: 'B:B'
    } 

    const getRequest = await gsAPI.spreadsheets.values.get(getOptions)
    console.log(getRequest.data.values)

    const upateOptions = {
        spreadsheetId: '1o9j2g1Ab7zvhTAQL6YJz4PSqmU2FV-NEAE7t33hUD2Q',
        range: `A${getRequest.data.values.length + 1}`,
        valueInputOption: 'USER_ENTERED',
        resource: {values: [[req.body.email, req.body.city]] }
    } 

    const updateRequest = await gsAPI.spreadsheets.values.update(upateOptions)
    res.status(200).json(updateRequest.config.data.values[0])

}

})

module.exports = router;


