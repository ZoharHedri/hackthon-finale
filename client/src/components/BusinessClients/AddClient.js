import React, { Component } from 'react'; 
import { inject, observer } from '../../../node_modules/mobx-react';
import axios from 'axios';

@inject('store')
@observer
class AddClient extends Component {

    handleChange = event => {
        this.props.store.setClient({ key: event.target.name, value: event.target.value  })
    }

    handleSubmit = event =>{
      // Prevent the default behavior of the page (refresh)-using in forms
      event.preventDefault();
      axios.post('/bussiness/client/', this.props.store.client)
      .then(res => console.log(res.data))
      .catch(err =>console.log(err.msg));
        
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
