import React from "react";
import "../styles/ApplicantRank.css";

export default function ApplicantRank({ name, gradYear, eloScore, rank, onClick }) {
    return (
        <div
            className="applicant-box"
            onClick={onClick}
        >
            <h3 className="applicant-name">{name}</h3>
            <div className="applicant-details">
                <p className="applicant-detail">Grad Year: {gradYear}</p>
                {eloScore && <p className="applicant-detail">ELO Score: {eloScore}</p>}
                {rank && <p className="applicant-detail">Rank: {rank}</p>}
            </div>
        </div>
    );
}
