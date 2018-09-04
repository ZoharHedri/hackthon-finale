import React, { Component } from 'react'
import moment from 'moment';
import ClientEventForm from '../ClientEventForm/ClientEventForm';
import { observer, inject } from '../../../node_modules/mobx-react';
import './DisplayBussinessSearch.scss';

const DisplayWorkingDay = (props) => {
    return (
        <div className="bussinessSearch__workingDays">
            <div>{moment(props.date).format("DD/MM/YYYY")}</div>
            {props.opendEvents.map((event, index) => <ClientEventForm key={index} date={props.date} time={event} bussinessId={props.bussinessId} workingDayId={props._id} />)}
        </div>
    )
};

const DisplayActivty = (props) => {
    return (
        <React.Fragment>
            <option value={props._id}>Type:{props.type} / Price:{props.price} / Duration:{props.duration}</option>
        </React.Fragment>
    )
};

@inject("store")
@observer
class DisplayBussinessSearch extends Component {

    handleChange = event => {
        this.props.store.setCientEventForm({ key: event.target.name, value: event.target.value })
    }
    render() {
        return (
            <div className="bussinessSearch">
                <div>{this.props.name}</div>
                <select onChange={this.handleChange} name="activityId" defaultValue="">
                    <option value="" disabled="disabled" hidden="hidden">Choose a activity</option>
                    {this.props.activites.map(item => <DisplayActivty key={item._id} {...item} />)}
                </select>
                <div className="bussinessSearch__days-box">
                    {this.props.workingDays.map(item => <DisplayWorkingDay key={item._id} {...item} activites={this.props.activites} opendEvents={item.opendEvents} bussinessId={this.props._id} />)}
                </div>
            </div>
        )
    }
}

export default DisplayBussinessSearch
