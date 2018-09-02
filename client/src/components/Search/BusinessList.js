import React, { Component } from 'react'
import { observer, inject } from 'mobx-react';
import DisplayBussinessSearch from './DisplayBussinessSearch'

@inject("store")
@observer
class BusinessList extends Component {
  render() {
    return (
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {this.props.store.business.map((item) => <DisplayBussinessSearch key={item._id} {...item} />)}
      </div>
    )
  }
}

export default BusinessList
