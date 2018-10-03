import React, { Component } from 'react';
import './Rating.scss';
import axios from 'axios';
import Button from '@material-ui/core/Button';

export class Rating extends Component {
    timerId = null;
    state = {
        selected: 0,
        showMessage: false
    }
    handleClick = (e) => {
        e.preventDefault();
        this.setState({ selected: Number(e.currentTarget.attributes[0].nodeValue) });
    }
    handleSubmitRating = async () => {
        let token = localStorage.getItem('TOKEN');
        let opts = { headers: { Authorization: token } };
        let res = await axios.post(`/clients/rating/${this.props.bussinessId}`, { rating: this.state.selected }, opts);
        if (res.data.success) {
            this.timerId = setTimeout(this.dismissMessage, 2500);
            this.setState({ selected: 0, showMessage: true });
        }
    }
    dismissMessage = () => {
        this.setState({ showMessage: false });
    }
    render() {
        return (
            <React.Fragment>
                {!this.state.showMessage ?
                    <div className="rating-warp">
                        <h1 className="title">rate this bussiness</h1>
                        <div className="rating">
                            <ul >
                                <li name="1" className={this.state.selected >= 1 ? "active" : null} onClick={this.handleClick}>
                                    <input type="radio" name="rating" className="rating__radio" id="star1" />
                                    <label htmlFor="star1">
                                        <svg className="rating__star">
                                            <use xlinkHref="/sprite.svg#icon-star-full" />
                                        </svg>
                                    </label>
                                </li>
                                <li name="2" className={this.state.selected >= 2 ? "active" : null} onClick={this.handleClick}>
                                    <input type="radio" name="rating" className="rating__radio" id="star2" />
                                    <label htmlFor="star2">
                                        <svg className="rating__star">
                                            <use xlinkHref="/sprite.svg#icon-star-full" />
                                        </svg>
                                    </label>
                                </li>
                                <li name="3" className={this.state.selected >= 3 ? "active" : null} onClick={this.handleClick}>
                                    <input type="radio" name="rating" className="rating__radio" id="star3" />
                                    <label htmlFor="star3">
                                        <svg className="rating__star">
                                            <use xlinkHref="/sprite.svg#icon-star-full" />
                                        </svg>
                                    </label>
                                </li>
                                <li name="4" className={this.state.selected >= 4 ? "active" : null} onClick={this.handleClick}>
                                    <input type="radio" name="rating" className="rating__radio" id="star4" />
                                    <label htmlFor="star4">
                                        <svg className="rating__star">
                                            <use xlinkHref="/sprite.svg#icon-star-full" />
                                        </svg>
                                    </label>
                                </li>
                                <li name="5" className={this.state.selected >= 5 ? "active" : null} onClick={this.handleClick}>
                                    <input type="radio" name="rating" className="rating__radio" id="star5" />
                                    <label htmlFor="star5">
                                        <svg className="rating__star">
                                            <use xlinkHref="/sprite.svg#icon-star-full" />
                                        </svg>
                                    </label>
                                </li>
                            </ul>
                        </div>
                        <Button color="secondary" variant="flat" onClick={this.handleSubmitRating}>submit rating</Button>
                    </div>
                    : <span className="message">Thank you for your rating</span>}
            </React.Fragment>
        )
    }
}

export default Rating;
