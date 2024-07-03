import React, { useState } from "react";
import axios from "axios";
import "../styles/LoginScreen.css";
import { useSessionAuth } from "../context/SessionAuthContext";

export default function LoginScreen() {
    const { login } = useSessionAuth();
    const [sessionID, setSessionID] = useState("");
    const [passkey, setPasskey] = useState("");
    const [failedLogin, setFailedLogin] = useState(false);

    const handleLogin = async () => {
        const loginSuccess = await login({ sessionID: sessionID, passkey: passkey });
        //if context has not changed after log in attempt, display log in error message
        if (!loginSuccess) {
            setFailedLogin(true);
        }
    };

    return (
        <div className="login-container">
            <h2>Join Resume Sifting Session</h2>
            <input
                className="input"
                type="text"
                value={sessionID}
                onChange={(e) => setSessionID(e.target.value)}
                placeholder="Enter Session ID"
            />
            <input
                className="input"
                type="password"
                value={passkey}
                onChange={(e) => setPasskey(e.target.value)}
                placeholder="Enter Passkey"
            />
            {failedLogin && <div>SessionID or passkey is incorrect</div>}
            <button onClick={handleLogin}>Join Session</button>
        </div>
    );
}
