import React from 'react'
import { getItemByID } from '.././data/sampleData'

class Item extends React.Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    var itemInfo = getItemByID(parseInt(this.props.params.itemID))
    this.setState({
      itemInfo: itemInfo
    })
  }

  render() {
    return (
      <div className="item">
        <h2>Item Name: {this.state.itemInfo.name}</h2>
        <img src={this.state.itemInfo.image}/>
        <h3>start price: {this.state.itemInfo.start_price}</h3>
        <h3>buy now price: {this.state.itemInfo.buynow_price}</h3>
      </div>
    )}}

export default Item
