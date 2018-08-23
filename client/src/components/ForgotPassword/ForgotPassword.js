import React, { Component } from 'react';
import axios from 'axios';
import './ForgotPassword.scss';


export class ForgotPassword extends Component {
    state = {
        email: ""
    }
    handleChange = e => {
        this.setState({ email: e.target.value });
    }
    handleSubmit = e => {
        e.preventDefault();
        axios.post('/bussiness/forgot-password', this.state)
            .then(res => console.log(res.data))
            .catch(err => console.log(`${err}`));
    }
    render() {
        return (
            <div className="forgot">
                <div className="forgot__hero">
                    <img className="forgot__img" src="/images/ballpen-blur-close-up-461077.jpg" alt="" />
                </div>
                <div className="forgot__main">
                    <div className="forgot__form-warp">
                        <h1 className="forgot__header">Forgot your Password?</h1>
                        <p>if you forgot your password, no worries: enter your email address<br /> and we'll send you a link you can use to pick a new password.</p>
                        <form autoComplete="off" className="forgot__form" onSubmit={this.handleSubmit}>
                            <input className="forgot__input" onChange={this.handleChange} type="email" name="email" placeholder="email" value={this.state.email} />
                            <button className="forgot__btn" type="submit">Reset My Password</button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default ForgotPassword
