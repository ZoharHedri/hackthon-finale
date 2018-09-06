import React, { Component } from 'react'
import { inject, observer } from '../../../node_modules/mobx-react';
import './ClientEventForm.scss'

@inject("store")
@observer
class ClientEventForm extends Component {
    handleClick = () => {
        this.props.store.setCientEventForm({ date: this.props.date, startingTime: this.props.event.timeStart });
        // ajax call to server to save event
        this.props.store.saveEventForClient(this.props.bussinessId, this.props.workingDayId);
    }
    render() {
        return (
            <div className="event">
                <span className="event__time">{this.props.event.timeStart}</span>
                <span className="event__time">{this.props.event.timeEnd}</span>
                <button className="event__btn" onClick={this.handleClick}>Order</button>
            </div>
        )
    }
}

export default ClientEventForm
