import React, { Component } from 'react'
import { observer, inject } from 'mobx-react';
import './ErrorList.scss';


const Error = ({ error }) => {
    return (
        <div className="error">
            {error}
        </div>
    )
}



@inject(allStore => ({
    errors: allStore.store.errors
}))
@observer
export class ErrorList extends Component {
    render() {
        return (
            <React.Fragment>
                {this.props.errors && this.props.errors.map((error, index) => <Error key={index} error={error.msg} />)}
            </React.Fragment>
        )
    }
}

export default ErrorList;
