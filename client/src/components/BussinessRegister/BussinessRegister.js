import React, { Component } from 'react';
import axios from 'axios';
import { inject, observer } from '../../../node_modules/mobx-react';
import './BussinessRegister.scss';

@inject('store')
@observer
class BussinessRegister extends Component {

    handleChange = event => {
        debugger;
        this.props.store.setRegister({ key: event.target.name, value: event.target.value })
    }

    handleSubmit = event => {
        event.preventDefault();
        axios.post('/bussiness/register', this.props.store.register)
            .then(res => console.log(res.data))
            .catch(err => console.log(err.msg));
    }
    render() {
        return (
            <div className="register">
                <div className="register__hero">
                    <img className="register__img" src="/images/bg-01.jpg" alt="" />
                </div>
                <div className="register__main">
                    <h1 className="register__header">Sign Up</h1>
                    <form autoComplete="off" className="register__form" onSubmit={this.handleSubmit}>
                        <div className="register__input-group">
                            <span className="register__label" >Full Name</span>
                            <input required className="register__input" onChange={this.handleChange} name="name" type="text" placeholder="name" value={this.props.store.register.name} />
                            <div className="register__valid"></div>
                        </div>
                        <div className="register__input-group">
                            <span className="register__label" >Phone</span>
                            <input required className="register__input" onChange={this.handleChange} name="phone" type="text" placeholder="phone" value={this.props.store.register.phone} />
                            <div className="register__valid"></div>
                        </div>
                        <div className="register__input-group">
                            <span className="register__label" >Email</span>
                            <input required className="register__input" onChange={this.handleChange} name="email" type="email" placeholder="email" value={this.props.store.register.email} />
                            <div className="register__valid"></div>
                        </div>
                        <div className="register__input-group">
                            <span className="register__label" >Password</span>
                            <input required className="register__input" onChange={this.handleChange} name="password" type="password" placeholder="password" value={this.props.store.register.password} />
                            <div className="register__valid"></div>
                        </div>
                        <div className="register__input-group">
                            <span className="register__label" >Address</span>
                            <input required className="register__input" onChange={this.handleChange} name="address" type="text" placeholder="address" value={this.props.store.register.address} />
                            <div className="register__valid"></div>
                        </div>
                        <div className="register__input-group">
                            <span className="register__label" >Category</span>
                            <select className="register__select" onChange={this.handleChange} name="category">
                                <option value="Arts, crafts, and collectibles">Arts, crafts, and collectibles</option>
                                <option value="Baby">Baby</option>
                                <option value="Beauty and fragrances">Beauty and fragrances</option>
                                <option value="Books and magazines">Books and magazines</option>
                                <option value="Clothing, accessories, and shoes">Clothing, accessories, and shoes</option>
                                <option value="Computers, accessories, and services">Computers, accessories, and services</option>
                                <option value="Education">Education</option>
                                <option value="Electronics and telecom">Electronics and telecom</option>
                                <option value="Entertainment and media">Entertainment and media</option>
                                <option value="Financial services and products">Financial services and products</option>
                                <option value="Food retail and service">Food retail and service</option>
                                <option value="Gifts and flowers">Gifts and flowers</option>
                                <option value="Government">Government</option>
                                <option value="Gifts and flowers">Gifts and flowers</option>
                                <option value="Health and personal care">Health and personal care</option>
                                <option value="Home and garden">Home and garden</option>
                                <option value="Nonprofit">Nonprofit</option>
                                <option value="Pets and animals">Pets and animals</option>
                                <option value="Religion and spirituality">Religion and spirituality</option>
                                <option value="Sports and outdoors">Sports and outdoors</option>
                                <option value="Toys and hobbies">Toys and hobbies</option>
                                <option value="Travel">Travel</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <button className="register__btn" type="submit">Sign up</button>
                    </form>
                </div>

            </div >
        )
    }
}

export default BussinessRegister;