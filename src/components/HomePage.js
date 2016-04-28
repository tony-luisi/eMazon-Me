import React from 'react'
import SearchBar from './SearchBar'
import StoresListings from './StoresListings'

import testData from '.././data/thumbnailSampleData'

class HomePage extends React.Component {
  constructor(props) {
    super(props)
  }

  render () {
    return (
      <div className="homePage">
        <h1>HomePage: SearchBar & StoresListings</h1>
        <SearchBar />
        <StoresListings storeTNs={testData} />
      </div>
    )}}

export default HomePage
