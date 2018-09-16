import React, { Component } from 'react'
import './DisplayClient.scss';

class DisplayClient extends Component {
  render() {
    return (
      <div className="client">
        <div className="client__value client__value--ml">
          <div className="client__img-box">
            <img className="client__img" src={`/images/${this.props.client.avatarUrl}`} alt="user images" />
          </div>
          <div className="client__name" >{this.props.client.name}</div>
        </div>
        <div className="client__value">{this.props.client.phone}</div>
        <div className="client__value">{this.props.client.email}</div>
        <div className="client__value client__value--center">
          <span className="client__tag">{this.props.client.events}</span>
        </div>
        <div className="client__value">
          <span className="client__today">{this.props.client.todayEvent ? "YES" : "NO"}</span>
        </div>
      </div>
    )
  }
}

export default DisplayClient
