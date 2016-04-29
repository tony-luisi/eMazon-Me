import React from 'react'

class StoreTN extends React.Component {
  constructor(props) {
    super(props)
  }

  render(){
    return (
      <div>
        <h4>{this.props.name}</h4>
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
{/*<div class="column">
<img class="thumbnail" src="http://placehold.it/300x400">
<h5>Nulla At Nulla Justo, Eget</h5>
<p>$400</p>
<a href="#" class="button expanded">Buy</a>
</div>*/}
