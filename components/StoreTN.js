import React, {Component} from 'react'

class StoreTN extends Component{

  constructor (props) {
    super(props)
  }

  render(){
    return (
      <div className='storeTN'>
        <img className='storeTNLogo' src={this.props.logo}/>
        <div>
          <div className='storeTNFeatureItem'>{this.props.items[0]}</div>
          <div className='storeTNItemWrapper'>
            <div className='storeTNItem'>{this.props.items[1]} </div>
            <div className='storeTNItem'>{this.props.items[2]} </div>
          </div>
        </div>
        <h4>{this.props.name}</h4>
      </div>
    )
  }
}

export default StoreTN
