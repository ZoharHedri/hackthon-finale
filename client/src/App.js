import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect } from 'react-router-dom';
import BussinessRegister from './components/BussinessRegister/BussinessRegister';
import Login from './components/Login/Login';
import ForgotPassword from './components/ForgotPassword/ForgotPassword';
import ResetPassword from './components/ResetPassword/ResetPassword';
import AddClient from './components/BusinessClients/AddClient';
import Bussiness from './components/Bussiness/Bussiness';
import { inject, observer } from '../node_modules/mobx-react';
import Client from './components/Client/Client';

@inject("store")
@observer
class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <Route exact path="/" component={Login} />
          <Route path="/business" render={(props) => (
            this.props.store.userStatus.loggedIn ? <Bussiness {...props} /> : <Redirect to="/" />
          )} />
          <Route path="/client" render={(props) => (
            this.props.store.userStatus.loggedIn ? <Client {...props} /> : <Redirect to="/" />
          )} />
          <Route exact path="/password/forgot" component={ForgotPassword} />
          <Route exact path="/password/reset/:token" component={ResetPassword} />
          <Route exact path="/register/bussiness" component={BussinessRegister} />
          <Route exact path="/register/client" component={AddClient} />

        </div>
      </BrowserRouter>

    );
  }
}

export default App;
