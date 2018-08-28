import React, { Component } from 'react';
import './Bussiness.scss';
import { Route } from 'react-router-dom';
import SideBar from '../SideBar/SideBar';
import Dashboard from '../Dashboard/Dashboard';
import Setting from '../Setting/Setting';
import { inject, observer } from '../../../node_modules/mobx-react';
import BussinessClients from '../BusinessClients/BussinessClients';
import Redirect from 'react-router-dom/Redirect';

@inject("store")
@observer
export class Bussiness extends Component {
    componentDidMount() {
        this.props.store.getSettingApi();
    }
    handleClick = () => {
        localStorage.removeItem("TOKEN");
        this.props.store.logout();
    }
    render() {
        return (
            <div className="bussiness">
                <SideBar pathname={this.props.location.pathname} />
                <div className="bussiness__main">
                    <header className="bussiness__header">
                        <div className="bussiness__name">@{this.props.store.getSetting.name}</div>
                        <button onClick={this.handleClick} className="bussiness__btn">Sign Out</button>
                    </header>
                    <Route exact path="/business/dashboard" component={Dashboard} />
                    <Route exact path="/business/setting" component={Setting} />
                    <Route excat path="/business/clients" component={BussinessClients} />
                </div>
                {!this.props.store.userStatus.loggedIn && <Redirect to={this.props.store.userStatus.userModel} />}
            </div>
        )
    }
}

export default Bussiness
