
exports.up = function(knex) {
    return knex.schema.createTable('menuGroups', (table) => {
        table.increments('id');
        table.integer('restaurant_ref').references('id').inTable('restaurants').onUpdate('CASCADE').onDelete('CASCADE')
        table.text('groupTitle').notNullable();
    })
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('menuGroups')
};
