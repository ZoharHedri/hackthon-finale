import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom'
import BussinessRegister from './components/BussinessRegister/BussinessRegister';
import Login from './components/Login/Login';
class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          {/* TODO: here we define our routes */}
          <BussinessRegister />
          <Login />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
