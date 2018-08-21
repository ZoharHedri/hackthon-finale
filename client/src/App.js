import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom'
import Activits from './components/BussinessRegister/Activits'

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          {/* TODO: here we define our routes */}
          <Activits/>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
