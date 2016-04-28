import React from 'react'

class ItemTN extends React.Component {
  constructor(props) {
    super(props)
  }

  render () {
    return (
      <div className="itemTN">
        <h2>Item TN: {this.props.name}</h2>
        <img src={this.props.image}/>
        <h3>start price: {this.props.start_price}</h3>
        <h3>buy now price: {this.props.buynow_price}</h3>
      </div>
    )}}

export default ItemTN
