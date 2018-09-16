import React, { Component } from 'react'
import { observer, inject } from 'mobx-react';
import ActivityList from './ActivityList';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper'
import './ActivityForm.scss';
import LoadingHOC from '../LoadingHOC/LoadingHOC';

@inject("store")
@observer
class ActivityForm extends Component {
    state = {
        open: false
    }
    handleChange = (e) => {
        this.props.store.setActivityForm({ key: e.target.name, value: e.target.value })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.store.addActivity();
        this.handleClose();
    }

    componentDidMount() {
        this.props.store.getActivities();
    }
    handleClick = () => {
        this.setState({ open: true });
    }
    handleClose = () => {
        this.setState({ open: false });
    }
    render() {
        return (
            <div>
                <Button style={{ marginLeft: "20px", marginTop: "32px" }} variant="contained" color="primary" onClick={this.handleClick}>ADD ACTIVTY</Button>
                <Modal
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                    open={this.state.open}
                    onClose={this.handleClose}
                >
                    <Paper className="activity-form-warp">
                        <div className="activity-from-headline">Add a new Activty</div>
                        <form autoComplete="off" className="activity-form" onSubmit={this.handleSubmit}>
                            <div className="activity-form__group">
                                <span className="activity-form__label">Type</span>
                                <input className="activity-form__input" type="text" name="type" placeholder="type" onChange={this.handleChange} />
                            </div>
                            <div className="activity-form__group">
                                <span className="activity-form__label">Price</span>
                                <input className="activity-form__input" type="text" name="price" placeholder="price" onChange={this.handleChange} />
                            </div>
                            <div className="activity-form__group">
                                <span className="activity-form__label">Duration</span>
                                <input className="activity-form__input" type="text" name="duration" placeholder="duration" onChange={this.handleChange} />
                            </div>
                            <Button type="submit" variant="contained" color="secondary">Add</Button>
                        </form>
                    </Paper>
                </Modal>
                <LoadingHOC>
                    <ActivityList />
                </LoadingHOC>
            </div>
        )
    }
}

export default ActivityForm;