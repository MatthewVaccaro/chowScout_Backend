const dateConstructor = new Date();
const currentDate = dateConstructor.toString().split(" ");
const day = dateConstructor.getDay(); // Returns INT 0 - 6

const allDays = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

const today = currentDate[0].toLowerCase();
const yesterday = day === 0 ? allDays[6] : allDays[day - 1]; // On Sunday, yestorday equals saturday

const time = currentDate[4].split(":");
const hour = parseInt(time[0] + time[1]); //[0] Select Hour | [1] Selects Minute

function isOpen(hoursObject) {
	const restaurantHoursToday = hoursObject[today].split(" "); // ["5:00", "AM", "11:00", "AM"]
	const restaurantHoursYesterday = hoursObject[yesterday].split(" "); // ["5:00", "AM", "11:00", "AM"]

	//NOTE: If current time & closed time is AM
	if (restaurantHoursYesterday[0] !== "Closed" && restaurantHoursYesterday[3] === "AM") {
		const yesterdayOpenHour = restaurantHoursYesterday[0].split(":");
		const yesterdayClosedHour = restaurantHoursYesterday[2].split(":");
		// Final check to know if the AM time is extending the day - if Open time is > closed time (11am = 1100 > 1am = 100)
		if (parseInt(yesterdayClosedHour[0] + yesterdayClosedHour[1]) < parseInt(yesterdayOpenHour[0] + yesterdayOpenHour[1])) {
			if (hour < parseInt(yesterdayClosedHour[0] + yesterdayClosedHour[1])) {
				return true;
			}
		}
	}
	//NOTE: Check if Closed
	if (restaurantHoursToday[0] === "Closed") return false;

	const restaurantOpenHours = restaurantHoursToday[0].split(":");
	const restaurantCloseHours = restaurantHoursToday[2].split(":");

	const openMeridian = restaurantHoursToday[1];
	const closedMeridian = restaurantHoursToday[3];

	const openHour =
		openMeridian === "AM"
			? parseInt(restaurantOpenHours[0] + restaurantOpenHours[1])
			: parseInt(restaurantOpenHours[0] + restaurantOpenHours[1]) + 1200;

	const closedHour =
		closedMeridian === "AM"
			? parseInt(restaurantCloseHours[0] + restaurantCloseHours[1])
			: parseInt(restaurantCloseHours[0] + restaurantCloseHours[1]) + 1200;

	//NOTE: Normal check: Current > open && Current < closed
	if (hour > openHour && hour < closedHour) {
		return true;
	}

	//NOTE: If current time is PM & closed time is AM
	if (hour > openHour && restaurantHoursToday[3] === "AM") {
		return true;
	}

	return false;
}

module.exports = {
	isOpen,
};

// var fakeObject = {
// 	// Normal
// 	mon: "5:00 AM 11:00 AM",
// 	tue: "5:00 AM 11:00 AM",
// 	wed: "11:00 AM 10:00 PM",
// 	thu: "11:00 AM 8:00 PM",
// 	fri: "11:00 AM 8:00 PM",
// 	sat: "11:00 AM 3:00 PM",
// 	sun: "Closed",
// };

// console.log(timeHelper.isOpen(fakeObject));
