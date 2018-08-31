import React, { Component } from 'react'
import moment from 'moment';
import { inject } from '../../../node_modules/mobx-react';

@inject("store")
class DisplayClientEvent extends Component {
    handleClick = () => {
        this.props.store.removeEventById(this.props._id);
    }
    render() {
        return (
            <div>
                <div>{moment(this.props.date).format("DD/MM/YYYY")}</div>
                <div>{this.props.startingTime}</div>
                <div>{this.props.status}</div>
                <div>{this.props.activityId.type}</div>
                <button onClick={this.handleClick}>{this.props.status.toUpperCase() === "FINISHED" ? "delete" : "cancel"}</button>
            </div>
        )
    }
}

export default DisplayClientEvent
