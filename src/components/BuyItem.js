import React from 'react'
import { getItemByID } from '.././data/sampleData'

class BuyItem extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="item">
        <h1> buy now </h1>
        <form>
          First name: <input type="text" name="fname" /><br />
          Last name: <input type="text" name="lname" /><br />
          <input type="submit" defaultValue="Submit" />
      </form>
      </div>
    )}}

export default BuyItem
