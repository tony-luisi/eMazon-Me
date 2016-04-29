import React from 'react'
import results from '../data/sampleData'
import { browserHistory } from 'react-router'

class SearchBar extends React.Component {
  constructor(props) {
    super(props)
  }

  getItemByName() {
    const searchValue = this.refs.Search.value
    var item = results.filter( i => i.name === searchValue)
    const id = item[0].itemID;
    browserHistory.push(`/item/${id}`)
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
