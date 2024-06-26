import React from "react";
import "../styles/ApplicantRank.css";

export default function ApplicantRank({ name, gradYear, eloScore, rank }) {
    return (
        <div className="applicant-box">
            <h3 className="applicant-name">{name}</h3>
            <div className="applicant-details">
                <p className="applicant-detail">Grad Year: {gradYear}</p>
                <p className="applicant-detail">ELO Score: {eloScore}</p>
                <p className="applicant-detail">Rank: {rank}</p>
            </div>
        </div>
    );
}
