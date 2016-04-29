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
    <div>
      <div className="row">
        <div className="medium-centered large-centered">
          <img src={"/"+this.state.storeInfo.logo}/>
        </div>
      </div>
        <div className="row small-up-1 medium-up-2 large-up-4">
          {this.state.storeInfo.items.map( i =>
          <div className='column' key={i.itemID}>
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
