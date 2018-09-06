

import React, { Component } from 'react';
import axios from 'axios';
import './Dashboard.scss';
//import library of time named 'moment' =>https://momentjs.com ,https://momentjs.com/docs/#/displaying/
import moment from 'moment';


//'const' not 'function'!,
const Details = (props) => {

    //console.log(moment().format('dddd'));//day name
    // console.log(moment().format('M/D/Y'));//the day,month and year
    let currentTime = moment().format('DD/MM/YYYY');

    const detailsOfUser = props.detailsUser; //the 'detailsOfUser' is object! not array
    // debugger;
    return (
        <div className="dashboard-details">
            <p className="dashboard-date">{currentTime}</p>
            <div>
                {/* key={detailsOfUser.id} */}
                <h1 className="dashboard-name">{detailsOfUser.name}</h1>
                <h3 className="dashboard-address">{detailsOfUser.address}</h3><br />
                <p className="dashboard-category">{detailsOfUser.category}</p><br />
                <p className="dashboard-phoneANDemail">
                    {/* <span className="dashboard-phone">{detailsOfUser.phone} </span> */}
                    {detailsOfUser.phone} ● {detailsOfUser.email}
                    {/* <span className="dashboard-email"> {detailsOfUser.email}</span> */}
                </p>
            </div>
        </div>
    );
}

const TodayActivities = (props) => {
    // debugger;
    console.log(props);
    return (
        <div className="dashboard-activities">
            <span className="">
                type: <span className="dashboard-values">{props.activityId.type}</span>
            </span>
            <span className="">
                price:  <span className="dashboard-values">{props.activityId.price}$</span>
            </span>
            <span className="">
                startingTime: <span className="dashboard-values">{props.startingTime}</span>
            </span>
            <span className="">
                duration: <span className="dashboard-values">{props.activityId.duration} min</span>
            </span>
        </div>
    );
}

// const Statistic = (props) => {
//     return (
//         <div className="dashboard-statistic">
//             Statistic
//         </div>
//     );

// }

class Dashboard extends Component {

    state = { user: [], eventsDay: [] };
    componentDidMount() {
        // debugger;
        //ajax call with axios,and TOKEN
        let token = localStorage.getItem('TOKEN');
        let dashToken = {}
        dashToken.headers = { Authorization: token }
        axios.get("/dashboard", dashToken)
            .then(res => {
                // debugger;
                this.setState({ user: res.data.details, eventsDay: res.data.details.eventsDay });
                // debugger;
                // console.log(res.data.success); //good
            })
            .catch(err => console.error(`${err} - ERR mesage`));
    }

    render() {
        // debugger;
        return (
            <div className="dashboard">
                <h1 className="dashboard-header">Details Business</h1>
                <Details detailsUser={this.state.user} />
                <hr />
                {/*activites={this.state.user.activites} */}
                <h1 className="dashboard-header">TodayActivities</h1>
                {this.state.eventsDay.map(item => <TodayActivities key={item._id} {...item} />)}
                {/* <hr /> */}
                {/* <Statistic /> */}

            </div>
        );
    }
}

export default Dashboard;