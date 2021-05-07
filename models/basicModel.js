const db = require("../data/config");

function fullTable(table) {
	return db(table);
}

function findById(id, table) {
	return db(table).where({ id });
}

async function add(data, table) {
	return db
		.insert(data)
		.into(table)
		.returning("id")
		.then((res) => {
			return findById(res[0], table);
		});
}

function findWithFilter(row, value, table) {
	return db(table).where(row, value);
}

function findWithMultiFilter(filter = {}, table) {
	return db(table).where(filter);
}

function remove(id, table) {
	return db(table).where({ id }) ? db(table).where({ id }).del() : null;
}

function removeByRef(id, ref, table) {
	return db(table).where(id, ref) ? db(table).where({ id }).del() : null;
}

function update(id, changes, table) {
	return db(table)
		.where({ id })
		.update(changes)
		.then(() => {
			return findById(id, table);
		});
}

function searchQuery(searchString, id) {
	return db("dishes").where("dishTitle", "like", `%${searchString}%`).where("restaurant_ref", id);
}

module.exports = {
	fullTable,
	findById,
	add,
	findWithFilter,
	findWithMultiFilter,
	remove,
	removeByRef,
	update,
	searchQuery,
};
