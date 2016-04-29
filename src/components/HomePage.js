import React from 'react'
import SearchBar from './SearchBar'
import StoresListings from './StoresListings'
import request from 'superagent'

import testData from '.././data/thumbnailSampleData'

class HomePage extends React.Component {
  constructor(props) {
    super(props)
    this.state = { testData: testData }
  }

  componentDidMount(){
    request.get('/stores').end(function(err, res){
      console.log('error', err)
      var storeData = JSON.parse(res.text)
      console.log(storeData)
      this.setState({ testData: storeData })
    }.bind(this))
  }


  render () {
    return (
      <div className="homePage">
        <SearchBar />
        <StoresListings storeTNs={testData} />
      </div>
    )}}

export default HomePage
