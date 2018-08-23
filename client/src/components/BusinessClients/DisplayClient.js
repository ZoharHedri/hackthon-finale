import React, { Component } from 'react'

 class DisplayClient extends Component {
  render() {
    return (
      <div>
        <div>{this.props.client.name}</div>
        <div>{this.props.client.phone}</div>
        <div>{this.props.client.email}</div>
        
        
        
        
      </div>
    )
  }
}

export default DisplayClient
