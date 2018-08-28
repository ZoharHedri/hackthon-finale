import React, { Component } from 'react'
import axios from axios

class SearchBar extends Component {
  constructor() {
    super()
    this.state = {textInput: '' };
  }

  handleTextChange = (e) => {
    this.setState({textInput: e.target.value})

  }


  render() {
    return (
      <div>
        <input type="text" ></input>
        <button></button>
        
      </div>
    )
  }
}

export default SearchBar
