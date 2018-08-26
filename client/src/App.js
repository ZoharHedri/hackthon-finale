import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import ActivityForm from './components/Activities/ActivityForm';
import Login from './components/Login/Login';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          {/* TODO: here we define our routes */}
          <Login />
          <ActivityForm />

        </div>
      </BrowserRouter>
    );
  }
}

export default App;
