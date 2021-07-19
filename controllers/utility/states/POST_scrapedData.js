const { google } = require("googleapis");
require("dotenv").config();

function POST_scrapedData() {
	return async (req, res, next) => {
		try {
			if (req.body.length === 0) {
				return res.status(400).json({ message: "No data found" });
			}

			const spreadsheetId = process.env.SPREAD_SHEET_ID;

			const client = new google.auth.JWT(process.env.CLIENT_EMAIL, null, process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"), [
				"https://www.googleapis.com/auth/spreadsheets",
			]);

			client.authorize(function (err) {
				if (err) {
					console.log(err);
					return;
				} else {
					gsRun(client);
				}
			});

			async function gsRun(client) {
				const gsAPI = await google.sheets({ version: "v4", auth: client });

				const getOptions = {
					spreadsheetId: spreadsheetId,
					range: "A:B",
				};

				const getRequest = await gsAPI.spreadsheets.values.get(getOptions);

				const upateOptions = {
					spreadsheetId: spreadsheetId,
					range: `A${getRequest.data.values.length + 1}`,
					valueInputOption: "USER_ENTERED",
					resource: { values: req.body },
				};

				const updateRequest = await gsAPI.spreadsheets.values.update(upateOptions);
				res.status(200).json(updateRequest.config.data.values[0]);
			}
		} catch (error) {
			console.log(error);
		}
	};
}

module.exports = POST_scrapedData;
