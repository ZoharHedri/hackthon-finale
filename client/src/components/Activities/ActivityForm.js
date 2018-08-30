import React, { Component } from 'react'
import axios from 'axios'
import { observer, inject } from 'mobx-react';
import ActivityList from './ActivityList';

@inject("store")
@observer
class ActivityForm extends Component {
    constructor() {
        super();
    }

    handleChange = (e) => {
        this.props.store.setActivityForm({ key: e.target.name, value: e.target.value })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.store.addActivity();
    }

    componentDidMount() {
        this.props.store.getActivities();
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
                <div>
                    <ActivityList/>
                </div>
            </div>
        )
    }
}

export default ActivityForm;