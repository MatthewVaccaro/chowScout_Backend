
exports.up = function(knex) {
    return knex.schema.createTable('restaurants', (table)=>{
        table.increments('id')
        table.text('businessName').notNullable()
        table.text('cuisine').notNullable()
        table.text('streetAddress1').notNullable()
        table.text('streetAddress2')
        table.text('city')
        table.integer('state_ref').references('id').inTable('states').onUpdate('CASCADE').onDelete('CASCADE')
        table.integer('zip')
        table.text('phone')
        table.float('lat')
        table.float('lon')
        table.boolean('washed').notNullable().defaultTo(false)

    })
}
    
    exports.down = function(knex) {
        return knex.schema.dropTableIfExists('restaurants')
    };
    
   