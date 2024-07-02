import React, { useState } from "react";
import axios from "axios";
import "../styles/LoginScreen.css";

export default function LoginScreen() {
    const [sessionID, setSessionID] = useState("");
    const [passkey, setPasskey] = useState(""); // State to hold the passkey
    const [correctLogin, setCorrectLogin] = useState(true);

    const handleLogin = async () => {
        try {
            const loginCredentials = {
                sessionID: sessionID,
                passkey: passkey,
            };
            const res = await axios.post("http://localhost:3001/sessions/loginSession", loginCredentials, {
                withCredentials: true,
            });
            if (res.data === "Password is incorrect") {
                setCorrectLogin(false);
            }
        } catch (error) {
            console.log("Error signing in to session", error);
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
            {!correctLogin && <div>SessionID or passkey is incorrect</div>}
            <button onClick={handleLogin}>Join Session</button>
        </div>
    );
}
