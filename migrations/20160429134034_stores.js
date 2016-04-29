
exports.up = function(knex, Promise) {
  console.log('create table')
  return knex.schema.createTableIfNotExists('stores', function(table) {
    table.increments('storeID')
    table.string('name')
    table.string('logo')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('stores')
    .then(function() {
      console.log('table dropped')
    })
};
