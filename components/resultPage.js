import React from 'react'

///displays page for results of a search( for individual results see 'result.js')

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
