import React from 'react'

class StoreTN extends React.Component {
  constructor(props) {
    super(props)
  }

  render(){
    return (
      <div>
        <h2>{this.props.name}</h2>
        <img className='thumbnail' src={this.props.logo} style={{width:'304px',height:'228px'}}/>
        <div className="storeTNAllItems">
          <div className='storeTNFeatureItem'>{this.props.items[0].name}</div>
          <div className='storeTNItemWrapper'>
            <div className='storeTNItem'>{this.props.items[1].name} </div>
            <div className='storeTNItem'>{this.props.items[2].name} </div>
          </div>
        </div>

      </div>
    )}}

export default StoreTN
