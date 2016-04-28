var results = [{
      itemID: 200,
      name: "Nike Air Max 90",
      image: "../data/shoe.jpg",
      colour: "Infrared",
      start_price: "$100",
      buynow_price: "$220"
    },
    {
      itemID: 201,
      name: "Adidas Runners",
      image: "../data/shoe.jpg",
      colour: "Blue",
      start_price: "$100",
      buynow_price: "$220"
    },
    {
      itemID: 202,
      name: "Asic Shit-Kent 360",
      image: "../data/shoe.jpg",
      colour: "Piss stain yellow",
      start_price: "$100",
      buynow_price: "$220"
    }
  ]

function getItemByID (id) {
  var item = results.filter( i => i.itemID === id)
  return item[0]
}

export default results

export { getItemByID }
