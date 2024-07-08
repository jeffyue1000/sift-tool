import React, { useState } from "react";
import "../styles/LoginScreen.css";
import { useSessionAuth } from "../context/SessionAuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function LoginScreen() {
    const { setSessionAuthenticated, setSessionDetails, setAdminAuthenticated } = useSessionAuth();
    const [sessionID, setSessionID] = useState("");
    const [passkey, setPasskey] = useState("");
    const [adminKey, setAdminKey] = useState("");
    const [failedLogin, setFailedLogin] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const res = await axios.post(
                "http://localhost:3001/sessions/loginSession",
                { sessionID: sessionID, passkey: passkey, adminKey: adminKey },
                { withCredentials: true }
            );
            if (res.data.validLogin) {
                setSessionAuthenticated(true);
                setSessionDetails({ sessionID: res.data.session.sessionID, duration: res.data.session.duration });
                if (res.data.admin) {
                    setAdminAuthenticated(true);
                }
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
            <input
                className="input"
                type="password"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                placeholder="Enter Admin Key (Optional)"
            />
            {failedLogin && <div>Could not find a session with those credentials!</div>}
            <button onClick={handleLogin}>Join Session</button>
        </div>
    );
}
