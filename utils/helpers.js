
function checkLength(arr, message, res) {
	if (arr.length === 0) {
		return res.status(400).json({ message: message });
	}
}

function lowerCase(string) {
	const lowerCased = string.toLowerCase();
	return lowerCased;
}

function checkUnique(arr, message, res) {
	if (arr.length > 0) {
		return res.status(400).json({ message: message });
	}
}

module.exports = {
	checkLength,
	lowerCase,
	checkUnique
};