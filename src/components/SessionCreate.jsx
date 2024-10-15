import { React, useState, useEffect } from "react";
import axios from "axios";
import { useSessionAuth } from "../context/SessionAuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/SessionCreate.css";

export default function SessionCreate({ configData }) {
    //session creation screen
    const [sessionID, setSessionID] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [adminKey, setAdminKey] = useState("");
    const [passwordsMatch, setPasswordsMatch] = useState(true);
    const [sessionExists, setSessionExists] = useState(false);
    const [sessionCreated, setSessionCreated] = useState(false);
    const [invalidCreate, setInvalidCreate] = useState(false);
    const { setSessionAuthenticated, setSessionDetails, setAdminAuthenticated } = useSessionAuth();

    const navigate = useNavigate();

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            onCreateSession();
        }
    };
    const onCreateSession = async () => {
        try {
            if (sessionID === "" || password === "" || confirmPassword === "" || adminKey === "") {
                setInvalidCreate(true);
                return;
            }
            const session = {
                sessionID: sessionID,
                password: password,
                adminKey: adminKey,
                maxResumes: configData.maxResumes,
                duration: configData.duration,
            };
            const res = await axios.post(`http://localhost:3001/sessions/createSession`, session, {
                withCredentials: "true",
            });

            if (res.data.sessionExists) {
                console.log("test");
                setSessionExists(true);
                return;
            }
            if (res.data.creationSuccess) {
                setSessionAuthenticated(true);
                setAdminAuthenticated(true);
                const session = res.data.session;
                setSessionDetails({
                    sessionID: session.sessionID,
                    duration: session.duration,
                    resumeCount: session.resumeCount,
                    maxResumes: session.maxResumes,
                    totalComparisons: session.totalComparisons,
                    useReject: session.useReject,
                    usePush: session.usePush,
                    rejectRequireAdmin: session.rejectRequireAdmin,
                    pushRequireAdmin: session.pushRequireAdmin,
                    rejectQuota: session.rejectQuota * -1,
                    pushQuota: session.pushQuota,
                    useTimer: session.useTimer,
                    compareTimer: session.compareTimer,
                    updateAmount: session.updateAmount,
                });
                setSessionCreated(true);
            }
            navigate("/users");
        } catch (error) {
            console.error("Error creating session", error);
        }
    };

    useEffect(() => {
        if (confirmPassword === password || confirmPassword === "") {
            setPasswordsMatch(true);
        } else {
            setPasswordsMatch(false);
        }
    }, [confirmPassword, password, adminKey]);

    return (
        <div className="create-session-container">
            <h2 className="create-header">Create Session</h2>
            <input
                className="input-field"
                type="text"
                value={sessionID}
                placeholder="Enter New Session ID"
                onChange={(e) => setSessionID(e.target.value)}
                onKeyDown={handleKeyDown}
            />
            <input
                className="input-field"
                type="password"
                value={password}
                placeholder="Enter Password"
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
            />
            <input
                className="input-field"
                type="password"
                value={confirmPassword}
                placeholder="Confirm Password"
                onChange={(e) => setConfirmPassword(e.target.value)}
                onKeyDown={handleKeyDown}
            />
            <input
                className="input-field"
                type="password"
                value={adminKey}
                placeholder="Admin Key"
                onChange={(e) => setAdminKey(e.target.value)}
                onKeyDown={handleKeyDown}
            />
            <div className="popup-text">
                {!passwordsMatch && <div>Passwords do not match!</div>}
                {sessionExists && <div>Session with that ID already exists!</div>}
                {sessionCreated && <div>Session created successfully!</div>}
                {invalidCreate && <div>Complete all fields before submitting!</div>}
            </div>
            <button
                onClick={onCreateSession}
                className="submit-button"
            >
                Launch Session
            </button>
        </div>
    );
}
