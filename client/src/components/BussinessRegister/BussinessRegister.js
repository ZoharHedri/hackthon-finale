import React, { Component } from 'react';
import axios from 'axios';

class BussinessRegister extends Component {
    constructor() {
        super();
        this.state = {
            name: "",
            phone: "",
            category: "",
            email: "",
            password: "",
            address: ""
        }
    }
    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    }
    handleSubmit = event => {
        event.preventDefault();
        // axios call
        axios.post('/bussiness/register', this.state)
            .then(res => console.log(res.data))
            .catch(err => console.log(err.msg));
    }
    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <input onChange={this.handleChange} name="name" type="text" placeholder="name" value={this.state.name} />
                    <input onChange={this.handleChange} name="category" type="text" placeholder="category" value={this.state.category} />
                    <input onChange={this.handleChange} name="phone" type="text" placeholder="phone" value={this.state.phone} />
                    <input onChange={this.handleChange} name="email" type="email" placeholder="email" value={this.state.email} />
                    <input onChange={this.handleChange} name="password" type="password" placeholder="password" value={this.state.password} />
                    <input onChange={this.handleChange} name="address" type="text" placeholder="address" value={this.state.address} />
                    <button type="submit">Register</button>
                </form>
            </div >
        )
    }
}

export default BussinessRegister;