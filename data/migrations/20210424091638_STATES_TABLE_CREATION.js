
exports.up = function(knex) {
    return knex.schema
    .createTable('states', (table)=>{
        table.increments('id')
        table.text('stateName').notNullable()
    })
  
};

exports.down = function(knex) {
    return knex.schema
		.dropTableIfExists('states')
  
};
