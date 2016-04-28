import React from 'react'
import { Link } from 'react-router'
import StoreTN from './StoreTN'

class StoresListings extends React.Component {
  constructor(props) {
    super(props)
  }

  render () {
    return (
      <div className="storesPage">
        <h1>Stores Listings:</h1>
        <div className="storesPageStoreTNs">
          {this.props.storeTNs.map( tn =>
            <div key={tn.storeID}>
            <Link to={`/store/${tn.storeID}`}>
              <StoreTN
                       name={tn.name}
                       logo={tn.logo}
                       items={tn.items} />
                       </Link>
                       </div>
          )}
        </div>
      </div>
    )}}

export default StoresListings
