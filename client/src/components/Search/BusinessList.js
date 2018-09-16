import React, { Component } from 'react'
import { observer, inject } from 'mobx-react';
import DisplayBussinessSearch from './DisplayBussinessSearch';
import './BusinessList.scss';
import LoadingHOC from '../LoadingHOC/LoadingHOC';

@inject("store")
@observer
class BusinessList extends Component {
  componentWillUnmount() {
    // TODO: this line is not recommmended becuase we changeing the store from outside
    this.props.store.business.length = 0;
  }
  render() {
    return (
      <div className="bussinessList" >
        <LoadingHOC>
          {this.props.store.business.map((item) => <DisplayBussinessSearch key={item._id} {...item} />)}
        </LoadingHOC>
      </div>
    )
  }
}

export default BusinessList
