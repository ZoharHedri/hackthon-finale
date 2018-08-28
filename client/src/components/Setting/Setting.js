import React, { Component } from 'react';
import { inject, observer } from '../../../node_modules/mobx-react';
import './Setting.scss';
import axios from '../../../node_modules/axios';
import ErrorList from '../ErrorList/ErrorList';

@inject("store")
@observer
class Setting extends Component {

    handleChange = event => {
        this.props.store.setRegisterBussinessForm({ key: event.target.name, value: event.target.value })
    }
    componentWillUnmount() {
        this.props.store.getSettingApi();
        this.props.store._clearErrors();
    }
    handleSubmit = event => {
        event.preventDefault();
        let token = localStorage.getItem("TOKEN");
        let opts = {};
        opts.headers = { Authorization: token };
        let current = this;
        axios.post('/bussiness/update', this.props.store.getSetting, opts)
            .then(res => {
                if (res.data.success) {
                    console.log(res.data)
                } else {
                    current.props.store._setErrors(res.data.errors);
                }
            })
            .catch(err => console.log(err));
    }
    handleClick = () => {
        let token = localStorage.getItem("TOKEN");
        let opts = {};
        opts.headers = { Authorization: token };
        let current = this;
        axios.post('/bussiness/updatePassword', this.props.store.getSetting, opts)
            .then(res => {
                if (res.data.success) {
                    console.log(res.data)
                } else {
                    current.props.store._setErrors(res.data.errors);
                }
            })
            .catch(err => console.log(err));
    }
    render() {
        return (
            <div className="setting">
                <ErrorList />
                <form autoComplete="off" className="setting__form" onSubmit={this.handleSubmit}>
                    <div className="setting__header">
                        <h1 className="setting__heading">Account Settings</h1>
                        <button className="setting__btn" type="submit">Save</button>
                    </div>
                    <div className="setting__divider" ></div>
                    <div className="setting__main">
                        <div className="setting__group">
                            <div className="setting__item">
                                <span className="setting__title">Full Name</span>
                                <input className="setting__input" onChange={this.handleChange} name="name" type="text" value={this.props.store.getSetting.name} />
                            </div>
                            <div className="setting__item">
                                <span className="setting__title">phone</span>
                                <input className="setting__input" onChange={this.handleChange} name="phone" type="text" value={this.props.store.getSetting.phone} />
                            </div>
                            <div className="setting__item">
                                <span className="setting__title">email</span>
                                <input className="setting__input" onChange={this.handleChange} name="email" type="text" value={this.props.store.getSetting.email} />
                            </div>
                            <div className="setting__item">
                                <span className="setting__title">address</span>
                                <input className="setting__input" onChange={this.handleChange} name="address" type="text" value={this.props.store.getSetting.address} />
                            </div>
                            <div className="setting__item">
                                <span className="setting__title">category</span>
                                <input disabled="disabled" className="setting__input" onChange={this.handleChange} name="category" type="select" value={this.props.store.getSetting.category} />
                            </div>
                            {/* <input onChange={this.handleChange} name="oldPassword" type="password" value={this.props.store.getSetting.oldPassword} />
                    <input onChange={this.handleChange} name="password" type="password" value={this.props.store.getSetting.password} />
                    <input onChange={this.handleChange} name="confirmPassword" type="password" value={this.props.store.getSetting.confirmPassword} /> */}
                        </div>
                        <div className="setting__divider" ></div>
                        <div className="setting__header">
                            <h1 className="setting__heading setting__heading--none">Change Password</h1>
                        </div>
                        <div className="setting__group">
                            <div className="setting__item">
                                <span className="setting__title">Old Password</span>
                                <input className="setting__input" onChange={this.handleChange} name="oldPassword" type="password" value={this.props.store.getSetting.oldPassword} />
                            </div>
                            <div className="setting__item">
                                <span className="setting__title">New Password</span>
                                <input className="setting__input" onChange={this.handleChange} name="password" type="password" value={this.props.store.getSetting.password} />
                            </div>
                            <div className="setting__item">
                                <span className="setting__title">Confirm Password</span>
                                <input className="setting__input" onChange={this.handleChange} name="confirmPassword" type="password" value={this.props.store.getSetting.confirmPassword} />
                            </div>
                            <button onClick={this.handleClick} type="button" className="setting__btn" style={{ marginLeft: "16px", background: "linear-gradient(to bottom, #06C5EE, #0067D3)" }}>Change</button>
                        </div>
                        <div className="setting__divider"></div>
                        <div className="setting__header">
                            <h1 className="setting__heading setting__heading--none">Notifications</h1>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}

export default Setting;
