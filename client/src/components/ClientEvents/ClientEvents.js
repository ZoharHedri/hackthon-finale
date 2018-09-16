import React, { Component } from 'react'
import { observer, inject } from '../../../node_modules/mobx-react';
import DisplayClientEvent from '../DisplayClientEvent/DisplayClientEvent'
import LoadingHOC from '../LoadingHOC/LoadingHOC';

@inject("store")
@observer
class ClientEvents extends Component {
    render() {
        return (
            <LoadingHOC>
                <div style={{ display: "flex", flexWrap: "wrap", width: "100%" }}>
                    {this.props.store.clientEvents.map(item =>
                        <DisplayClientEvent key={item._id} {...item} />
                    )}
                </div>
            </LoadingHOC>
        )
    }
}

export default ClientEvents
