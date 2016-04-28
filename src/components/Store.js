import React from 'react'
import { Link } from 'react-router'
import ItemTN from './ItemTN'

import { getStoreByID } from '.././data/thumbnailSampleData'

class Store extends React.Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    var storeInfo = getStoreByID(parseInt(this.props.params.storeID))
    this.setState({
      storeInfo: storeInfo
    })
  }

  render () {
    return (
      <div className="store">
        <h1>Store Name: {this.state.storeInfo.name}</h1>
        <div className="store">
          {this.state.storeInfo.items.map( i =>
          <div key={i.itemID}>
          <Link to={`/item/${i.itemID}`}>
           <ItemTN name={i.name}
                   image={i.image}
                   start_price={i.start_price}
                   buynow_price={i.buynow_price}/>
                   </Link>
                   </div>
          )}
        </div>
      </div>
    )}}

export default Store
