
exports.up = function(knex, Promise) {
  console.log('create table')
  return knex.schema.createTableIfNotExists('items', function(table) {
    table.increments('itemID')
    table.integer('storeID')
    table.string('name')
    table.string('image')
    table.string('colour')
    table.string('start_price')
    table.string('buynow_price')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('items')
    .then(function() {
      console.log('table dropped')
    })
};