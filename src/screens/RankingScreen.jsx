import React, { useEffect, useState } from "react";
import axios from "axios";
import ApplicantRank from "../components/ApplicantRank";
import { useSessionAuth } from "../context/SessionAuthContext";
import "../styles/RankingScreen.css";

const MAX_ITEMS_PER_PAGE = 20;

export default function RankingScreen() {
    const [applicants, setApplicants] = useState([]);
    const { sessionDetails } = useSessionAuth();
    const [currentPage, setCurrentPage] = useState(1);

    const fetchApplicants = async () => {
        try {
            //fetch all resumes in current session
            const response = await axios.get(
                `http://localhost:3001/resumes/getAllResumes`,
                {
                    params: { sessionID: sessionDetails.sessionID },
                }
            );
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

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const totalPages = Math.ceil(applicants.length / MAX_ITEMS_PER_PAGE);
    const currentApplicants = applicants.slice(
        (currentPage - 1) * MAX_ITEMS_PER_PAGE,
        currentPage * MAX_ITEMS_PER_PAGE
    );

    return (
        <div className="ranking-container">
            <h1 className="header">Aggregate Rankings</h1>
            <div className="ranking-screen">
                {currentApplicants.map((applicant) => (
                    <ApplicantRank
                        key={applicant._id}
                        name={applicant.name}
                        gradYear={applicant.gradYear}
                        eloScore={applicant.eloScore}
                        rank={applicant.rank}
                    />
                ))}
            </div>
            <div className="pages">
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => handlePageChange(index + 1)}
                        className={`page-button ${
                            currentPage === index + 1 ? "active" : ""
                        }`}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
}
