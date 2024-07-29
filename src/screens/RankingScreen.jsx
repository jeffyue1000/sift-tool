import React, { useEffect, useState } from "react";
import axios from "axios";
import ApplicantRank from "../components/ApplicantRank";
import { useSessionAuth } from "../context/SessionAuthContext";
import "../styles/RankingScreen.css";

const MAX_ITEMS_PER_PAGE = 20;

export default function RankingScreen() {
    const [applicants, setApplicants] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedGradYear, setSelectedGradYear] = useState("All");
    const [currentTab, setCurrentTab] = useState("rankings");
    const { sessionDetails, verifySession } = useSessionAuth();

    const fetchApplicants = async () => {
        try {
            // Fetch all resumes in current session
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
        verifySession();
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

    const showResume = async (index) => {
        try {
            const res = await axios.get(`http://localhost:3001/resumes/getResumePDF`, {
                params: { id: applicants[index]._id },
            });
            if (res.data.getPdfSuccess) {
                window.open(res.data.url, "_blank");
            }
        } catch (error) {
            console.error("Error displaying resume pdf", error);
        }
    };

    const gradYears = ["All", ...[...new Set(applicants.map((applicant) => applicant.gradYear))].sort((a, b) => parseInt(b) - parseInt(a))];

    const filteredApplicants =
        selectedGradYear === "All" ? applicants : applicants.filter((applicant) => applicant.gradYear === selectedGradYear);

    const rankingsApplicants = filteredApplicants.filter((applicant) => !applicant.excluded);
    const pushedApplicants = filteredApplicants.filter((applicant) => applicant.auto > 0 && applicant.excluded);
    const rejectedApplicants = filteredApplicants.filter((applicant) => applicant.auto < 0 && applicant.excluded);
    const totalPages = Math.ceil(
        (currentTab === "rankings" ? rankingsApplicants : currentTab === "push" ? pushedApplicants : rejectedApplicants).length /
            MAX_ITEMS_PER_PAGE
    );
    const currentApplicants = (
        currentTab === "rankings" ? rankingsApplicants : currentTab === "push" ? pushedApplicants : rejectedApplicants
    ).slice((currentPage - 1) * MAX_ITEMS_PER_PAGE, currentPage * MAX_ITEMS_PER_PAGE);

    return (
        <div className="ranking-container-wrapper">
            <div className="ranking-container">
                <div className="ranking-tabs">
                    <button
                        className={`tab ${currentTab === "rankings" ? "active" : ""}`}
                        onClick={() => {
                            setCurrentPage(1);
                            setCurrentTab("rankings");
                        }}
                    >
                        Rankings
                    </button>
                    {pushedApplicants.length > 0 && (
                        <button
                            className={`tab ${currentTab === "push" ? "active" : ""}`}
                            onClick={() => {
                                setCurrentPage(1);
                                setCurrentTab("push");
                            }}
                        >
                            Pushed
                        </button>
                    )}
                    {rejectedApplicants.length > 0 && (
                        <button
                            className={`tab ${currentTab === "reject" ? "active" : ""}`}
                            onClick={() => {
                                setCurrentPage(1);
                                setCurrentTab("reject");
                            }}
                        >
                            Rejected
                        </button>
                    )}
                </div>
                {/* <h1 className="header">Aggregate Rankings</h1> */}
                {currentTab === "rankings" && (
                    <div className="ranking-screen">
                        {currentApplicants.map((applicant, index) => (
                            <ApplicantRank
                                key={applicant._id}
                                name={applicant.name}
                                gradYear={applicant.gradYear}
                                eloScore={Math.round(applicant.eloScore * 10) / 10}
                                rank={index + 1 + (currentPage - 1) * MAX_ITEMS_PER_PAGE}
                                onClick={() => showResume(index)}
                                excluded={applicant.excluded}
                            />
                        ))}
                    </div>
                )}
                {currentTab === "push" && (
                    <div className="ranking-screen">
                        {currentApplicants.map((applicant, index) => (
                            <ApplicantRank
                                key={applicant._id}
                                name={applicant.name}
                                gradYear={applicant.gradYear}
                                onClick={() => showResume(index)}
                                excluded={applicant.excluded}
                            />
                        ))}
                    </div>
                )}
                {currentTab === "reject" && (
                    <div className="ranking-screen">
                        {currentApplicants.map((applicant, index) => (
                            <ApplicantRank
                                key={applicant._id}
                                name={applicant.name}
                                gradYear={applicant.gradYear}
                                onClick={() => showResume(index)}
                                excluded={applicant.excluded}
                            />
                        ))}
                    </div>
                )}
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
