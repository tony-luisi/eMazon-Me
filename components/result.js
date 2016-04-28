import React from 'react'

class Item extends React.Component{
  constructor(props){
    super(props)
    this.state = {}
  }
  render(){
    return (
      <div>
        <h2>{this.props.name}</h2>
        <img src={this.props.imageRef}/>
        <h3>start price: {this.props.start_price}</h3>
        <h3>buy now price: {this.props.buynow_price}</h3>
      </div>
    )
  }
}

export default Item
