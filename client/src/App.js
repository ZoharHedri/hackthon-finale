import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect } from 'react-router-dom';
import { inject, observer } from '../node_modules/mobx-react';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import Loadable from 'react-loadable';
import Loading from './components/Loading/Loading';


const AsyncLogin = Loadable({
  loader: () => import('./components/Login/Login'),
  loading: Loading,
  delay: 500
})
const AsyncForgotPassword = Loadable({
  loader: () => import('./components/ForgotPassword/ForgotPassword'),
  loading: Loading,
  delay: 500
})
const AsyncResetPassword = Loadable({
  loader: () => import('./components/ResetPassword/ResetPassword'),
  loading: Loading,
  delay: 500
})
const AsyncBussinessRegister = Loadable({
  loader: () => import('./components/BussinessRegister/BussinessRegister'),
  loading: Loading,
  delay: 500
})
const AsyncAddClient = Loadable({
  loader: () => import('./components/BusinessClients/AddClient'),
  loading: Loading,
  delay: 500
})
const AsyncBussiness = Loadable({
  loader: () => import('./components/Bussiness/Bussiness'),
  loading: Loading,
  delay: 500
})
const AsyncClient = Loadable({
  loader: () => import('./components/Client/Client'),
  loading: Loading,
  delay: 500
})

@inject("store")
@observer
class App extends Component {
  render() {
    return (
      <ErrorBoundary>
        <BrowserRouter>
          <div>
            <Route exact path="/" component={AsyncLogin} />
            <Route path="/business" render={(props) => (
              this.props.store.userStatus.loggedIn ? <AsyncBussiness {...props} /> : <Redirect to="/" />
            )} />
            <Route path="/client" render={(props) => (
              this.props.store.userStatus.loggedIn ? <AsyncClient {...props} /> : <Redirect to="/" />
            )} />
            <Route exact path="/password/forgot" component={AsyncForgotPassword} />
            <Route exact path="/password/reset/:token" component={AsyncResetPassword} />
            <Route exact path="/register/bussiness" component={AsyncBussinessRegister} />
            <Route exact path="/register/client" component={AsyncAddClient} />
          </div>
        </BrowserRouter>
      </ErrorBoundary>
    );
  }
}

export default App;
