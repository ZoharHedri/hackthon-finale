import React, { Component } from 'react';
//import axios from 'axios';
import './ResetPassword.scss';
import { observer, inject } from 'mobx-react';

@inject("store")
@observer
export class ResetPassword extends Component {
    state = {
        password: "",
        passwordConfirm: ""
    }
    handleChange = e => {
        this.props.store.setResetPasswordForm({ key: e.target.name, value: e.target.value })
    }
    handleSubmit = e => {
        e.preventDefault();
        this.props.store.resetPassword(this.props.match.params.token);
    }
    render() {
        return (
            <div className="reset">
                <div className="reset__hero">
                    <div className="reset__img-warp">
                        <img className="reset__img" src="/locked-padlock.svg" alt="" />
                    </div>
                </div>
                <div className="reset__main">
                    <h1 className="reset__header">Reset your Password</h1>
                    <form noValidate className="reset__form" onSubmit={this.handleSubmit}>
                        <div className="reset__input-group">
                            <span className="reset__label" >Password</span>
                            <input required className="reset__input" onChange={this.handleChange} type="password" name="password" placeholder="password" value={this.props.store.resetPasswordForm.password} />
                            <div className="reset__valid"></div>
                        </div>
                        <div className="reset__input-group">
                            <span className="reset__label" >Confirm Password</span>
                            <input required className="reset__input" onChange={this.handleChange} type="password" name="passwordConfirm" placeholder="retype password" value={this.props.store.resetPasswordForm.passwordConfirm} />
                            <div className="reset__valid"></div>
                        </div>
                        <button className="reset__btn" type="submit">Reset My Password</button>
                    </form>
                </div>
            </div>
        )
    }
}

export default ResetPassword
