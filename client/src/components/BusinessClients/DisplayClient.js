import React, { Component } from 'react'
import './DisplayClient.scss';

class DisplayClient extends Component {
  render() {
    return (
      <div className="client">
        <div className="client__value client__value--ml">{this.props.client.name}</div>
        <div className="client__value">{this.props.client.phone}</div>
        <div className="client__value">{this.props.client.email}</div>
      </div>
    )
  }
}

export default DisplayClient
