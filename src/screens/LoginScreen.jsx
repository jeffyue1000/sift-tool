import React, { useState } from "react";
import axios from "axios";
import SessionConfig from "../components/SessionConfig";
import SessionCreate from "../components/SessionCreate";
import { useSessionAuth } from "../context/SessionAuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/LoginScreen.css";

export default function LoginScreen() {
    const { setSessionAuthenticated, setSessionDetails, setAdminAuthenticated } = useSessionAuth();
    const [sessionID, setSessionID] = useState("");
    const [passkey, setPasskey] = useState("");
    const [adminKey, setAdminKey] = useState("");
    const [failedLogin, setFailedLogin] = useState(false);
    const navigate = useNavigate();

    const [configData, setConfigData] = useState({
        maxResumes: 1,
        duration: 1,
    });
    const [currentTab, setCurrentTab] = useState("login");

    const onConfigSubmit = (maxResumes, duration) => {
        setConfigData({ maxResumes, duration });
        setCurrentTab("create");
    };

    const handleKeyDown = (event) => {
        if (event.key == "Enter") {
            handleLogin();
        }
    };

    const handleLogin = async () => {
        try {
            const res = await axios.post(
                "http://localhost:3001/sessions/loginSession",
                { sessionID: sessionID, passkey: passkey, adminKey: adminKey },
                { withCredentials: true }
            );
            if (res.data.validLogin) {
                setSessionAuthenticated(true);
                setSessionDetails({
                    sessionID: res.data.session.sessionID,
                    duration: res.data.session.duration,
                    resumeCount: res.data.session.resumeCount,
                    maxResumes: res.data.session.maxResumes,
                    totalComparisons: res.data.session.totalComparisons,
                });
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
        <div className="main-container">
            <div className="tabs">
                <button
                    className={`tab ${currentTab === "login" ? "active" : ""}`}
                    onClick={() => setCurrentTab("login")}
                >
                    Join Session
                </button>
                <button
                    className={`tab ${currentTab === "config" || currentTab === "create" ? "active" : ""}`}
                    onClick={() => setCurrentTab("config")}
                >
                    Create Session
                </button>
            </div>
            <div className="tab-content">
                {currentTab === "config" && (
                    <div className="section-container">
                        <SessionConfig onSubmit={onConfigSubmit} />
                    </div>
                )}
                {currentTab === "create" && (
                    <div className="section-container">
                        <SessionCreate configData={configData} />
                    </div>
                )}
                {currentTab === "login" && (
                    <div className="section-container login-container">
                        <h2 className="join-header">Join Session</h2>
                        <input
                            className="input"
                            type="text"
                            value={sessionID}
                            placeholder="Enter Session ID"
                            onChange={(e) => setSessionID(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <input
                            className="input"
                            type="password"
                            value={passkey}
                            placeholder="Enter Passkey"
                            onChange={(e) => setPasskey(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <input
                            className="input"
                            type="password"
                            value={adminKey}
                            placeholder="Enter Admin Key (Optional)"
                            onChange={(e) => setAdminKey(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        {failedLogin && <div className="error-message">Could not find a session with those credentials!</div>}
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
