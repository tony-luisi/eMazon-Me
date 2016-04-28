import React from 'react'

class StoreSideBar extends React.Component {
  constructor(props) {
    super(props)
  }

  render () {
    return (
        <div className="storeSideBar">
        	<img className="storeSideBarLogo" src={this.props.image} />
        	<h3>{this.props.name}</h3>
        	<ul>
        		<li>Tops</li>
        		<li>bottoms</li>
        		<li>shoes</li>
        		<li>accesories</li>
        	</ul>
        </div>
    )}}

export default StoreSideBar
