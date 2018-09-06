import React, { Component } from 'react';
import './Bussiness.scss';
import { Route } from 'react-router-dom';
import SideBar from '../SideBar/SideBar';
import Dashboard from '../Dashboard/Dashboard';
import Setting from '../Setting/Setting';
import { inject, observer } from '../../../node_modules/mobx-react';
import BussinessClients from '../BusinessClients/BussinessClients';
import Redirect from 'react-router-dom/Redirect';
import ActivityForm from '../Activities/ActivityForm';
import BussinessCalendar from '../BussinessCalendar/BussinessCalendar';
import Button from '@material-ui/core/Button'

@inject("store")
@observer
export class Bussiness extends Component {
    componentDidMount() {
        this.props.store.getSettingApi();
    }
    handleClick = () => {
        this.props.store.logout();
    }
    render() {
        return (
            <div className="bussiness">
                <SideBar pathname={this.props.location.pathname} />
                <div className="bussiness__main">
                    <header className="bussiness__header">
                        {/* className="bussiness__btn" */}
                        <Button style={{ marginLeft: "auto", marginRight: "16px" }} variant="extendedFab" color="primary" onClick={this.handleClick} >logOut</Button>
                    </header>
                    <Route exact path="/business/dashboard" component={Dashboard} />
                    <Route exact path="/business/setting" component={Setting} />
                    <Route excat path="/business/activites" component={ActivityForm} />
                    <Route excat path="/business/clients" component={BussinessClients} />
                    <Route excat path="/business/calendar" component={BussinessCalendar} />
                </div>
                {!this.props.store.userStatus.loggedIn && <Redirect to={this.props.store.userStatus.userModel} />}
            </div>
        )
    }
}

export default Bussiness
