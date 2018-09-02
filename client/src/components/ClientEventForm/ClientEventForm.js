import React, { Component } from 'react'
import { inject, observer } from '../../../node_modules/mobx-react';

@inject("store")
@observer
class ClientEventForm extends Component {
    handleClick = () => {
        this.props.store.setCientEventForm({ date: this.props.date, startingTime: this.props.time });
        // ajax call to server to save event
        this.props.store.saveEventForClient(this.props.bussinessId, this.props.workingDayId);
    }
    render() {
        return (
            <div>
                <span>{this.props.time}</span>
                <button onClick={this.handleClick}>Order</button>
            </div>
        )
    }
}

export default ClientEventForm
