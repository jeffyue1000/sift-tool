import React from "react";
import "../styles/User.css";

export default function User({ name, numComparisons }) {
    //user comparison display for admin setting screen
    return (
        <div className="user-box">
            <div className="user-name">{name}</div>
            <p className="user-detail">Comparisons: {numComparisons}</p>
        </div>
    );
}
