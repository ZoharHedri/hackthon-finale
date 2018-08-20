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

    handleSubmit = (e) =>{
        let options = {}
        options.headers = {Authorization : JSON.parse(localStorage.getItem('TOKEN'))}
        options.activits = this.state;
        axios.post('',options)
    }

    render() {
        return (
            <div>
                <form action="">
                    Type <input type="text" name="type" placeholder="type" onChange={this.handleChange} />
                    Price <input type="text" name="price" placeholder="price" onChange={this.handleChange} />
                    Duration <input type="text" name="duration" placeholder="duration" onChange={this.handleChange} />
                    <button onClick={this.handleSubmit}>Add</button>
                </form>
            </div>
        )
    }
}

export default Activits;