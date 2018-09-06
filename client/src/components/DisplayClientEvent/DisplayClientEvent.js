import React, { Component } from 'react'
import { inject } from '../../../node_modules/mobx-react';
import './DisplayClientEvent.scss';
import Button from '@material-ui/core/Button';

@inject("store")
class DisplayClientEvent extends Component {
    handleClick = () => {
        this.props.store.removeEventById(this.props._id);
    }
    render() {
        return (
            <div className="card-box">
                <div className="card">
                    <div className="card__side card__side--front">
                        <div className="card__profile">
                            <span className="card__headline">New Event</span>
                            <div className="card__img-box">
                                <svg className="card__img">
                                    <use xlinkHref="/sprite.svg#icon-stopwatch" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div className="card__side card__side--back card__side--back-1">
                        <div className="event-box">
                            <div>{this.props.date}</div>
                            <div>{this.props.startingTime}</div>
                            <div>{this.props.status}</div>
                            <div>{this.props.activityId.type}</div>
                            <Button style={{ margin: "16px 0" }} color="secondary" variant="contained" onClick={this.handleClick}>{this.props.status.toUpperCase() === "FINISHED" ? "delete" : "cancel"}</Button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default DisplayClientEvent
