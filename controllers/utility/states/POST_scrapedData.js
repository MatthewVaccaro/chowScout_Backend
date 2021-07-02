const { google } = require("googleapis");

function POST_scrapedData() {
	return async (req, res, next) => {
		try {
			console.log(typeof req.body);

			// if (req.body !== Array) {
			// 	return res.status(400).json({ message: "Wrong data type" });
			// }

			if (req.body.length === 0) {
				return res.status(400).json({ message: "No data found" });
			}

			const spreadsheetId = "1Fc6xaI6Qcp_8yygk_1KrSUNtCk1kwRnw4E0A1OJViYE";

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
				// console.log(getRequest.data.values);

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
