import sampleItems from './sampleData'

var stores = [
  {
    storeID: 100,
    name: "Nike",
    logo: "./data/swoosh.png",
    items: sampleItems
  },
  {
    storeID: 101,
    name: "Coogi",
    logo: "./data/coogi.gif",
    items: sampleItems
  },
  {
    storeID: 102,
    name: "Oakley",
    logo: "./data/oakley.jpg",
    items: sampleItems
  },
  {
    storeID: 103,
    name: "Nintendo",
    logo: "./data/nintendo.png",
    items: sampleItems
  }
]

function getStoreByID (id) {
  var store = stores.filter( i => i.storeID === id)
  return store[0]
}

export default stores

export { getStoreByID }
