

import React, { Component } from 'react';
import axios from 'axios';

//const not function
const Details = (props) => {
    let time = new Date();
    let currentTime = `${time.getDate()}/${time.getDay() + 1}/${time.getFullYear()}`;
    return (
        <div>
            <h1>Details</h1>
            {currentTime}
        </div>
    );
}

const TodayActivities = (props) => {
    return (
        <div>
            TodayActivities
            </div>
    );
}

const Statistic = (props) => {
    return (
        <div>
            Statistic
            </div>
    );

}

class Dashboard extends Component {

    user = [];
    componentDidMount = () => {
        //ajax call with axios,and TOKEN
        let token = localStorage.getItem('TOKEN');
        let dashToken = {}
        dashToken.headers = { Authorization: token }
        axios.get("/dashboard", dashToken)
            .then(res => {
                this.user = res.data.details;
                console.log(res.data.success);
            })
            .catch(err => console.error(`${err}-err mesage`));
    }

    render() {
        return (
            <div>
                <Details detailsUser={this.user} />
                <hr />
                <TodayActivities />
                <hr />
                <Statistic />

            </div>
        );
    }
}

export default Dashboard;