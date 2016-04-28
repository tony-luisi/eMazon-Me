import React from 'react'

class SearchBar extends React.Component {
  constructor(props) {
    super(props)
  }

	render () {
		return (
			<div className='searchBar'>
        <h3>SearchBar:</h3>
		    <form>
		      <input className='search-bar' type="text" placeholder="Search..." required />
		      <input className='search-btn' type="button" value="Search" />
		    </form>
		  </div>
		)}}

export default SearchBar
