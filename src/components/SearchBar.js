import React from 'react'
import results from '../data/sampleData'

class SearchBar extends React.Component {
  constructor(props) {
    super(props)
  }

  getItemByName(name) {
    var item = results.filter( i => i.itemName=== name)
    const searchValue = this.refs.Search.value
    return item[0]
  }

	render () {
		return (
			<div className='searchBar'>
        <h3>SearchBar:</h3>
		    <form>
		      <input className='search-bar' type="text" placeholder="Search..." ref="Search" />
		      <input className='search-btn' type="button" value="Search" onClick={this.getItemByName.bind(this)} />
		    </form>
		  </div>
		)}}

export default SearchBar
