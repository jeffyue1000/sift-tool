import { React, useEffect, useState } from "react";
import axios from "axios";

export default function () {
    const [sessionDetails, setSessionDetails] = useState({
        sessionID: "",
        password: "",
    });
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordsMatch, setPasswordsMatch] = useState(true);
    const [sessionExists, setSessionExists] = useState(false);
    const [sessionCreated, setSessionCreated] = useState(false);

    const createSession = async () => {
        try {
            const res = await axios.post(`http://localhost:3001/sessions/createSession`, sessionDetails);
            if (res.data === "Session exists") {
                setSessionExists(true);
            } else {
                setSessionCreated(true);
            }
        } catch (error) {
            console.error("Error creating session", error);
        }
    };

    useEffect(() => {
        if (confirmPassword === sessionDetails.password) {
            setPasswordsMatch(true);
        } else {
            setPasswordsMatch(false);
        }
    }, [confirmPassword]);

    return (
        <div>
            <h2>Create Session</h2>
            <input
                type="text"
                value={sessionDetails.sessionID}
                placeholder="Enter New Session ID"
                onChange={(e) => setSessionDetails({ ...sessionDetails, sessionID: e.target.value })}
                required
            />
            <input
                type="password"
                value={sessionDetails.password}
                placeholder="Enter Password"
                onChange={(e) => setSessionDetails({ ...sessionDetails, password: e.target.value })}
                required
            />
            <input
                type="password"
                value={confirmPassword}
                placeholder="Enter Password"
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
            />
            {!passwordsMatch && <div>Passwords do not match!</div>}
            {sessionExists && <div>Session with that ID already exists!</div>}
            {sessionCreated && <div>Session created successfully</div>}
            <button onClick={createSession}>Create Sifting Session</button>
        </div>
    );
}
