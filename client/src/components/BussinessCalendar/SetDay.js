import React, { Component } from 'react'
import './SetDay.scss';
import { observer, inject } from 'mobx-react';
import axios from 'axios';
import LoadingHOC from '../LoadingHOC/LoadingHOC';

@inject("store")
@observer
class SetDay extends Component {
    state = {
        timeStart: "",
        timeEnd: ""
    }
    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }
    handleSubmit = async (e) => {
        e.preventDefault();
        let obj = {};
        obj.date = this.props.store.date;
        obj.timeDuration = {
            timeStart: this.state.timeStart,
            timeEnd: this.state.timeEnd
        }
        let token = localStorage.getItem('TOKEN');
        let opts = {};
        opts.headers = { Authorization: token };
        this.props.store.isLoading = true;
        let res = await axios.post('/bussiness/setDay', obj, opts);
        this.props.store.isLoading = false;
        if (res.data.success) {
            this.props.store._getBussinessMonthDays();
        }
    }
    render() {
        return (
            <LoadingHOC>
                <div className="setDay">
                    <h1>set time for {this.props.store.date}</h1>
                    <form onSubmit={this.handleSubmit}>
                        <label>work from </label>
                        <input name="timeStart" onChange={this.handleChange} className="setDay__input" type="text" pattern="^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$" placeholder="start time" />
                        <label>to</label>
                        <input name="timeEnd" onChange={this.handleChange} className="setDay__input" type="text" pattern="^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$" placeholder="end time" />
                        <button type="submit">save</button>
                    </form>
                </div>
            </LoadingHOC>
        )
    }
}

export default SetDay;
