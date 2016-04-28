import React from 'react'

class ResultsPage extends React.Component{
  constructor( props ){
    super( props )

  }

  render(){
    return (
      <div>
        <div id='a'>hello ben</div>
        {this.props.results.map( i =>
         <Result
        name={i.name}
        imageRef={i.imageRef}
        start_price={i.start_price}/> )}
      </div>
    )
  }
}


export default ResultsPage
