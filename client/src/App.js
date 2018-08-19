import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom'
import BussinessRegister from './components/BussinessRegister/BussinessRegister';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          {/* TODO: here we define our routes */}
          <BussinessRegister />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
