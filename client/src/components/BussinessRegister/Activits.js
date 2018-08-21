import React, { Component } from 'react'
import axios from 'axios'

class Activits extends Component {
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
        let options = {}
        options.headers = { Authorization: JSON.parse(localStorage.getItem('TOKEN')) }
        options.activits = this.state;
        axios.post('/activities/addActivity', options)
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

export default Activits;