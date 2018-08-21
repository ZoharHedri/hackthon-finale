import React, { Component } from 'react';
import axios from 'axios';
import { inject, observer } from '../../../node_modules/mobx-react';

@inject('store')
@observer
class BussinessRegister extends Component {

    handleChange = event => {
        // this.setState({ [event.target.name]: event.target.value });
        this.props.store.setRegister({ key: event.target.name, value: event.target.value })
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
                    <input onChange={this.handleChange} name="name" type="text" placeholder="name" />
                    <input onChange={this.handleChange} name="category" type="text" placeholder="category" value={this.props.store.register.category} />
                    <input onChange={this.handleChange} name="phone" type="text" placeholder="phone" />
                    <input onChange={this.handleChange} name="email" type="email" placeholder="email" />
                    <input onChange={this.handleChange} name="password" type="password" placeholder="password" />
                    <input onChange={this.handleChange} name="address" type="text" placeholder="address" />
                    <button type="submit">Register</button>
                </form>
            </div >
        )
    }
}

export default BussinessRegister;