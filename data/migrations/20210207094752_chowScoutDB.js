exports.up = function(knex) {
    return knex.schema
    .createTable('restaurants', (table)=>{
        table.increments('id')
        table.text('businessName').notNullable()
        table.text('cuisine').notNullable()
        table.text('streetAddress1').notNullable()
        table.text('streetAddress2')
        table.text('city')
        table.text('state')
        table.integer('zip')
        table.text('phone')
        table.float('lat')
        table.float('lon')
        table.boolean('washed').notNullable().defaultTo(false)

    }).createTable('dishTags', (table)=>{
        table.increments('id');
        table.text('tag').unique().notNullable();
        
    }).createTable('hours', (table) => {
        table.increments('id');
        table.integer('restaurant_ref').references('id').inTable('restaurants').onUpdate('CASCADE').onDelete('CASCADE')
        table.text('mon')
        table.text('tue')
        table.text('wed')
        table.text('thu')
        table.text('fri')
        table.text('sat')
        table.text('sun')

    }).createTable('menuGroups', (table) => {
        table.increments('id');
        table.integer('restaurant_ref').references('id').inTable('restaurants').onUpdate('CASCADE').onDelete('CASCADE')
        table.text('groupTitle').notNullable();

    }).createTable('dishes', (table) => {
        table.increments('id');
        table.integer('menuGroup_ref').references('id').inTable('menuGroups').onUpdate('CASCADE').onDelete('CASCADE') 
        table.text('dishTitle').notNullable();
        table.float('price')
        table.text('description')
        table.integer('tag_ref').references('id').inTable('dishTags').onUpdate('CASCADE').onDelete('CASCADE') 

    })
};

exports.down = function(knex) {
    return knex.schema
		.dropTableIfExists('dishes')
        .dropTableIfExists('hours')
        .dropTableIfExists('dishTags')
		.dropTableIfExists('menuGroups')
		.dropTableIfExists('restaurants')
  
};

// .createTable('dishTags', (table)=>{
//     table.increments('id');
//     table.text('tagTitle').notNullable();
    
// })