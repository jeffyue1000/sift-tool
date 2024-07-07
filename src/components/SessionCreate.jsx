import { React, useState, useEffect } from "react";
import axios from "axios";
import { useSessionAuth } from "../context/SessionAuthContext";
import "../styles/SessionCreate.css";

export default function SessionCreate({ configData }) {
    const [sessionID, setSessionID] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordsMatch, setPasswordsMatch] = useState(true);
    const [sessionExists, setSessionExists] = useState(false);
    const [sessionCreated, setSessionCreated] = useState(false);
    const { setSessionAuthenticated, setSessionDetails } = useSessionAuth();

    const onCreateSession = async () => {
        try {
            const session = {
                sessionID: sessionID,
                password: password,
                maxResumes: configData.maxResumes,
                duration: configData.duration,
            };
            const res = await axios.post(
                `http://localhost:3001/sessions/createSession`,
                session,
                {
                    withCredentials: "true",
                }
            );

            if (res.data.sessionExists) {
                setSessionExists(true);
            } else if (res.data.creationSucces) {
                setSessionAuthenticated(true);
                setSessionDetails({
                    sessionID: res.data.session.sessionID,
                    duration: res.data.session.duration,
                });
                setSessionCreated(true);
            }
            //push to new screen?
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
    }, [confirmPassword, password]);

    return (
        <div className="create-session-container">
            <h2 className="create-header">Create Session</h2>
            {/* should make button non-clickable until all are filled */}
            <input
                className="input-field"
                type="text"
                value={sessionID}
                placeholder="Enter New Session ID"
                onChange={(e) => setSessionID(e.target.value)}
            />
            <input
                className="input-field"
                type="password"
                value={password}
                placeholder="Enter Password"
                onChange={(e) => setPassword(e.target.value)}
            />
            <input
                className="input-field"
                type="password"
                value={confirmPassword}
                placeholder="Confirm Password"
                onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {!passwordsMatch && <div>Passwords do not match!</div>}
            {sessionExists && <div>Session with that ID already exists!</div>}
            {sessionCreated && <div>Session created successfully!</div>}
            <button
                onClick={onCreateSession}
                className="submit-button"
            >
                Launch Session
            </button>
        </div>
    );
}
