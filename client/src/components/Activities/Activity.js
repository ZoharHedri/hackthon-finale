import React, { Component } from 'react'

export default class Activity extends Component {
    constructor(){
        super(props);
    }

    render() {
        return (
            <div>
                <div>{this.props.type}</div>
                <div>{this.props.price}</div>
                <div>{this.props.duration}</div>
            </div>
        )
    }
}
