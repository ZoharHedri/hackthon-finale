import React, { Component } from 'react';
import axios from 'axios';
import './ResetPassword.scss';

export class ResetPassword extends Component {
    state = {
        password: "",
        passwordConfirm: ""
    }
    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    }
    handleSubmit = e => {
        e.preventDefault();
        axios.post('/bussiness/reset-password/' + this.props.match.params.token, { password: this.state.password }, )
            .then(res => console.log(res.data))
            .catch(err => console.log(`${err}`));
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
                            <input required className="reset__input" onChange={this.handleChange} type="password" name="password" placeholder="password" value={this.state.password} />
                            <div className="reset__valid"></div>
                        </div>
                        <div className="reset__input-group">
                            <span className="reset__label" >Confirm Password</span>
                            <input required className="reset__input" onChange={this.handleChange} type="password" name="passwordConfirm" placeholder="retype password" value={this.state.passwordConfirm} />
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
