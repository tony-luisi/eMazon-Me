import React from 'react'
import { render } from 'react-dom'
import { Router, Route, Link, browserHistory } from 'react-router'

import App from './components/App'
import HomePage from './components/HomePage'
import Store from './components/Store'
import Item from './components/Item'

console.log('test')

render((
  <Router history={browserHistory}>
    <Route path="/" component={App}>
			<Route path="home" component={HomePage}/>
			<Route path="/store/:storeID" component={Store}/>
			<Route path="/item/:itemID" component={Item}/>
		</Route>
  </Router>
), document.getElementById('wiggle'))

// app
// 	homepage
// 		searchBar
// 		storesListings
// 			storeTN  [has links to store/:storeID]
//
// 	store :storeID
// 		itemTN	   [has links to item/:itemID]
//
// 	resultsListings
// 		itemTN	   [has links to item/:itemID]
//
// 	item :itemID


// import React from 'react'
// import { render } from 'react-dom'
// import HomePage from './components/HomePage'
//
// import testData from '.././data/thumbnailSampleData'
//
// render(
// 	<HomePage stores={testData}/>,
// 	document.querySelector('body')
// )


// import React from 'react'
// import { render } from 'react-dom'
// import Store from './components/Store'
//
// import testData from './data/sampleData'
//
// render(
// 	<Store storeName="SampleStoreName" storeItems={testData}/>,
// 	document.querySelector('body')
// )


// import React from 'react'
// import { render } from 'react-dom'
// import ResultsListings from './components/ResultsListings'
//
// import testData from './data/sampleData'
//
// render(
// 	<ResultsListings resultItems={testData} />,
// 	document.querySelector('body')
// )


// import React from 'react'
// import { render } from 'react-dom'
// import Item from './components/Item'
//
// import testData from './data/sampleData'
// var oneItem = testData[0]
//
// render(
// 	<Item itemID={oneItem.itemID}
// 	 			name={oneItem.name}
// 				image={oneItem.image}
// 				start_price={oneItem.start_price}
// 				buynow_price={oneItem.buynow_price} />,
// 	document.querySelector('body')
// )
