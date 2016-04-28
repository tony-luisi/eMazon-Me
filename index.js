
import React from 'react'
import { render } from 'react-dom'
import FrontPage from './components/FrontPage'
import storeTNs from './data/thumbnailSampleData'


render(<FrontPage storeTNs={storeTNs}/>, document.querySelector('body'))

