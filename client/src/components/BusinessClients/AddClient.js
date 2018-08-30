import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import './AddClient.scss';
import ErrorList from '../ErrorList/ErrorList';
import Message from '../Message/Message';
import { debounce } from 'lodash';

@inject('store')
@observer
class AddClient extends Component {

  handleChange = event => {
    if (event.target.name === "avatar") {
      this.props.store.setRegisterClientForm({ key: event.target.name, value: event.target.files[0] })
    }
    else {
      this.props.store.setRegisterClientForm({ key: event.target.name, value: event.target.value })
    }
  }

  handleSubmit = event => {
    // Prevent the default behavior of the page (refresh)-using in forms
    event.preventDefault();
    this.props.store.registerClient();

  }
  handleKeyUpEmail = debounce(() => {
    this.props.store.isExists("client");
  }, 500);

  componentWillUnmount() {
    this.handleKeyUpEmail.cancel();
    this.props.store._clearErrors();
    this.props.store._clearMessage();
  }


  render() {
    return (
      <div className="register">
        <div className="register__hero">
          <img className="register__img" src="/images/accounting-alone-application-938965.jpg" alt="" />
        </div>
        <div className="register__main">
          <h1 className="register__header">Sign Up</h1>
          <ErrorList />
          <form noValidate autoComplete="off" className="register__form" onSubmit={this.handleSubmit} >
            <div className="register__input-group">
              <span className="register__label" >Name</span>
              <input required className="register__input" onChange={this.handleChange} name="name" type="text" placeholder="name" />
              <div className="register__valid"></div>
            </div>
            <div className="register__input-group">
              <span className="register__label" >Phone</span>
              <input required className="register__input" onChange={this.handleChange} name="phone" type="text" placeholder="phone" />
              <div className="register__valid"></div>
            </div>
            <div className="register__input-group">
              <span className="register__label" >Email</span>
              <div className="register__input-msg-group">
                <input required className="register__input" onKeyUp={this.handleKeyUpEmail} onChange={this.handleChange} name="email" type="email" placeholder="email" />
                {this.props.store.message && <Message className="register__msg" message={this.props.store.message} />}
                <div className="register__valid"></div>
              </div>
            </div>
            <div className="register__input-group">
              <span className="register__label" >Password</span>
              <input required className="register__input" onChange={this.handleChange} name="password" type="password" placeholder="password" />
              <div className="register__valid"></div>
            </div>
            <div className="register__input-group">
              <span className="register__label" >Confirm Password</span>
              <input required className="register__input" onChange={this.handleChange} name="confirmPassword" type="password" placeholder="retype password" />
              <div className="register__valid"></div>
            </div>
            <div className="register__input-group">
              <span className="register__label" >Upload File</span>
              <input required className="register__input" onChange={this.handleChange} name="avatar" type="file" />
            </div>
            <button className="register__btn" type="submit">Register</button>
          </form>
        </div>
      </div>
    )
  }
}

export default AddClient
