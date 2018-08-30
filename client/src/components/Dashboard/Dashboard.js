

import React, { Component } from 'react';
import axios from 'axios';
//import library of time named 'moment' =>https://momentjs.com ,https://momentjs.com/docs/#/displaying/
import moment from 'moment';


//'const' not 'function'!,
const Details = (props) => {
    
    //console.log(moment().format('dddd'));//day name
    // console.log(moment().format('M/D/Y'));//the day,month and year
    let currentTime = moment().format('M/D/Y');

    const detailsOfUser = props.detailsUser; //the 'detailsOfUser' is object! not array
    // debugger;
    return (
        <div className="business-details">
            <h1 className="business-h">Details Bussiness</h1>
            <p className="business-time">{currentTime}</p>
            <div> 
                {/* key={detailsOfUser.id} */}
                <h1 className="business-name">{detailsOfUser.name}</h1>
                <h3 className="business-address">{detailsOfUser.address}</h3><br/>
                <p className="business-category">{detailsOfUser.category}</p><br/>
                <p className="business-phoneAanEmail">{detailsOfUser.phone} {detailsOfUser.email}</p>
            </div>
        </div>
    );
}

const TodayActivities = (props) => {
    
    debugger;
    const actDetails  = props; //actDetails = object (with '.__proto__' func) 
    console.log(actDetails); 
    // console.log(Object.keys(actDetails)); 
    return (
        <div className="today-activities">
            <h1 className="today-h">TodayActivities</h1>
            {actDetails.date}
            {/* {actDetails.map((item) => 
            <div key={item.id}>{item.date} </div> 
             )}  */}
        </div>
    );
}

const Statistic = (props) => {
    return (
        <div className="business-statistic">
            Statistic
        </div>
    );

}

class Dashboard extends Component {

    state = {user : [] };
    componentDidMount = () => {
        //ajax call with axios,and TOKEN
        let token = localStorage.getItem('TOKEN');
        let dashToken = {}
        dashToken.headers = { Authorization: token }
        axios.get("/dashboard", dashToken)
            .then(res => {
                this.setState({user: res.data.details}); 
                // debugger;
                console.log(res.data.success); //good
            })
            .catch(err => console.error(`${err} - ERR mesage`));
    }

    render() {
        return (
            <div className="business-dashboard">
                <Details detailsUser={this.state.user} />
                <hr />
                {/*activites={this.state.user.activites} */}
                 <TodayActivities workingDays={this.state.user.workingDays}/>
                <hr />
                <Statistic />

            </div>
        );
    }
}

export default Dashboard;