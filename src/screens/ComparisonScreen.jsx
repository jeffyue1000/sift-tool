import { React, useEffect, useState } from "react";
import ResumePDF from "../components/ResumePdf";
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
    const [winner, setWinner] = useState();

    const { sessionDetails } = useSessionAuth();

    const getComparisonResumes = async () => {
        try {
            const res = await axios.get("http://localhost:3001/resumes/getComparisonResumes", {
                params: { sessionID: sessionDetails.sessionID },
            });
            setResumes({
                leftResume: res.data.leftResume,
                rightResume: res.data.rightResume,
            });
        } catch (error) {
            console.error("Error getting resumes for comparison", error);
        }
    };

    const getResumePdfs = async () => {
        try {
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
        } catch (error) {
            console.error("Error getting resume PDFs", error);
        }
    };
    const handleWinner = async () => {
        try {
            await axios.post("http://localhost:3001/resumes/compareResumes", {
                ...resumes,
                winner: winner,
                sessionID: sessionDetails.sessionID,
            });
        } catch (error) {
            console.error("Error comparing resumes", error);
        }
    };
    useEffect(() => {
        getComparisonResumes();
        getResumePdfs();
    }, []);

    useEffect(() => {
        getComparisonResumes();
        getResumePdfs();
        handleWinner();
    }, [winner]);

    return (
        <div>
            <ResumePDF
                resumeURL={resumeUrls.leftURL}
                onClick={() => setWinner(resumes.leftResume)}
            />
            <ResumePDF
                resumeURL={resumeUrls.rightURL}
                onClick={() => setWinner(resumes.rightResume)}
            />
        </div>
    );
}
