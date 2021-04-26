
exports.up = function(knex) {
    return knex.schema
    .createTable('states', (table)=>{
        table.increments('id')
        table.text('stateName')
    })
  
};

exports.down = function(knex) {
    return knex.schema
		.dropTableIfExists('states')
  
};
