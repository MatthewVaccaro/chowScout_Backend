
exports.up = function(knex) {
    return knex.schema.createTable('dishTags', (table)=>{
        table.increments('id');
        table.text('tag').unique().notNullable();
    })
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('dishTags')
  
};
