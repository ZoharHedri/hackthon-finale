import React, { Component } from 'react'
import { observer, inject } from '../../../node_modules/mobx-react';
import DisplayClientEvent from '../DisplayClientEvent/DisplayClientEvent'
import LoadingHOC from '../LoadingHOC/LoadingHOC';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

const style = {
    fontFamaliy: "'Segoe UI', sans-serif",
    fontSize: '1.2rem',
    fontWeight: 300
}

@inject("store")
@observer
class ClientEvents extends Component {
    render() {
        return (
            <LoadingHOC>
                {/* <div style={{ display: "flex", flexWrap: "wrap", width: "100%" }}>
                    {this.props.store.clientEvents.map(item =>
                        <DisplayClientEvent key={item._id} {...item} />
                    )}
                </div> */}
                <Table style={{ tableLayout: 'fixed' }}>
                    <TableHead>
                        <TableRow>
                            <TableCell style={style}>Date</TableCell>
                            <TableCell style={style}>Starting Time</TableCell>
                            <TableCell style={style}>Status</TableCell>
                            <TableCell style={style}>Type</TableCell>
                            <TableCell style={style}>Name</TableCell>
                            <TableCell style={style}>Address</TableCell>
                            <TableCell style={style}>Email</TableCell>
                            <TableCell style={style}>Phone</TableCell>
                            <TableCell style={style}>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.props.store.clientEvents.map(item =>
                            <TableRow key={item._id}>
                                <DisplayClientEvent {...item} />
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </LoadingHOC>
        )
    }
}

export default ClientEvents
