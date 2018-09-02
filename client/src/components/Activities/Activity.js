import React, { Component } from 'react'
import EditableLabel from 'react-inline-editing';
import { observer, inject } from 'mobx-react';

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

    onClick = ()=>{
        this.props.store.removeActivity(this.props._id);
    }

    // onChange = (data) => {
    //     console.log(data);
    // }

    render() {
        return (
            <div>
                <EditableLabel text={this.props.type} onFocus={this._handleFocus}
                    onFocusOut={this._handleFocusOut} />
                <EditableLabel text={this.props.price} onFocus={this._handleFocus}
                    onFocusOut={this._handleFocusOut} />
                <EditableLabel text={this.props.duration} onFocus={this._handleFocus}
                    onFocusOut={this._handleFocusOut} />
                    <button onClick={this.onClick}>Remove</button>
            </div>
        )
    }
}
