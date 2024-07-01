import React, { useState } from "react";
import "../styles/LoginScreen.css";

export default function LoginScreen() {
    const [sessionID, setSessionID] = useState("");
    const [passkey, setPasskey] = useState(""); // State to hold the passkey
    const [correctPassword, setCorrectPassword] = useState(false);

    const handleSubmit = (event) => {
        try {
            event.preventDefault();
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
                required
            />
            <input
                className="input"
                type="password"
                value={passkey}
                onChange={(e) => setPasskey(e.target.value)}
                placeholder="Enter Passkey"
                required
            />
            {/* add a conditional div for when session id or password are incorrect */}
            <button onClick={handleSubmit}>Join Session</button>
        </div>
    );
}
