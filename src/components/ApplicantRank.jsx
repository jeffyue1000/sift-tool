import React from "react";
import "../styles/ApplicantRank.css";

export default function ApplicantRank({ name, gradYear, eloScore, rank, onClick, excluded }) {
    return (
        <div
            className="applicant-box"
            onClick={onClick}
        >
            <h3 className="applicant-name">{name}</h3>
            <div className={`${excluded ? "applicant-details-excluded" : "applicant-details "}`}>
                <p className={` ${excluded ? "right-aligned" : "applicant-details "}`}>Grad Year: {gradYear}</p>
                {eloScore && <p className="applicant-detail">Score: {eloScore}</p>}
                {rank && <p className="applicant-detail">Rank: {rank}</p>}
            </div>
        </div>
    );
}
