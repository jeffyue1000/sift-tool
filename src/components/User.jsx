import React from "react";
import "../styles/User.css";

export default function User({ name, numComparisons }) {
    return (
        <div className="user-box">
            <h3 className="user-name">{name}</h3>
            <div className="user-details">
                <p className="user-detail">Comparisons: {numComparisons}</p>
            </div>
        </div>
    );
}
