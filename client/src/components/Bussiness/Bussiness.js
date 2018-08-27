import React, { Component } from 'react';
import './Bussiness.scss';
import { Route } from 'react-router-dom';
import SideBar from '../SideBar/SideBar';

const Check = (props) => {
    return (
        <div>
            123
        </div>)
}

export class Bussiness extends Component {
    render() {
        return (
            <div className="bussiness">
                <SideBar />
                <div className="bussiness__main">
                    <Route exact path="/business/dashboard" component={Check} />
                    <Route exact path="/business/setting" component={Check} />
                </div>
            </div>
        )
    }
}

export default Bussiness
