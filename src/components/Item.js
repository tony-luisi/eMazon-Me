import React from 'react'
import { getItemByID } from '.././data/sampleData'
import BuyItem from './BuyItem'

class Item extends React.Component {
  constructor(props) {
    super(props)
    var buy = []
    this.state = { buy: buy }
  }

  componentWillMount() {
    var itemInfo = getItemByID(parseInt(this.props.params.itemID))
    this.setState({
      itemInfo: itemInfo
    })
  }

  showForm() {
    this.setState({ buy: ['Tony'] })
  }

  render() {
    return (
      <div className="item">
        <h2>{this.state.itemInfo.name}</h2>
        <img src={this.state.itemInfo.image}/>
        <h3>Starting price: {this.state.itemInfo.start_price}</h3>
        <h3>Buy Now price: {this.state.itemInfo.buynow_price}</h3>
        <button className='button' onClick ={this.showForm.bind(this)}>Buy now!</button>
        {this.state.buy.map((element) => {
          return <BuyItem />
        })}
      </div>
    )}}

export default Item
