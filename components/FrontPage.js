import React, {Component} from 'react'
import StoreTN from './StoreTN'

class FrontPage extends Component{

  constructor (props) {
    super(props)
  }

  render () {
    return (
        <div className="blah">
            <h2>eMazon-Me</h2>
          <div className='search'>
              <form>
                <input className= 'search-bar' type="text" placeholder="Search..." required />
                <input className= 'search-bttn' type="button" value="Search" />
              </form>
            </div>
            {this.props.storeTNs.map( (storeTN) =>
              <StoreTN name={storeTN.name} items={storeTN.items} logo={storeTN.logo} />)}

        </div>
    )
  }
}

export default FrontPage
