import React, { Component } from 'react'
// import EditableLabel from 'react-inline-editing';
import { observer, inject } from 'mobx-react';
import './Activity.scss';

@inject("store")
@observer
export default class Activity extends Component {
    constructor(props) {
        super(props);

        this._handleFocus = this._handleFocus.bind(this);
        this._handleFocusOut = this._handleFocusOut.bind(this);
    }

    _handleFocus(text) {
        console.log('Focused with text: ' + text);
    }

    _handleFocusOut(text) {
        if (text === "") text = this.props.type
        console.log('Left editor with text: ' + text);
    }

    onClick = () => {
        this.props.store.removeActivity(this.props._id);
    }

    // onChange = (data) => {
    //     console.log(data);
    // }

    render() {
        return (
            <div className="activity-box">
                <div className="activity">
                    <div className="activity__label-box">
                        <span className="activity__sign">$</span>
                        <span className="activity__label">{this.props.price}</span>
                    </div>
                    <div className="activity__type" >{this.props.type}</div>
                    <div className="activity__duration" >{this.props.duration} minute's</div>
                    <button className="activity__btn" onClick={this.onClick}>Remove</button>
                </div>
            </div>
        )
    }
}
