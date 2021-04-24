
exports.up = function(knex) {
    return knex.schema.createTable('dishes', (table) => {
        table.increments('id');
        table.integer('restaurant_ref').references('id').inTable('restaurants').onUpdate('CASCADE').onDelete('CASCADE') 
        table.integer('menuGroup_ref').references('id').inTable('menuGroups').onUpdate('CASCADE').onDelete('CASCADE') 
        table.text('dishTitle').notNullable();
        table.float('price')
        table.text('description')
        table.integer('tag_ref').references('id').inTable('dishTags').onUpdate('CASCADE').onDelete('CASCADE') 

    })
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('dishes')
};
