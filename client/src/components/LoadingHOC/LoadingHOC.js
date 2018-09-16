import React from 'react'
import { inject, observer } from 'mobx-react';
import Loading from '../Loading/Loading';

@inject("store")
@observer
class LoadingHOC extends React.Component {
    render() {
        return (
            this.props.store.isLoading ? <Loading /> : this.props.children
        )
    }
}

export default LoadingHOC
