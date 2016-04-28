import React from 'react'

class StoreTN extends React.Component {
  constructor(props) {
    super(props)
  }

  render(){
    return (
      <div className='storeTN'>
        <img className='storeTNLogo' src={this.props.logo}/>
        <div className="storeTNAllItems">
          <div className='storeTNFeatureItem'>{this.props.items[0].name}</div>
          <div className='storeTNItemWrapper'>
            <div className='storeTNItem'>{this.props.items[1].name} </div>
            <div className='storeTNItem'>{this.props.items[2].name} </div>
          </div>
        </div>
        <h4>{this.props.name}</h4>
      </div>
    )}}

export default StoreTN
