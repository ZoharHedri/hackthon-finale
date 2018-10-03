import React, { Component } from 'react'
import { inject } from '../../../node_modules/mobx-react';
import './DisplayClientEvent.scss';
import Button from '@material-ui/core/Button';
import TableCell from '@material-ui/core/TableCell';
// import moment from 'moment';
// const now = moment().format("DD/MM/YYYY");

const style = {
    wordBreak: 'break-word',
    fontSize: '1.2rem',
    fontWeight: 300
}

@inject("store")
class DisplayClientEvent extends Component {
    handleClick = () => {
        this.props.store.removeEventById(this.props._id);
    }
    render() {
        return (
            // <div className="card-box">
            //     <div className="card">
            //         <div className={now === this.props.date ? "card__side card__side--front card__side--front-today" : "card__side card__side--front"}>
            //             <div className="card__profile">
            //                 <span className="card__headline">New Event</span>
            //                 <div className="card__img-box">
            //                     <svg className="card__img">
            //                         <use xlinkHref="/sprite.svg#icon-stopwatch" />
            //                     </svg>
            //                 </div>
            //             </div>
            //         </div>
            //         <div className="card__side card__side--back card__side--back-1">
            //             <div className="event-box">
            //                 <div>{this.props.date}</div>
            //                 <div>{this.props.startingTime}</div>
            //                 <div>{this.props.status}</div>
            //                 <div>{this.props.activityId.type}</div>
            // <Button style={{ margin: "16px 0" }} color="secondary" variant="contained" onClick={this.handleClick}>{this.props.status.toUpperCase() === "FINISHED" ? "delete" : "cancel"}</Button>
            //             </div>
            //         </div>
            //     </div>
            // </div>
            <React.Fragment>
                <TableCell style={style}>{this.props.date}</TableCell>
                <TableCell style={style}>{this.props.startingTime}</TableCell>
                <TableCell style={style}>{this.props.status}</TableCell>
                <TableCell style={style}>{this.props.activityId.type}</TableCell>
                <TableCell style={style}>{this.props.name}</TableCell>
                <TableCell style={style}>{this.props.address}</TableCell>
                <TableCell style={style}>{this.props.email}</TableCell>
                <TableCell style={style}>{this.props.phone}</TableCell>
                <TableCell style={style}>
                    <Button style={{ margin: "16px 0" }} color="secondary" variant="contained" onClick={this.handleClick}>{this.props.status.toUpperCase() === "FINISHED" ? "delete" : "cancel"}</Button>
                </TableCell>
            </React.Fragment>
        )
    }
}

export default DisplayClientEvent
