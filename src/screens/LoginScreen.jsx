import React, { useState } from "react";
import axios from "axios";
import SessionConfig from "../components/SessionConfig";
import SessionCreate from "../components/SessionCreate";
import { useSessionAuth } from "../context/SessionAuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/LoginScreen.css";

export default function LoginScreen() {
    const { setSessionAuthenticated, setSessionDetails } = useSessionAuth();
    const [sessionID, setSessionID] = useState("");
    const [passkey, setPasskey] = useState("");
    const [failedLogin, setFailedLogin] = useState(false);
    const navigate = useNavigate();

    const [configData, setConfigData] = useState({
        maxResumes: 1,
        duration: 1,
    });
    const [currentTab, setCurrentTab] = useState("create");

    const onConfigSubmit = (maxResumes, duration) => {
        setConfigData({ maxResumes, duration });
        setCurrentTab("create");
    };

    const handleLogin = async () => {
        try {
            const res = await axios.post(
                "http://localhost:3001/sessions/loginSession",
                { sessionID: sessionID, passkey: passkey },
                { withCredentials: true }
            );
            if (res.data.validLogin) {
                setSessionAuthenticated(true);
                setSessionDetails({
                    sessionID: res.data.session.sessionID,
                    duration: res.data.session.duration,
                });
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
        <div className="main-container">
            <div className="tabs">
                <button
                    className={`tab ${currentTab === "create" ? "active" : ""}`}
                    onClick={() => setCurrentTab("create")}
                >
                    Create Session
                </button>
                <button
                    className={`tab ${currentTab === "login" ? "active" : ""}`}
                    onClick={() => setCurrentTab("login")}
                >
                    Join Session
                </button>
            </div>
            <div className="tab-content">
                {currentTab === "create" && (
                    <div className="section-container">
                        {currentTab === "config" ? (
                            <SessionConfig onSubmit={onConfigSubmit} />
                        ) : (
                            <SessionCreate configData={configData} />
                        )}
                    </div>
                )}
                {currentTab === "login" && (
                    <div className="section-container login-container">
                        <h2 className="join-header">Join Session</h2>
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
                        {failedLogin && (
                            <div className="error-message">
                                SessionID or passkey is incorrect
                            </div>
                        )}
                        <button
                            onClick={handleLogin}
                            className="submit-button"
                        >
                            Enter Session
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
