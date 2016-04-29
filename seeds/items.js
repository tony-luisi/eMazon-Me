
exports.seed = function(knex, Promise) {
  return Promise.join(
    // Deletes ALL existing entries
    knex('items').del(),

    // Inserts seed entries
    knex('items').insert({itemID: 200, storeID: 100, name: 'Nike Air Max 90', image: '../data/shoe.jpg', colour: 'Infrared', start_price: '$100', buynow_price: '$220'}),
    knex('items').insert({itemID: 201, storeID: 100, name: 'Adidas Runners', image: '../data/shoe.jpg', colour: 'Blue', start_price: '$100', buynow_price: '$220'}),
    knex('items').insert({itemID: 202, storeID: 100, name: 'Asic Shit-Kent 360', image: '../data/shoe.jpg', colour: 'Piss stain yellow', start_price: '$100', buynow_price: '$220'}),
    knex('items').insert({itemID: 203, storeID: 101, name: 'Nike Air Max 90', image: '../data/shoe.jpg', colour: 'Infrared', start_price: '$100', buynow_price: '$220'}),
    knex('items').insert({itemID: 204, storeID: 101, name: 'Adidas Runners', image: '../data/shoe.jpg', colour: 'Blue', start_price: '$100', buynow_price: '$220'}),
    knex('items').insert({itemID: 205, storeID: 101, name: 'Asic Shit-Kent 360', image: '../data/shoe.jpg', colour: 'Piss stain yellow', start_price: '$100', buynow_price: '$220'}),
    knex('items').insert({itemID: 206, storeID: 102, name: 'Nike Air Max 90', image: '../data/shoe.jpg', colour: 'Infrared', start_price: '$100', buynow_price: '$220'}),
    knex('items').insert({itemID: 207, storeID: 102, name: 'Adidas Runners', image: '../data/shoe.jpg', colour: 'Blue', start_price: '$100', buynow_price: '$220'}),
    knex('items').insert({itemID: 208, storeID: 102, name: 'Asic Shit-Kent 360', image: '../data/shoe.jpg', colour: 'Piss stain yellow', start_price: '$100', buynow_price: '$220'}),
    knex('items').insert({itemID: 209, storeID: 103, name: 'Nike Air Max 90', image: '../data/shoe.jpg', colour: 'Infrared', start_price: '$100', buynow_price: '$220'}),
    knex('items').insert({itemID: 210, storeID: 103, name: 'Adidas Runners', image: '../data/shoe.jpg', colour: 'Blue', start_price: '$100', buynow_price: '$220'}),
    knex('items').insert({itemID: 211, storeID: 103, name: 'Asic Shit-Kent 360', image: '../data/shoe.jpg', colour: 'Piss stain yellow', start_price: '$100', buynow_price: '$220'})

  );
};