import React, { Component } from 'react';
import axios from 'axios';
import { inject, observer } from '../../../node_modules/mobx-react';

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
            <div>
                <form onSubmit={this.handleSubmit}>
                    <input onChange={this.handleChange} name="name" type="text" placeholder="name" value={this.props.store.register.name} />
                    <select onChange={this.handleChange} name="category">
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
                    <input onChange={this.handleChange} name="phone" type="text" placeholder="phone" value={this.props.store.register.phone} />
                    <input onChange={this.handleChange} name="email" type="email" placeholder="email" value={this.props.store.register.email} />
                    <input onChange={this.handleChange} name="password" type="password" placeholder="password" value={this.props.store.register.password} />
                    <input onChange={this.handleChange} name="address" type="text" placeholder="address" value={this.props.store.register.address} />
                    <button type="submit">Register</button>
                </form>
            </div >
        )
    }
}

export default BussinessRegister;