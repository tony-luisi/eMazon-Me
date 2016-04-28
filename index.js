console.log("welcome to eMazon-Me")
import React from 'react'
import ReactDOM from 'react-dom'
import FrontPage from './components/FrontPage'
import ResultsPage from './components/ResultPage'
import results from './data/sampleData'


ReactDOM.render(
  <div>
  <FrontPage />
    <ResultsPage results={results}/>
  </div>
    , document.querySelector('body')
  )
