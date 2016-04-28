import React, {Component} from 'react'

class StoreSideBar extends Component{

  constructor (props) {
    super(props)
  }

  render () {
    return (
        <div className="blah">
        	<img src={this.props.imageRef} />
        	<h3>{this.props.name}</h3>
        	<ul>
        		<li>Tops</li>
        		<li>bottoms</li>
        		<li>shoes</li>
        		<li>accesories</li>
        	</ul>
        </div>
    )
  }
}

export default StoreSideBar