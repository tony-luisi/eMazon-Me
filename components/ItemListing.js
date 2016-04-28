
class ItemListing extends React.Component {
  constructor(){
    super()
    this.state = {
        name: "Nike Air Max 90",
        imageRef: "./shoe.jpg",
        colour: "Infrared",
        start_price: "$100",
        buynow_price: "$220"
    }
  }
  placeBid( e ){
    this.setState( {start_price: e.target.value} )
  }

  mount(){
    ReactDOM.render( <BidWindow
      currentprice={this.state.start_price}
      placeBid={this.placeBid.bind(this)}/>, document.getElementById( 'bid' ) )
  }
  unmount(){
    console.log( "unmounted" )
    ReactDOM.unmountComponentAtNode( document.getElementById( 'bid' ) )
  s}


  render () {
    return (
      <div className="blah">
        <h2>{this.state.name}</h2>
        <img src={this.state.imageRef}/>
        <h3>start price: {this.state.start_price}</h3>
        <h3>buy now price: {this.state.buynow_price}</h3>
        <button onClick={this.mount.bind(this)}>Bid</button>
        <div id='bid'></div>
        <div className='dummyShopFront'></div>
        <div className='dummyShopFront'></div>
      </div>
    )
  }
}

export default ItemListing
