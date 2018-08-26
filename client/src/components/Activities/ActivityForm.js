import React, { Component } from 'react'
import axios from 'axios'

class ActivityForm extends Component {
    constructor() {
        super();
        this.state = {
            type: "",
            price: "",
            duration: ""
        }
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        let token = localStorage.getItem('TOKEN');
        let options = {};
        options.headers = { "Authorization": token };
        let activits = this.state;
        axios.post('/activities/addActivity', activits, options)
            .then(res => {
                debugger;
                console.log(res.data)
            })
            .catch(err => { console.log(err) })
    }

    componentDidMount() {
        let token = localStorage.getItem('TOKEN');
        let options = {};
        options.headers = { "Authorization": token };
        axios.get('/activities', options)
            .then(res => { console.log(res.data) })
            .catch(err => { console.log(err) })
    }

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    Type <input type="text" name="type" placeholder="type" onChange={this.handleChange} />
                    Price <input type="text" name="price" placeholder="price" onChange={this.handleChange} />
                    Duration <input type="text" name="duration" placeholder="duration" onChange={this.handleChange} />
                    <button type="submit">Add</button>
                </form>
            </div>
        )
    }
}

export default ActivityForm;