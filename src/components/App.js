import React from 'react'
import { Link } from 'react-router'
import SearchBar from './SearchBar'

class App extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <div className="app">
        <div className="top-bar">
        <div className="top-bar-left">
        <ul className="menu">
        <li className="menu-text">e-mazon-me</li>
        <li><Link to={'/home'}>Home</Link></li>
        </ul>
        </div>
        </div>



        <div className="row">
          <img src="/data/logo.png" alt="" style={{}}/>
        </div>
        <div className='container'>
					{this.props.children}
				</div>
      </div>
    )}
  }

export default App
