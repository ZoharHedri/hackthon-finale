import React, { Component } from 'react'
import axios from 'axios'
import { inject } from 'mobx-react';
import { debounce } from 'lodash';
import './SearchBar.scss';

@inject("store")
class SearchBar extends Component {
  constructor() {
    super()
    this.state = { textInput: '' };
  }

  handleTextChange = text => {
    this.setState({ textInput: text })
  }


  handleKeyUp = debounce(() => {
    if (this.state.textInput === "") return;
    axios.get(`/bussiness/search/${this.state.textInput}`)
      .then(res => {
        if (res.data.success) {
          this.props.store.updateBusinessArr(res.data.filter);
        }
        console.log(res.data);
      })
      .catch(err => { throw err; })
  }, 500);

  render() {
    return (
      <div className="searchBar">
        <input placeholder="search" className="searchBar__input" type="text" value={this.state.textInput} onKeyUp={this.handleKeyUp.bind(this)} onChange={(e) => this.handleTextChange(e.target.value)} />
      </div>
    )
  }
}

export default SearchBar
