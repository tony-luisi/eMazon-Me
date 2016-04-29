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
        <div className="row small-up-1 medium-up-2 large-up-4">
          {this.props.storeTNs.map( tn =>
            <div className="column" key={tn.storeID}>
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

{/*<div class="column">
<img class="thumbnail" src="http://placehold.it/300x400">
<h5>Nulla At Nulla Justo, Eget</h5>
<p>$400</p>
<a href="#" class="button expanded">Buy</a>
</div>*/}
