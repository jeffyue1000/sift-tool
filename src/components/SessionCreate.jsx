import { React, useState, useEffect } from "react";
import axios from "axios";
import { useSessionAuth } from "../context/SessionAuthContext";
import { useNavigate } from "react-router-dom";

export default function SessionCreate({ configData }) {
    const [sessionID, setSessionID] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [adminKey, setAdminKey] = useState("");
    const [confirmAdminKey, setConfirmAdminKey] = useState("");
    const [passwordsMatch, setPasswordsMatch] = useState(true);
    const [adminKeysMatch, setAdminKeysMatch] = useState(true);
    const [sessionExists, setSessionExists] = useState(false);
    const [sessionCreated, setSessionCreated] = useState(false);
    const { setSessionAuthenticated, setSessionDetails } = useSessionAuth();
    const navigate = useNavigate();

    const onCreateSession = async () => {
        try {
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
                setSessionExists(true);
                return;
            }
            if (res.data.creationSuccess) {
                setSessionAuthenticated(true);
                setSessionDetails({ sessionID: res.data.session.sessionID, duration: res.data.session.duration });
                setSessionCreated(true);
            }
            navigate("/upload");
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
        if (confirmAdminKey === adminKey || confirmAdminKey === "") {
            setAdminKeysMatch(true);
        } else {
            setAdminKeysMatch(false);
        }
    }, [confirmPassword, password, confirmAdminKey, adminKey]);

    return (
        <div>
            <h2>Create Session</h2>
            {/* should make button non-clickable until all are filled */}
            {/* make a reveal button for passwords? */}
            <input
                type="text"
                value={sessionID}
                placeholder="Enter New Session ID"
                onChange={(e) => setSessionID(e.target.value)}
            />
            <input
                type="password"
                value={password}
                placeholder="Enter Password"
                onChange={(e) => setPassword(e.target.value)}
            />
            <input
                type="password"
                value={confirmPassword}
                placeholder="Confirm Password"
                onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <input
                type="password"
                value={adminKey}
                placeholder="Admin Key"
                onChange={(e) => setAdminKey(e.target.value)}
            />
            <input
                type="password"
                value={confirmAdminKey}
                placeholder="Confirm Admin Key"
                onChange={(e) => setConfirmAdminKey(e.target.value)}
            />
            {!passwordsMatch && <div>Passwords do not match!</div>}
            {!adminKeysMatch && <div>Admin keys do not match!</div>}
            {sessionExists && <div>Session with that ID already exists!</div>}
            {sessionCreated && <div>Session created successfully!</div>}
            <button onClick={onCreateSession}>Create Sifting Session</button>
        </div>
    );
}
