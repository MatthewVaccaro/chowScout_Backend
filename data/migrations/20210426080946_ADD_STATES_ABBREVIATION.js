
exports.up = function(knex) {
    return knex.schema.table('states', function (table) {
        table.string('abbreviation')
      })
};

exports.down = function(knex) {
    return knex.schema
    .dropTableIfExists('states')
};
