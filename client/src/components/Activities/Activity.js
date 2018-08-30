import React, { Component } from 'react'
import EditableLabel from 'react-inline-editing';

export default class Activity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: props.type,
            price: props.price,
            duration: props.duration
        }
        this._handleFocus = this._handleFocus.bind(this);
        this._handleFocusOut = this._handleFocusOut.bind(this);
    }

    _handleFocus(text) {
        console.log('Focused with text: ' + text);
    }

    _handleFocusOut(text) {
        
        console.log('Left editor with text: ' + text);
    }

    // onChange = (data) => {
    //     console.log(data);
    // }

    render() {
        debugger;
        return (
            <div>
                <EditableLabel text={this.state.type} onFocus={this._handleFocus}
                onFocusOut={this._handleFocusOut}/>
                <EditableLabel text={this.state.type} onFocus={this._handleFocus}
                onFocusOut={this._handleFocusOut}/>
                <EditableLabel text={this.state.type} onFocus={this._handleFocus}
                onFocusOut={this._handleFocusOut}/>
                {/* <InlineEdit text={this.state.price} paramName="price" change={}/> */}
                {/* <InlineEdit text={this.state.duration} paramName="duration" change={}/> */}
            </div>
        )
    }
}
