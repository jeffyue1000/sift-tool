import React, { useEffect, useState } from "react";
import axios from "axios";
import ApplicantRank from "../components/ApplicantRank";
import { useSessionAuth } from "../context/SessionAuthContext";
import { CSVLink } from "react-csv";
import Screen from "../components/Screen";
import "../styles/RankingScreen.css";

const MAX_ITEMS_PER_PAGE = 20;

export default function RankingScreen() {
    const [applicants, setApplicants] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedGradYear, setSelectedGradYear] = useState("All");
    const [currentTab, setCurrentTab] = useState("rankings");
    const [csvData, setCsvData] = useState([]);
    const [updateAmount, setUpdateAmount] = useState(10);
    // eslint-disable-next-line no-unused-vars
    const [renderCount, setRenderCount] = useState(0);
    const { sessionDetails, setSessionDetails, adminAuthenticated } =
        useSessionAuth();

    const headers = [
        { label: "Name", key: "name" },
        { label: "Grad Year", key: "gradYear" },
        { label: "Elo Score", key: "eloScore" },
        { label: "Pushed", key: "pushed" },
        { label: "Rejected", key: "rejected" },
    ];

    useEffect(() => {
        fetchApplicants();
        setUpdateAmount(sessionDetails.updateAmount);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const saveUpdateAmount = async () => {
        try {
            await axios.post(
                `http://localhost:3001/sessions/saveUpdateAmount`,
                {
                    updateAmount: updateAmount,
                    sessionID: sessionDetails.sessionID,
                }
            );
            setSessionDetails({
                ...sessionDetails,
                updateAmount: updateAmount,
            });
        } catch (error) {
            console.error("Error saving update amount: ", error);
        }
    };

    const updateResumeScore = async (id, currentScore, index) => {
        try {
            currentApplicants[index].eloScore += updateAmount;
            setRenderCount((prev) => prev + 1);
            await axios.post(`http://localhost:3001/resumes/updateScore`, {
                id: id,
                updateAmount: updateAmount,
                currentScore: currentScore,
            });
        } catch (error) {
            console.error("Error updating resume score: ", error);
        }
    };

    const generateCSVData = () => {
        setCsvData(
            applicants.map((applicant) => ({
                name: applicant.name,
                gradYear: applicant.gradYear,
                eloScore: Math.round(applicant.eloScore * 10) / 10,
                pushed:
                    applicant.auto > 0 && applicant.excluded ? "True" : "False",
                rejected:
                    applicant.auto < 0 && applicant.excluded ? "True" : "False",
            }))
        );
    };

    const fetchApplicants = async () => {
        try {
            // Fetch all resumes in current session
            const response = await axios.get(
                `http://localhost:3001/resumes/getAllResumes`,
                {
                    params: { sessionID: sessionDetails.sessionID },
                }
            );
            setApplicants(response.data);
        } catch (error) {
            console.error("Error fetching applicant data: ", error);
        }
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleGradYearChange = (gradYear) => {
        setSelectedGradYear(gradYear);
        setCurrentPage(1);
    };

    const showResume = async (index) => {
        try {
            const res = await axios.get(
                `https://sift-tool.com/api/resumes/getResumePDF`,
                {
                    params: { id: currentApplicants[index]._id },
                }
            );
            if (res.data.getPdfSuccess) {
                window.open(res.data.url, "_blank");
            }
        } catch (error) {
            console.error("Error displaying resume pdf", error);
        }
    };

    const gradYears = [
        "All",
        ...[...new Set(applicants.map((applicant) => applicant.gradYear))].sort(
            (a, b) => parseInt(b) - parseInt(a)
        ),
    ];

    const filteredApplicants =
        selectedGradYear === "All"
            ? applicants
            : applicants.filter(
                  (applicant) => applicant.gradYear === selectedGradYear
              );

    const rankingsApplicants = filteredApplicants.filter(
        (applicant) => !applicant.excluded
    );
    const pushedApplicants = filteredApplicants.filter(
        (applicant) => applicant.auto > 0 && applicant.excluded
    );
    const rejectedApplicants = filteredApplicants.filter(
        (applicant) => applicant.auto < 0 && applicant.excluded
    );
    const totalPages = Math.ceil(
        (currentTab === "rankings"
            ? rankingsApplicants
            : currentTab === "push"
            ? pushedApplicants
            : rejectedApplicants
        ).length / MAX_ITEMS_PER_PAGE
    );
    const currentApplicants = (
        currentTab === "rankings"
            ? rankingsApplicants
            : currentTab === "push"
            ? pushedApplicants
            : rejectedApplicants
    ).slice(
        (currentPage - 1) * MAX_ITEMS_PER_PAGE,
        currentPage * MAX_ITEMS_PER_PAGE
    );

    return (
        <Screen>
            {adminAuthenticated && (
                <div className="ranking-settings-container">
                    <div className="set-manual-update">
                        Change Amount
                        <input
                            className="manual-update-input"
                            type="number"
                            value={updateAmount}
                            onChange={(event) => {
                                setUpdateAmount(
                                    parseInt(event.target.value, 10)
                                );
                            }}
                        />
                        <button
                            className="manual-update-save"
                            onClick={saveUpdateAmount}
                        >
                            Save
                        </button>
                    </div>
                    {/* <button
                        onClick={() => {
                            console.log(currentApplicants);
                            console.log(sessionDetails.updateAmount);
                        }}
                    >
                        log
                    </button> */}
                    <CSVLink
                        className="export-csv-button"
                        data={csvData}
                        headers={headers}
                        filename="Sift_Rankings.csv"
                        onClick={() => {
                            generateCSVData();
                        }}
                    >
                        Export to CSV
                    </CSVLink>
                </div>
            )}
            <div className="ranking-container">
                <div className="ranking-tabs">
                    <button
                        className={`tab ${
                            currentTab === "rankings" ? "active" : ""
                        }`}
                        onClick={() => {
                            setCurrentPage(1);
                            setCurrentTab("rankings");
                        }}
                    >
                        Rankings
                    </button>
                    {pushedApplicants.length > 0 && (
                        <button
                            className={`tab ${
                                currentTab === "push" ? "active" : ""
                            }`}
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
                            className={`tab ${
                                currentTab === "reject" ? "active" : ""
                            }`}
                            onClick={() => {
                                setCurrentPage(1);
                                setCurrentTab("reject");
                            }}
                        >
                            Rejected
                        </button>
                    )}
                </div>
                {/* <div className="total-comparisons">
                    Total Comparisons: {sessionDetails.totalComparisons}
                </div> */}
                {currentTab === "rankings" && (
                    <div className="ranking-screen">
                        {currentApplicants.map((applicant, index) => (
                            <div
                                className="active-rankings"
                                key={applicant._id}
                            >
                                <ApplicantRank
                                    key={applicant._id}
                                    name={applicant.name}
                                    gradYear={applicant.gradYear}
                                    eloScore={
                                        Math.round(applicant.eloScore * 10) / 10
                                    }
                                    rank={
                                        index +
                                        1 +
                                        (currentPage - 1) * MAX_ITEMS_PER_PAGE
                                    }
                                    onClick={() => showResume(index)}
                                    excluded={applicant.excluded}
                                />
                                {adminAuthenticated && (
                                    <div
                                        className="manual-button"
                                        onClick={() => {
                                            updateResumeScore(
                                                applicant._id,
                                                applicant.eloScore,
                                                index
                                            );
                                        }}
                                    >
                                        <i className="fa-solid fa-plus"></i>
                                    </div>
                                )}
                            </div>
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
                            className={`page-button ${
                                currentPage === index + 1 ? "active" : ""
                            }`}
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
                        className={`filter-button ${
                            selectedGradYear === year ? "active" : ""
                        }`}
                    >
                        {year}
                    </button>
                ))}
            </div>
        </Screen>
    );
}
