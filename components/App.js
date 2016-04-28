import React from 'react'
import { Link } from 'react-router'

class App extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <div className="app">
        <h1>App: Overall App Container</h1>
        <Link to={'/home'}>navigation to home</Link>
        <div className='content'>
					{this.props.children}
				</div>
      </div>
    )}}

export default App
