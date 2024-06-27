import React, { useState } from "react";
import "../styles/ComparisonScreen.css";
import ApplicantRank from "../components/ApplicantRank";

const applicants = [
    {
        name: "Rohan Agarwal",
        gradYear: 2027,
        rank: 1,
        eloScore: 1500,
    },
    { name: "Jeff Yue", gradYear: 2026, rank: 5, eloScore: 1400 },
];

export default function ComparisonScreen() {
    return (
        <div className="comparison-container">
            {applicants.map((applicant, index) => (
                <ApplicantRank
                    key={index}
                    name={applicant.name}
                    gradYear={applicant.gradYear}
                    rank={applicant.rank}
                    eloScore={applicant.eloScore}
                />
            ))}
        </div>
    );
}
