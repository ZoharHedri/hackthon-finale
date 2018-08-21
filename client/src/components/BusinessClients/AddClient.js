import React, { Component } from 'react'; 
import { inject, observer } from '../../../node_modules/mobx-react';

@inject('store')
@observer
class AddClient extends Component {

    handleChange = event => {
        this.this.props.store.setRegister({ key: event.target.name, value: event.target.value  })
    }

    handleSubmit = event =>{
        
    }



  render() {
    return (
      <div>
            <form onSubmit={this.handleSubmit} >
                <input onChange={this.handleChange} name="name" type="text" placeholder="Name" />
                <input onChange={this.handleChange} name="phone" type="text" placeholder="Phone" />
                <input onChange={this.handleChange} name="email" type="email" placeholder="Email" />
                <input onChange={this.handleChange} name="password" type="password" placeholder="Password" />
                <button type="submit">Register</button>
                
                
                
                
            </form>
        
      </div>
    )
  }
}

export default AddClient
