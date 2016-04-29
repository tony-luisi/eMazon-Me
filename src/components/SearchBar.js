import React from 'react'

class SearchBar extends React.Component {
  constructor(props) {
    super(props)
  }

	render () {
		return (
			<div className='searchBar'>
		    <form>
          <div className='input-group'>
            <input className='input-group-field' type="text" placeholder="Search..." required />
            <div className="input-group-button">
    		      <input className='button' type="button" value="Search" />
            </div>
          </div>
		    </form>
		  </div>
		)}}

export default SearchBar
