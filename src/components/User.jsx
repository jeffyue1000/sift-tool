import React from "react";
import "../styles/User.css";

export default function User({ name, numComparisons }) {
    return (
        <div className="user-box">
            <div className="user-name">{name}</div>
            <div className="user-details">
                <p className="user-detail">Comparisons: {numComparisons}</p>
            </div>
        </div>
    );
}
