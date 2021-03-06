import React, { Component } from 'react'
import './Client.scss';
import SideBarClient from '../SideBarClient/SideBatClient';
import { inject, observer } from '../../../node_modules/mobx-react';
import { Route, Redirect } from 'react-router-dom';
import SearchBar from '../Search/SearchBar';
import ClientEvents from '../ClientEvents/ClientEvents';
import BusinessList from '../Search/BusinessList';
import Button from '@material-ui/core/Button';
import DisplayBussiness from '../Search/DisplayBussiness';

@inject("store")
@observer
class Client extends Component {
    handleClick = () => {
        this.props.store.logout();
    }
    componentDidMount() {
        this.props.store.getClientEvents();
    }
    render() {
        return (
            <div className="myclient">
                <SideBarClient pathname={this.props.location.pathname} />
                <div className="myclient__main">
                    <header className="myclient__header">
                        <div className="myclient__img-box">
                            {this.props.store.client.avatarUrl && <img className="myclient__img" src={`/images/${this.props.store.client.avatarUrl}`} alt="user" />}
                        </div>
                        <div className="myclient__name">{this.props.store.client.name}</div>
                        <Button style={{ marginLeft: "auto", marginRight: "16px" }} variant="outlined" color="primary" onClick={this.handleClick} >Sign Out</Button>
                    </header>
                    <Route exact path="/client/search" component={SearchBar} />
                    <Route exact path="/client/search" component={BusinessList} />
                    <Route exact path="/client/appointments" component={ClientEvents} />
                    <Route exact path="/client/:bussinessName/info" component={DisplayBussiness} />
                </div>
                {!this.props.store.userStatus.loggedIn && <Redirect to={this.props.store.userStatus.userModel} />}
            </div>
        )
    }
}

export default Client
