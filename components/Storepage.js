import React, {Component} from 'react'
import StoreSideBar from './StoreSideBar'
import StoreItems from './StoreItems'
import Header from './Header'

class StorePage extends Component{

  constructor (props) {
    super(props)
  }

  render () {
    return (
        <div className="blah">
          <Header />
          <StoreSideBar name='nike'/>
          <div>
            {this.props.results.map( i =>
             <StoreItems
            name={i.name}
            imageRef={i.imageRef}
            start_price={i.start_price}/> )}
          </div>
        </div>
    )
  }
}

export default StorePage
