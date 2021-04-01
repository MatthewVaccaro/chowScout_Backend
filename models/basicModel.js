const db = require('../data/config');

function fullTable(table){
	return db(table)
}

function findById(id, table) {
	return db(table).where({ id });
}

async function add(data, table) {
	return db.insert(data).into(table).returning('id').then((res) => {
		return findById(res[0], table);
	});
}

function findAll(table, where, value) {
		return db(table).where(where, value);
	
}

function findByAny(ref1, ref2, table) {
	return db(table).where(ref1, ref2);
}

function remove(id, table) {
	return db(table).where({ id }) ? db(table).where({ id }).del() : null;
}

function removeByRef(id, ref ,table) {
	return db(table).where(id, ref) ? db(table).where({ id }).del() : null;
}

function update(id, changes, table) {
	return db(table).where({ id }).update(changes).then(() => {
		return findById(id, table);
	});
}


module.exports = {
	fullTable,
    findById,
    add,
	findAll,
	findByAny,
	remove,
	removeByRef,
	update
};

