import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import BussinessRegister from './components/BussinessRegister/BussinessRegister';
import Login from './components/Login/Login';
import ForgotPassword from './components/ForgotPassword/ForgotPassword';
import ResetPassword from './components/ResetPassword/ResetPassword';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          {/* TODO: here we define our routes */}
          <Login />
          <ForgotPassword />
          <ResetPassword />
          <BussinessRegister />
          <Route exact path="/reset-password/:token" component={ResetPassword} />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
