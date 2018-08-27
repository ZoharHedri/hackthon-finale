import React, { Component } from 'react'
import { inject, observer } from 'mobx-react';
import './Login.scss';
import { Link } from 'react-router-dom';
import ErrorList from '../ErrorList/ErrorList';
import { Route, Redirect } from 'react-router-dom';
import { Bussiness } from '../Bussiness/Bussiness';


@inject("store")
@observer
class Login extends Component {
    handleSubmit = event => {
        event.preventDefault();
        // request from server
        this.props.store.login();
    }
    handleChange = event => {
        this.props.store.setLoginForm({ key: event.target.name, value: event.target.value });
    }
    componentDidMount() {
        this.props.store.automaticLogin();
    }
    componentWillUnmount() {
        this.props.store._clearErrors();
    }
    render() {
        debugger;
        return (
            <div className="login">
                <div className="login__hero">
                    <img className="login__img" src="/images/ballpen-blur-close-up-461077.jpg" alt="" />
                </div>
                <div className="login__main">
                    <h1 className="login__header">Member Login</h1>
                    <ErrorList />
                    <form autoComplete="off" className="login__form" onSubmit={this.handleSubmit}>
                        <div className="login__input-group">
                            <svg className="login__icon">
                                <use xlinkHref="/sprite.svg#icon-mail4" />
                            </svg>
                            <input className="login__input" onChange={this.handleChange} name="email" type="email" placeholder="username" value={this.props.store.loginForm.email} />
                        </div>
                        <div className="login__input-group">
                            <svg className="login__icon">
                                <use xlinkHref="/sprite.svg#icon-key" />
                            </svg>
                            <input className="login__input" onChange={this.handleChange} name="password" type="password" placeholder="password" value={this.props.store.loginForm.password} />
                        </div>
                        <button className="login__btn" type="submit">Login</button>
                        <Link className="login__forgot" to="/password/forgot">Forgot your password?</Link>
                    </form>
                    <span className="login__account">Create an account for <Link className="login__path" to="/bussiness/register">bussiness</Link> / <Link className="login__path login__path--red" to="/client/register">client</Link></span>
                </div>
                {this.props.store.userStatus.loggedIn && <Redirect to={this.props.store.userStatus.userModel} />}
            </div>
        )
    }
}

export default Login
