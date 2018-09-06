import React, { Component } from 'react'
import { observer, inject } from '../../../node_modules/mobx-react';
import DisplayClientEvent from '../DisplayClientEvent/DisplayClientEvent'

@inject("store")
@observer
class ClientEvents extends Component {
    render() {
        return (
            <div style={{ display: "flex", flexWrap: "wrap" }}>
                {this.props.store.clientEvents.map(item =>
                    <DisplayClientEvent key={item._id} {...item} />
                )}
            </div>
        )
    }
}

export default ClientEvents
