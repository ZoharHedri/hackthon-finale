import React, { Component } from 'react'
import { observer, inject } from 'mobx-react';
import DisplayBussinessSearch from './DisplayBussinessSearch';
import './BusinessList.scss';

@inject("store")
@observer
class BusinessList extends Component {
  render() {
    return (
      <div className="bussinessList" >
        {this.props.store.business.map((item) => <DisplayBussinessSearch key={item._id} {...item} />)}
      </div>
    )
  }
}

export default BusinessList
