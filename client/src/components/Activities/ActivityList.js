import React, { Component } from 'react'
import { observer, inject } from 'mobx-react';
import Activity from './Activity'

@inject("store")
@observer
export default class ActivityList extends Component {


    render() {
        return (
            <div>
                {this.props.store.activities.map((item, index) => <Activity {...item} key={index} />)}
            </div>
        )
    }
}
