import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect } from 'react-router-dom';
import BussinessRegister from './components/BussinessRegister/BussinessRegister';
import Login from './components/Login/Login';
import ForgotPassword from './components/ForgotPassword/ForgotPassword';
import ResetPassword from './components/ResetPassword/ResetPassword';
import AddClient from './components/BusinessClients/AddClient';
import Bussiness from './components/Bussiness/Bussiness';
import { inject, observer } from '../node_modules/mobx-react';
import Search from './components/Search/SearchBar';
// import Dashboard from './components/Dashboard/Dashboard';
import BusinessList from './components/Search/BusinessList';

@inject("store")
@observer
class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          {/* <Dashboard/> */}
          {/* TODO: here we define our routes */}

          <Route exact path="/" component={Login} />
          <Route path="/business" render={(props) => (
            this.props.store.userStatus.loggedIn ? <Bussiness {...props} /> : <Redirect to="/" />
          )} />
          <Route path = "/client/dashboard" component={Search} />
          <Route exact path="/password/forgot" component={ForgotPassword} />
          <Route exact path="/password/reset/:token" component={ResetPassword} />
          <Route exact path="/bussiness/register" component={BussinessRegister} />
          <Route exact path="/client/register" component={AddClient} />

          {/* <Route path="/business" component={Bussiness} /> */}
          {/* <ResetPassword />
          <BussinessRegister />
          <Route exact path="/reset-password/:token" component={ResetPassword} /> */}
          <BusinessList/>
        </div>
      </BrowserRouter>
      
    );
  }
}

export default App;
