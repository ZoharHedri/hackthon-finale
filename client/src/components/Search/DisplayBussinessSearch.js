import React, { Component } from 'react'
import moment from 'moment';
import ClientEventForm from '../ClientEventForm/ClientEventForm';
import { observer, inject } from '../../../node_modules/mobx-react';
import './DisplayBussinessSearch.scss';
import axios from 'axios';
import Modal from '@material-ui/core/Modal';
import Papper from '@material-ui/core/Paper';

const DisplayWorkingDay = (props) => {
    let now = moment().format("DD/MM/YYYY");
    return (
        <div style={{ backgroundColor: now === props.date ? "rgba(224, 86, 253, .2)" : "#fff", borderRadius: "5px" }} className="bussinessSearch__workingDays">
            <div className="bussinessSearch__date">{props.date}</div>
            {props.opendEvents.map(event => <ClientEventForm getOpendEventForActivity={props.getOpendEventForActivity} key={event._id} date={props.date} event={event} bussinessId={props.bussinessId} workingDayId={props._id} />)}
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
    state = {
        // workingDays: [],
        activityId: "",
        open: false
    }
    handleChange = async (event) => {
        event.persist();
        // await this.setState({ activityId: event.target.value });
        this.props.store.activityId = event.target.value;
        this.props.store.setCientEventForm({ key: event.target.name, value: event.target.value })
        this.getOpendEventForActivity(event.target.value);
    }

    getOpendEventForActivity = (/*activityId*/) => {
        let token = localStorage.getItem('TOKEN');
        let opts = {}
        opts.headers = { Authorization: token }
        axios.get(`/bussiness/${this.props._id}/activity/${this.props.store.activityId}/events`, opts)
            // .then(res => this.setState({ workingDays: res.data.workingDays, open: true }));
            .then(res => this.setState({ open: true }));
    }

    handleClose = () => {
        this.setState({ open: false });
    }
    render() {
        return (
            <div className="bussinessSearch">
                <div className="bussinessSearch__item">
                    <div className="bussinessSearch__item-name">{this.props.name}</div>
                    <select onChange={this.handleChange} name="activityId" defaultValue="">
                        <option value="" disabled="disabled" hidden="hidden">Choose a activity</option>
                        {this.props.activites.map(item => <DisplayActivty key={item._id} {...item} />)}
                    </select>
                </div>
                <Modal
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                    disableAutoFocus={true}
                    open={this.state.open}
                    onClose={this.handleClose}
                >
                    <Papper className="papper_center">
                        <div className="bussinessSearch__days-box">
                            {this.props.store.workingDays.map(item => <DisplayWorkingDay getOpendEventForActivity={this.getOpendEventForActivity} key={item._id} {...item} activites={this.props.activites} opendEvents={item.opendEvents} bussinessId={this.props._id} />)}
                        </div>
                    </Papper>
                </Modal>
            </div>
        )
    }
}

export default DisplayBussinessSearch
