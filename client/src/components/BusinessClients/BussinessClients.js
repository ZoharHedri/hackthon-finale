import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import DisplayClient from './DisplayClient';
import './BussinessClients.scss';

@inject('store')
@observer
class BussinessClients extends Component {

  componentDidMount() {
    this.props.store.getClients();
  }


  render() {
    return (
      <div className="clients">
        {this.props.store.clients.length > 0 &&
          <div className="clients__headlines">
            <div className="clients__header">
              Name
          </div>
            <div className="clients__header">
              Phone
          </div>
            <div className="clients__header">
              Email
          </div>
            <div className="clients__header">
              upcoming events
          </div>
            <div className="clients__header">
              Today
          </div>
          </div>
        }
        {this.props.store.clients.map((item, index) => <DisplayClient key={item._id} client={item} />)}
      </div>
    )
  }
}

export default BussinessClients;

