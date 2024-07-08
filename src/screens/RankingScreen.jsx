import React, { useEffect, useState } from "react";
import axios from "axios";
import ApplicantRank from "../components/ApplicantRank";
import { useSessionAuth } from "../context/SessionAuthContext";
import "../styles/RankingScreen.css";

export default function RankingScreen() {
    const [applicants, setApplicants] = useState([]);
    const { sessionDetails } = useSessionAuth();

    const fetchApplicants = async () => {
        try {
            //fetch all resumes in current session
            const response = await axios.get(`http://localhost:3001/resumes/getAllResumes`, {
                params: { sessionID: sessionDetails.sessionID },
            });
            console.log(response.data);
            setApplicants(response.data);
        } catch (error) {
            console.error("Error fetching applicant data", error);
        }
    };

    useEffect(() => {
        fetchApplicants();
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
