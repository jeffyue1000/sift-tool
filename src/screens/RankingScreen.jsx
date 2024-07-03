import React, { useEffect, useState } from "react";
import axios from "axios";
import ApplicantRank from "../components/ApplicantRank";
import "../styles/RankingScreen.css";

export default function RankingScreen() {
    const [applicants, setApplicants] = useState([]);

    const fetchApplicants = async () => {
        try {
            const response = await axios.get(
                `http://localhost:3001/resumes/getResumes`
            );
            console.log(response.data);
            setApplicants(response.data);
        } catch (error) {
            console.error("Error fetching applicant data", error);
        }
    };

    useEffect(() => {
        fetchApplicants();
    }, []);

    return (
        <div>
            <h1 className="header">Aggregate Rankings</h1>
            <div className="ranking-screen">
                {applicants.map((applicant) => (
                    <ApplicantRank
                        key={applicant._id}
                        name={applicant.name}
                        gradYear={applicant.gradYear}
                        eloScore={applicant.eloScore}
                        rank={applicant.rank}
                    />
                ))}
            </div>
        </div>
    );
}
