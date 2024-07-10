import { React, useEffect, useState } from "react";
import ResumePDF from "../components/ResumePdf";
import Screen from "../components/Screen";
import { useSessionAuth } from "../context/SessionAuthContext";
import axios from "axios";
import "../styles/ComparisonScreen.css";

export default function ComparisonScreen() {
    const [resumes, setResumes] = useState({
        leftResume: null,
        rightResume: null,
    });
    const [resumeUrls, setResumeUrls] = useState({
        leftURL: "",
        rightURL: "",
    });
    const [canCompare, setCanCompare] = useState(false);
    const { sessionDetails } = useSessionAuth();

    const getComparisonResumes = async () => {
        try {
            const res = await axios.get("http://localhost:3001/resumes/getComparisonResumes", {
                params: {
                    sessionID: sessionDetails.sessionID,
                    resumeCount: sessionDetails.resumeCount,
                },
            });
            if (res.data.leftResume && res.data.rightResume) {
                setResumes({
                    leftResume: res.data.leftResume,
                    rightResume: res.data.rightResume,
                });
            }
        } catch (error) {
            console.error("Error getting resumes for comparison", error);
        }
    };

    const getResumePdfs = async () => {
        try {
            if (resumes.leftResume && resumes.rightResume) {
                const leftRes = await axios.get(
                    "http://localhost:3001/resumes/getResumePDF",
                    {
                        params: { id: resumes.leftResume._id },
                    }
                );
                const rightRes = await axios.get(
                    "http://localhost:3001/resumes/getResumePDF",
                    {
                        params: { id: resumes.rightResume._id },
                    }
                );

                setResumeUrls({
                    leftURL: leftRes.data.url,
                    rightURL: rightRes.data.url,
                });
            }
        } catch (error) {
            console.error("Error getting resume PDFs", error);
        }
    };
    const handleWinner = async (winner) => {
        try {
            await axios.post("http://localhost:3001/resumes/compareResumes", {
                ...resumes,
                winner: winner,
                sessionID: sessionDetails.sessionID,
            });
            getComparisonResumes();
        } catch (error) {
            console.error("Error comparing resumes", error);
        }
    };

    useEffect(() => {
        if (parseInt(sessionDetails.resumeCount) >= 2) {
        if (parseInt(sessionDetails.resumeCount) >= 2) {
            setCanCompare(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (canCompare) {
            getComparisonResumes();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [canCompare]);

    useEffect(() => {
        getResumePdfs();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resumes]);

    return (
        <Screen>
            {canCompare ? (
                <div className="compare-container">
                    <div className="resumes">
                        <ResumePDF
                            resumeURL={resumeUrls.leftURL}
                            onClick={() => handleWinner("leftWin")}
                        />
                        <ResumePDF
                            resumeURL={resumeUrls.rightURL}
                            onClick={() => handleWinner("rightWin")}
                        />
                    </div>
                </div>
            ) : (
                <div>Upload More Resumes To Compare First!</div>
            )}
        </Screen>
    );
}
