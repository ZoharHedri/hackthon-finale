import React, { Component } from 'react';
import './DisplayBussiness.scss';
import ClientEventForm from '../ClientEventForm/ClientEventForm';
import moment from 'moment';
import { observer, inject } from 'mobx-react';
import axios from 'axios';
import Modal from '@material-ui/core/Modal';
import Papper from '@material-ui/core/Paper';
import { Rating } from '../Ratings/Rating';
import LoadingHOC from '../LoadingHOC/LoadingHOC';

const DisplayWorkingDay = (props) => {
    let now = moment().format("DD/MM/YYYY");
    return (
        <div style={{ backgroundColor: now === props.date ? "rgba(224, 86, 253, .2)" : "#fff", borderRadius: "5px" }} className="displayBussiness__workingDays">
            <div className="displayBussiness__date">{props.date}</div>
            {props.opendEvents.map(event => <ClientEventForm getOpendEventForActivity={props.getOpendEventForActivity} key={event._id} date={props.date} event={event} bussinessId={props.bussinessId} workingDayId={props._id} />)}
        </div>
    )
};

const DisplayActivty = (props) => {
    return (
        <React.Fragment>
            <option className="option" value={props._id}>
                {props.type} - ${props.price} - {props.duration}min
            </option>
        </React.Fragment>
    )
};

@inject("store")
@observer
class DisplayBussiness extends Component {
    state = {
        workingDays: [],
        activityId: "",
        open: false,
        isHovered: false,
        message: "please select acativity to order"
    }
    handleChange = async (event) => {
        event.persist();
        // await this.setState({ activityId: event.target.value });
        this.props.store.activityId = event.target.value;
        this.props.store.setCientEventForm({ key: event.target.name, value: event.target.value })
        this.getOpendEventForActivity(event.target.value);
    }

    getOpendEventForActivity = async () => {
        let token = localStorage.getItem('TOKEN');
        let opts = {}
        opts.headers = { Authorization: token }
        let res = await axios.get(`/bussiness/${this.props.location.state._id}/activity/${this.props.store.activityId}/events`, opts)
        if (res.data.workingDays.length > 0) {
            this.setState({ workingDays: res.data.workingDays, open: true });
        } else {
            this.setState({ message: "sorry, our calander is currently full" })
        }
    }

    handleClose = () => {
        this.setState({ open: false });
    }
    handleHover = () => {
        // this.setState({ isHovered: !this.state.isHovered });
    }

    render() {
        let b = this.props.location.state;
        b.activites = typeof b.activites === 'string' ? JSON.parse(b.activites) : b.activites;
        return (
            <div className="displayBussiness">
                <div className="displayBussiness-box">
                    <div className="displayBussiness__img-box">
                        <img className="displayBussiness__img" src={`/images/${b.avatarUrl}`} alt="" />
                    </div>
                    <div className="displayBussiness-details">
                        <div className="displayBussiness__name">{b.name}</div>
                        <div className="displayBussiness__name2">{b.address}</div>
                        <div className="displayBussiness__name2">{b.phone}</div>
                        <div className="displayBussiness__name2">{b.email}</div>
                    </div>
                </div>
                <h2 className="displayBussiness__name">Services Offered</h2>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                    <select onChange={this.handleChange} name="activityId" defaultValue="">
                        <option value="" disabled="disabled" hidden="hidden">Choose activity</option>
                        {b.activites.map(item => <DisplayActivty key={item._id} {...item} />)}
                    </select>
                </div>

                {this.state.open ?
                    <LoadingHOC>
                        < Modal
                            aria-labelledby="simple-modal-title"
                            aria-describedby="simple-modal-description"
                            disableAutoFocus={true}
                            open={this.state.open}
                            onClose={this.handleClose}
                        >
                            <Papper className="papper_center">
                                <div className="displayBussiness__days-box">
                                    {/* {this.props.store.workingDays.map(item => <DisplayWorkingDay getOpendEventForActivity={this.getOpendEventForActivity} key={item._id} {...item} activites={this.props.activites} opendEvents={item.opendEvents} bussinessId={this.props._id} />)} */}
                                    {this.state.workingDays.map(item => <DisplayWorkingDay getOpendEventForActivity={this.getOpendEventForActivity} key={item._id} {...item} activites={b.activites} opendEvents={item.opendEvents} bussinessId={b._id} />)}
                                </div>
                            </Papper>
                        </Modal>
                    </LoadingHOC>
                    :
                    <span className="displayBussiness__name2">{this.state.message}</span>
                }
                <Rating bussinessId={b._id} />
            </div>
        )
    }
}

export default DisplayBussiness
