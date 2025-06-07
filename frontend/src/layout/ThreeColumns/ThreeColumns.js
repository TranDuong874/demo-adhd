import React from 'react';
import './ThreeColumns.css';  // Import the CSS file

const ThreeColumns = ({ left, mid, right }) => {
    return (
        <div className="three-columns">
            <div className="column">{left}</div>
            <div className="column">{mid}</div>
            <div className="column">{right}</div>
        </div>
    );
}

export default ThreeColumns;
