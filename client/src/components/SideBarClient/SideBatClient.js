import React from 'react';
import { Link } from 'react-router-dom'

export default (props) => {
    return (
        <div className="myclient__sidebar">
            <div className={props.pathname === "/client/search" ? "myclient__item myclient__item--active" : "myclient__item"}>
                <div className="myclient__icon-warp">
                    <svg className="myclient__icon">
                        <use xlinkHref="/sprite.svg#icon-display" />
                    </svg>
                </div>
                <Link className="myclient__link" to="/client/search">search</Link>
            </div>
            <div className={props.pathname === "/client/appointments" ? "myclient__item myclient__item--active" : "myclient__item"}>
                <div className="myclient__icon-warp">
                    <svg className="myclient__icon">
                        <use xlinkHref="/sprite.svg#icon-address-book" />
                    </svg>
                </div>
                <Link className="myclient__link" to="/client/appointments">appointments</Link>
            </div>
        </div>
    )
}
