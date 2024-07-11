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
    const [selectedGradYear, setSelectedGradYear] = useState("All");

    const fetchApplicants = async () => {
        try {
            // Fetch all resumes in current session
            const response = await axios.get(`http://localhost:3001/resumes/getAllResumes`, {
                params: { sessionID: sessionDetails.sessionID },
            });
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

    const handleGradYearChange = (gradYear) => {
        setSelectedGradYear(gradYear);
        setCurrentPage(1);
    };

    const gradYears = [
        "All",
        ...[...new Set(applicants.map((applicant) => applicant.gradYear))].sort((a, b) => parseInt(b) - parseInt(a)),
    ];

    const filteredApplicants =
        selectedGradYear === "All"
            ? applicants
            : applicants.filter((applicant) => applicant.gradYear === selectedGradYear);

    const totalPages = Math.ceil(filteredApplicants.length / MAX_ITEMS_PER_PAGE);
    const currentApplicants = filteredApplicants.slice(
        (currentPage - 1) * MAX_ITEMS_PER_PAGE,
        currentPage * MAX_ITEMS_PER_PAGE
    );

    return (
        <div className="ranking-container-wrapper">
            <div className="ranking-container">
                <div className="header">Aggregate Rankings</div>
                <div className="ranking-screen">
                    {currentApplicants.map((applicant, index) => (
                        <ApplicantRank
                            key={applicant._id}
                            name={applicant.name}
                            gradYear={applicant.gradYear}
                            eloScore={Math.round(applicant.eloScore)}
                            rank={index + 1 + (currentPage - 1) * MAX_ITEMS_PER_PAGE}
                        />
                    ))}
                </div>
                <div className="pages">
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index + 1}
                            onClick={() => handlePageChange(index + 1)}
                            className={`page-button ${currentPage === index + 1 ? "active" : ""}`}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            </div>
            <div className="filter-buttons">
                {gradYears.map((year) => (
                    <button
                        key={year}
                        onClick={() => handleGradYearChange(year)}
                        className={`filter-button ${selectedGradYear === year ? "active" : ""}`}
                    >
                        {year}
                    </button>
                ))}
            </div>
        </div>
    );
}
