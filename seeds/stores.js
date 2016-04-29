
exports.seed = function(knex, Promise) {
  return Promise.join(
    // Deletes ALL existing entries
    knex('stores').del(),

    // Inserts seed entries
    knex('stores').insert({storeID: 100, name: 'Nike', logo: './data/swoosh.png'}),
    knex('stores').insert({storeID: 101, name: 'Coogi', logo: './data/coogi.gif'}),
    knex('stores').insert({storeID: 102, name: 'Oakley', logo: './data/oakley.jpg'}),
    knex('stores').insert({storeID: 103, name: 'Nintendo', logo: './data/nintendo.png'})
  );
};
