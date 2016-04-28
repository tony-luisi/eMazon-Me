import React, {Component} from 'react'

import StoreSideBar from './StoreSideBar'
class StoreItems extends Component{

  constructor (props) {
    super(props)
  }

  render () {
    return (
        <div className="blah">
          <h2>{this.props.name}</h2>
          <img src={this.props.imageRef}/>
          <h3>start price: {this.props.start_price}</h3>
          <h3>buy now price: {this.props.buynow_price}</h3>
        </div>
    )
  }
}

export default StoreItems
