import React from 'react'

class ItemTN extends React.Component {
  constructor(props) {
    super(props)
  }

  render () {
    return (
      <div className="itemTN">
        <h4>{this.props.name}</h4>
        <img src={this.props.image}/>
        <h4>Starting price: {this.props.start_price}</h4>
        <h4>Buy Now price: {this.props.buynow_price}</h4>
      </div>
    )}}

export default ItemTN
