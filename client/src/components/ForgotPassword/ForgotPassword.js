import React, { Component } from 'react';
import ErrorList from '../ErrorList/ErrorList';
import './ForgotPassword.scss';
import { observer, inject } from 'mobx-react';

@inject("store")
@observer
export class ForgotPassword extends Component {
    handleChange = e => {
        this.props.store.setForgotPasswordForm({ key: e.target.name, value: e.target.value });
    }
    handleSubmit = e => {
        e.preventDefault();
        this.props.store.forgot();
    }
    componentWillUnmount() {
        this.props.store._clearErrors();
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
                        <p style={{ marginBottom: "16px" }}>if you forgot your password, no worries: enter your email address<br /> and we'll send you a link you can use to pick a new password.</p>
                        <ErrorList />
                        <form autoComplete="off" className="forgot__form" onSubmit={this.handleSubmit}>
                            <input className="forgot__input" onChange={this.handleChange} type="email" name="email" placeholder="email" value={this.props.store.forgotPasswordForm.email} />
                            <button className="forgot__btn" type="submit">Reset My Password</button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default ForgotPassword
