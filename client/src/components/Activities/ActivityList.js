import React, { Component } from 'react'
import { observer, inject } from 'mobx-react';
import Activity from './Activity';
import './ActivityList.scss';

@inject("store")
@observer
export default class ActivityList extends Component {


    render() {
        return (
            <div className="activities">
                {this.props.store.activities.map((item, index) => <Activity {...item} key={item._id} />)}
            </div>
        )
    }
}
