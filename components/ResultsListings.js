import React from 'react'
import ItemTN from './ItemTN'

class ResultsListings extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="resultsListings">
        <h1>Results Listings:</h1>
        <div className="resultsListingsItems">
          {this.props.resultItems.map( i =>
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

export default ResultsListings
