import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import DisplayClient from './DisplayClient';

@inject('store')
@observer
class BusinessClints extends Component {

        componentDidMount (){
         this.props.store.getClients();
        }
      

  render() {
    return (
      <div>
        {this.props.store.clients.map((item, index)  => <DisplayClient key={item.id} client={item} />) }
        
      </div>
    )
  }
}

export default BusinessClints

