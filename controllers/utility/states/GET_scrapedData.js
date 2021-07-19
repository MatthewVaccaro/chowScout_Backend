const { google } = require("googleapis");
const basicActions = require("../../../models/basicModel");
require("dotenv").config();

function GET_scrapedData() {
	return async (req, res, next) => {
		try {
			console.log("Trying to get the data yo");
			const spreadsheetId = process.env.SPREAD_SHEET_ID;

			const client = new google.auth.JWT(process.env.CLIENT_EMAIL, null, process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"), [
				"https://www.googleapis.com/auth/spreadsheets",
			]);

			client.authorize(async function (err) {
				if (err) {
					console.log(err);
					return;
				} else {
					var getSheetData = await await await await gsRun(client);
					var confirmedUnique = await Promise.all(
						getSheetData.map(async (value) => {
							const findRestaurant = await basicActions.findWithFilter("businessName", value[0].toLowerCase(), "restaurants");
							if (findRestaurant.length === 0) {
								return value;
							}
						})
					);
					// Returing with a filter and slice to control the ammount and remove nulls/undefines
					res.status(200).json(confirmedUnique.filter((value) => value !== undefined).slice(0, 10));
				}
			});

			async function gsRun(client) {
				const gsAPI = await google.sheets({ version: "v4", auth: client });

				const getOptions = {
					spreadsheetId: spreadsheetId,
					range: "A:D",
				};

				const getRequest = await gsAPI.spreadsheets.values.get(getOptions);

				return getRequest.data.values;
			}
		} catch (error) {
			next(error);
		}
	};
}

module.exports = GET_scrapedData;
