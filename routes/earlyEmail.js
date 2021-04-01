const router = require('express').Router();
const {google} = require('googleapis')
require('dotenv').config();

router.post('/signup', async (req, res)=>{

    if (!req.body.email || !req.body.email){
        return res.status(400).json({message: "Needs email & or city"})
    }

    const spreadsheetId = '1o9j2g1Ab7zvhTAQL6YJz4PSqmU2FV-NEAE7t33hUD2Q'

const client = new google.auth.JWT(
    process.env.CLIENT_EMAIL,
    null,
    process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    [ 'https://www.googleapis.com/auth/spreadsheets' ]
);

client.authorize(function (err){
    if(err){
        console.log(err)
        return
    }else{
        gsRun(client)
    }
})

async function gsRun( client ){
    const gsAPI = await google.sheets({version: 'v4', auth: client})

    const getOptions = {
        spreadsheetId: spreadsheetId,
        range: 'B:B'
    } 

    const getRequest = await gsAPI.spreadsheets.values.get(getOptions)
    console.log(getRequest.data.values)
    
    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);

    const upateOptions = {
        spreadsheetId: spreadsheetId,
        range: `A${getRequest.data.values.length + 1}`,
        valueInputOption: 'USER_ENTERED',
        resource: {values: [[req.body.email, req.body.city, today.toDateString()]] }
    } 

    const updateRequest = await gsAPI.spreadsheets.values.update(upateOptions)
    res.status(200).json(updateRequest.config.data.values[0])

}

})

module.exports = router;


