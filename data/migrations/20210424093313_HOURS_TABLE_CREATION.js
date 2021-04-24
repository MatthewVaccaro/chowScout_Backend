
exports.up = function(knex) {
    return knex.schema.createTable('hours', (table) => {
        table.increments('id');
        table.integer('restaurant_ref').references('id').inTable('restaurants').onUpdate('CASCADE').onDelete('CASCADE')
        table.text('mon')
        table.text('tue')
        table.text('wed')
        table.text('thu')
        table.text('fri')
        table.text('sat')
        table.text('sun')

    })
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('hours')
};
