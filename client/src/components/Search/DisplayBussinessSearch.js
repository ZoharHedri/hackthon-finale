import React, { Component } from 'react'
import { observer, inject } from '../../../node_modules/mobx-react';
import './DisplayBussinessSearch.scss';
import { Link } from 'react-router-dom';

@inject("store")
@observer
class DisplayBussinessSearch extends Component {
    calculateWidth = () => {
        let starTotal = 5;
        let starPercentage = (this.props.rating / starTotal) * 100;
        const starPercentageRounded = `${Math.round(starPercentage / 10) * 10}%`;
        return starPercentageRounded;
    }
    render() {
        let activites = JSON.stringify(this.props.activites);
        let address = this.props.address;
        let _id = this.props._id;
        let avatarUrl = this.props.avatarUrl;
        let category = JSON.stringify(this.props.category);
        let email = this.props.email;
        let name = this.props.name;
        let phone = this.props.phone;
        let workingDays = JSON.stringify(this.props.workingDays);
        return (
            <div className="bussinessSearch">
                <div className="bussinessSearch__item">
                    <div className="bussinessSearch__item__img-box">
                        <img className="bussinessSearch__item__img" src={`/images/${this.props.avatarUrl}`} alt="" />
                    </div>
                    <div className="bussinessSearch__item__detail">
                        <Link to={{ pathname: `${this.props.name}/info`, state: { _id, activites, address, avatarUrl, category, email, name, phone, workingDays } }} className="bussinessSearch__item-name">{this.props.name}</Link>
                        <div className="bussinessSearch__item-box">
                            <div className="bussinessSearch__item-cat" style={{ background: this.props.category.color.hex }}>{this.props.category.name}</div>
                            <div className="bussinessSearch__rating-container">
                                <div className="bussinessSearch__rating-warp">
                                    <div className="bussinessSearch__rating-box">
                                        <svg className="bussinessSearch__star">
                                            <use xlinkHref="/sprite.svg#icon-star-full" />
                                        </svg>
                                        <svg className="bussinessSearch__star">
                                            <use xlinkHref="/sprite.svg#icon-star-full" />
                                        </svg>
                                        <svg className="bussinessSearch__star">
                                            <use xlinkHref="/sprite.svg#icon-star-full" />
                                        </svg>
                                        <svg className="bussinessSearch__star">
                                            <use xlinkHref="/sprite.svg#icon-star-full" />
                                        </svg>
                                        <svg className="bussinessSearch__star">
                                            <use xlinkHref="/sprite.svg#icon-star-full" />
                                        </svg>
                                    </div>
                                    <div style={{ width: this.calculateWidth() }} className="bussinessSearch__rating-box-yellow">
                                        <svg className="bussinessSearch__star">
                                            <use xlinkHref="/sprite.svg#icon-star-full" />
                                        </svg>
                                        <svg className="bussinessSearch__star">
                                            <use xlinkHref="/sprite.svg#icon-star-full" />
                                        </svg>
                                        <svg className="bussinessSearch__star">
                                            <use xlinkHref="/sprite.svg#icon-star-full" />
                                        </svg>
                                        <svg className="bussinessSearch__star">
                                            <use xlinkHref="/sprite.svg#icon-star-full" />
                                        </svg>
                                        <svg className="bussinessSearch__star">
                                            <use xlinkHref="/sprite.svg#icon-star-full" />
                                        </svg>
                                    </div>
                                </div>
                                <span className="bussinessSearch__star-number">{this.props.rating.toFixed(1)}</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div >
        )
    }
}

export default DisplayBussinessSearch
