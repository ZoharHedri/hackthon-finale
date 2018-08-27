import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect } from 'react-router-dom';
import BussinessRegister from './components/BussinessRegister/BussinessRegister';
import Login from './components/Login/Login';
import ForgotPassword from './components/ForgotPassword/ForgotPassword';
import ResetPassword from './components/ResetPassword/ResetPassword';
import AddClient from './components/BusinessClients/AddClient';
import BusinessClints from './components/BusinessClients/BusinessClints';
import Bussiness from './components/Bussiness/Bussiness';
import { inject } from '../node_modules/mobx-react';

@inject("store")
class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          {/* TODO: here we define our routes */}

          <Route exact path="/" component={Login} />
          <Route exact path="/password/forgot" component={ForgotPassword} />
          <Route exact path="/password/reset/:token" component={ResetPassword} />
          <Route exact path="/bussiness/register" component={BussinessRegister} />
          <Route exact path="/client/register" component={AddClient} />

          <Route path="/business" component={Bussiness} />
          {/* <ResetPassword />
          <BussinessRegister />
          <Route exact path="/reset-password/:token" component={ResetPassword} /> */}
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
