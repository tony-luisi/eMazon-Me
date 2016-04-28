import React from 'react'
import { render } from 'react-dom'
// import App from './components/app'
import FrontPage from './components/FrontPage'
import {storeTNs} from './data/sampleData'
//render(<App name='eMazon-Me' />, document.querySelector('main'))
render(<FrontPage storeTNs={storeTNs}/>, document.querySelector('body'))
console.log('welcome to eMazon-Me')
