
class ItemListing extends React.Component {
  constructor(props){
    super(props)
  }

  render () {
    return (
      <div className="blah">
        <h2>{this.props.name}</h2>
        <img src={this.props.imageRef}/>
        <h3>start price: {this.props.start_price}</h3>
        <h3>buy now price: {this.props.buynow_price}</h3>
        <div className='dummyShopFront'></div>
        <div className='dummyShopFront'></div>
      </div>
    )
  }
}

export default ItemListing
