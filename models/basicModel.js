const db = require('../data/config');

function findById(id, table) {
	return db(table).where({ id });
}

async function add(data, table) {
	return db.insert(data).into(table).returning('id').then((res) => {
		return findById(res[0], table);
	});
}

function findByAny(ref1, ref2, table) {
	return db(table).where(ref1, ref2);
}

module.exports = {
    findById,
    add,
	findByAny
};