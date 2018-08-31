import React, { Component } from 'react'
import { observer, inject } from 'mobx-react';


@inject("store")
@observer
class BusinessList extends Component {
  render() {
    return (
      <div>
        {this.props.store.business.map((item) => <div>123</div>)}
      </div>
    )
  }
}

export default BusinessList
