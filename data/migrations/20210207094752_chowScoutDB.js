exports.up = function(knex) {
    return knex.schema
    .createTable('restaurants', (table)=>{
        table.increments('id')
        table.text('businessName').notNullable()
        table.text('cuisine').notNullable()
        table.text('streetAddress1').notNullable()
        table.text('streetAddress2')
        table.text('city').notNullable()
        table.text('state').notNullable()
        table.intager('zip').notNullable()
        table.text('phone')
        table.intager('lat')
        table.intager('lon')
        table.boolean('washed').notNullable().defaultTo(false)

    }).createTable('menuGroups', (table) => {
        table.increments('id');
        table.intager('restaurant_ref').references('id').inTable('restaurants'); 
        table.text('groupTitle').notNullable();

    }).createTable('dishes', (table) => {
        table.increments('id');
        table.intager('menuGroup_ref').references('id').inTable('menuGroups'); 
        table.text('dishTitle').notNullable();
        table.intager('price')
        table.text('description')

    })
};

exports.down = function(knex) {
    return knex.schema
		.dropTableIfExists('dishes')
		.dropTableIfExists('menuGroups')
		.dropTableIfExists('restaurants')
  
};
