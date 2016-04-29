import React from 'react'
import results from '../data/sampleData'
import { browserHistory } from 'react-router'

class SearchBar extends React.Component {
  constructor(props) {
    super(props)
  }

  getItemByName() {
    const searchValue = this.refs.Search.value.toLowerCase()
    var item = results.filter( i => i.name.toLowerCase() === searchValue)
    const id = item[0].itemID;
    browserHistory.push(`/item/${id}`)
    return item[0]
  }

	render () {
		return (
			<div className='searchBar'>
		    <form>
          <div className='input-group'>
            <input className='input-group-field' type="text" placeholder="Search..." ref="Search" />
            <div className="input-group-button">
    		      <input className='button' type="button" value="Search" onClick={this.getItemByName.bind(this)}/>
            </div>
          </div>
		    </form>
		  </div>
		)}}

export default SearchBar
