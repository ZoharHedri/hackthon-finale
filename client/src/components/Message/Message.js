import React from 'react';
import './Message.scss';

export default ({ message, className }) => {
    return (
        <span className={className}>
            {message}
        </span>
    )
}


