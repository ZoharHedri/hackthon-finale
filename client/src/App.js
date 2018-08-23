import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom'
import BussinessRegister from './components/BussinessRegister/BussinessRegister';
import Login from './components/Login/Login';
import AddClient from './components/BusinessClients/AddClient';
import BusinessClints from './components/BusinessClients/BusinessClints';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          {/* TODO: here we define our routes */}
          <BussinessRegister />
          <Login />
          <Route path="/bussiness/clients" component={AddClient} />
          <BusinessClints/>
          {/* <AddClient /> */}
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
