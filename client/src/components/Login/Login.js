import React, { Component } from 'react'
import { inject, observer } from '../../../node_modules/mobx-react';
import axios from 'axios'
import './Login.scss';

@inject("store")
@observer
class Login extends Component {
    handleSubmit = event => {
        event.preventDefault();
        // request from server
        axios.post('/bussiness/login', this.props.store.login)
            .then(res => {
                if (res.data.success) {
                    // we saved the token from the server in localstorage
                    localStorage.setItem('TOKEN', res.data.token);
                }
            });
    }
    handleChange = event => {
        this.props.store.setLogin({ key: event.target.name, value: event.target.value });
    }
    render() {
        return (
            <div className="login">
                <div className="login__hero">
                    <img className="login__img" src="/images/ballpen-blur-close-up-461077.jpg" alt="" />
                </div>
                <div className="login__main">
                    <h1 className="login__header">Member Login</h1>
                    <form autoComplete="off" className="login__form" onSubmit={this.handleSubmit}>
                        <div className="login__input-group">
                            <svg className="login__icon">
                                <use xlinkHref="/sprite.svg#icon-mail4" />
                            </svg>
                            <input className="login__input" onChange={this.handleChange} name="email" type="email" placeholder="username" value={this.props.store.login.email} />
                        </div>
                        <div className="login__input-group">
                            <svg className="login__icon">
                                <use xlinkHref="/sprite.svg#icon-key" />
                            </svg>
                            <input className="login__input" onChange={this.handleChange} name="password" type="password" placeholder="password" value={this.props.store.login.password} />
                        </div>
                        <button className="login__btn" type="submit">Login</button>
                        <span className="login__forgot">Forgot your password?</span>
                    </form>
                    <span className="login__account">Create an account</span>
                </div>
            </div>
        )
    }
}

export default Login
