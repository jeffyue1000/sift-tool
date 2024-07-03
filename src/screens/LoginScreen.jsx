import React, { useState } from "react";
import "../styles/LoginScreen.css";
import { useSessionAuth } from "../context/SessionAuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function LoginScreen() {
    const { setSessionAuthenticated, setSessionDetails } = useSessionAuth();
    const [sessionID, setSessionID] = useState("");
    const [passkey, setPasskey] = useState("");
    const [failedLogin, setFailedLogin] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const res = await axios.post(
                "http://localhost:3001/sessions/loginSession",
                { sessionID: sessionID, passkey: passkey },
                { withCredentials: true }
            );
            if (res.data.validLogin) {
                setSessionAuthenticated(true);
                setSessionDetails({ sessionID: res.data.session.sessionID, duration: res.data.session.duration });
                navigate("/compare");
            } else {
                setFailedLogin(true);
            }
        } catch (error) {
            console.log("Error signing in to session", error);
        }
        return false;
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
