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
    const [useTimer, setUseTimer] = useState(false);
    const [timeLeft, setTimeLeft] = useState();
    const [isDisabled, setIsDisabled] = useState(true);
    const { sessionDetails } = useSessionAuth();

    useEffect(() => {
        if (parseInt(sessionDetails.resumeCount) >= 2) {
            setCanCompare(true);
            setUseTimer(sessionDetails.useTimer);
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

    useEffect(() => {
        if (useTimer) {
            if (timeLeft > 0) {
                const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000); //decrement by one every 1000 milliseconds
                return () => clearTimeout(timerId);
            } else {
                setIsDisabled(false);
            }
        }
    }, [timeLeft, useTimer]);

    const getComparisonResumes = async () => {
        try {
            const res = await axios.get("http://localhost:3001/resumes/getComparisonResumes", {
                params: {
                    sessionID: sessionDetails.sessionID,
                    resumeCount: sessionDetails.resumeCount,
                },
            });
            if (res.data.message === "Not enough resumes to compare") {
                setCanCompare(false);
                return;
            }
            if (res.data.leftResume && res.data.rightResume) {
                setResumes({
                    leftResume: res.data.leftResume,
                    rightResume: res.data.rightResume,
                });
                if (useTimer) {
                    setIsDisabled(true);
                    setTimeLeft(sessionDetails.compareTimer);
                }
            }
        } catch (error) {
            console.error("Error getting resumes for comparison", error);
        }
    };

    const getResumePdfs = async () => {
        try {
            if (resumes.leftResume && resumes.rightResume) {
                const leftRes = await axios.get("http://localhost:3001/resumes/getResumePDF", {
                    params: { id: resumes.leftResume._id },
                });
                const rightRes = await axios.get("http://localhost:3001/resumes/getResumePDF", {
                    params: { id: resumes.rightResume._id },
                });

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
                totalComparisons: sessionDetails.totalComparisons,
            });
            getComparisonResumes();
        } catch (error) {
            console.error("Error comparing resumes", error);
        }
    };

    const handleAutoPush = async (resume) => {
        try {
            const request =
                resume === "left"
                    ? {
                          resume: resumes.leftResume,
                          pushQuota: sessionDetails.pushQuota,
                      }
                    : {
                          resume: resumes.rightResume,
                          pushQuota: sessionDetails.pushQuota,
                      };
            await axios.post(`http://localhost:3001/resumes/updateAutoPush`, request);
            getComparisonResumes();
        } catch (error) {
            console.error("Error updating auto push", error);
        }
    };

    const handleAutoReject = async (resume) => {
        try {
            const request =
                resume === "left"
                    ? {
                          resume: resumes.leftResume,
                          rejectQuota: sessionDetails.rejectQuota,
                      }
                    : {
                          resume: resumes.rightResume,
                          rejectQuota: sessionDetails.rejectQuota,
                      };
            await axios.post(`http://localhost:3001/resumes/updateAutoReject`, request);
            getComparisonResumes();
        } catch (error) {
            console.error("Error updating auto reject", error);
        }
    };

    return (
        <Screen>
            {canCompare ? (
                <div className="compare-container">
                    <div className="timer-container">{useTimer && <div className="timer">{timeLeft}</div>}</div>
                    <div className="resumes">
                        <div className="resume-render-container">
                            <div className="auto-btns-container">
                                {sessionDetails.usePush && (
                                    <button
                                        className="auto-btn"
                                        onClick={() => handleAutoPush("left")}
                                    >
                                        Push
                                    </button>
                                )}
                                {sessionDetails.useReject && (
                                    <button
                                        className="auto-btn"
                                        onClick={() => handleAutoReject("left")}
                                    >
                                        Reject
                                    </button>
                                )}
                            </div>
                            <ResumePDF
                                resumeURL={resumeUrls.leftURL}
                                onClick={() => handleWinner("leftWin")}
                                disabled={isDisabled}
                            />
                        </div>
                        <div className="resume-render-container">
                            <ResumePDF
                                resumeURL={resumeUrls.rightURL}
                                onClick={() => handleWinner("rightWin")}
                                disabled={isDisabled}
                            />
                            <div className="auto-btns-container">
                                {sessionDetails.usePush && (
                                    <button
                                        className="auto-btn"
                                        onClick={() => handleAutoPush("right")}
                                    >
                                        Push
                                    </button>
                                )}

                                {sessionDetails.useReject && (
                                    <button
                                        className="auto-btn"
                                        onClick={() => handleAutoReject("right")}
                                    >
                                        Reject
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div>Upload More Resumes To Compare First!</div>
            )}
        </Screen>
    );
}
