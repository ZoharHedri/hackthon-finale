import React, { Component } from 'react'
import './Client.scss';
import SideBarClient from '../SideBarClient/SideBatClient';
import { inject, observer } from '../../../node_modules/mobx-react';
import { Route, Redirect } from 'react-router-dom';
import SearchBar from '../Search/SearchBar';
import ClientEvents from '../ClientEvents/ClientEvents';
import BusinessList from '../Search/BusinessList';

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
                        <div className="myclient__name">Test Test</div>
                        <button onClick={this.handleClick} className="myclient__btn">Sign Out</button>
                    </header>
                    <Route exact path="/client/search" component={SearchBar} />
                    <Route exact path="/client/search" component={BusinessList} />
                    <Route exact path="/client/appointments" component={ClientEvents} />
                </div>
                {!this.props.store.userStatus.loggedIn && <Redirect to={this.props.store.userStatus.userModel} />}
            </div>
        )
    }
}

export default Client
