import React, { Component } from 'react'
import { inject, observer } from '../../../node_modules/mobx-react';
import axios from 'axios'

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
            <div>
                <form onSubmit={this.handleSubmit}>
                    <input onChange={this.handleChange} name="email" type="email" placeholder="email" value={this.props.store.login.email} />
                    <input onChange={this.handleChange} name="password" type="password" placeholder="password" value={this.props.store.login.password} />
                    <button type="submit">Login</button>
                </form>
            </div>
        )
    }
}

export default Login
