import React, { Component } from 'react';
import React from 'axios';
import { inject, observer } from 'mobx-react';
import Axios from 'axios';

@inject('store')
@observer
class BusinessClints extends Component {

        Clients = [];

    DisplayClients = event => {
        let token = JSON.parse(localStorage.getItem('TOKEN'));
        let opts = {}
        opts.headers = {autorithation:token}
        axios.get('/bussiness/client', opts)
           .then(res => console.log(res.data))
           .catch(err => console.log(err.msg));
    }





  render() {
    return (
      <div>
         
        
      </div>
    )
  }
}

export default BusinessClints

