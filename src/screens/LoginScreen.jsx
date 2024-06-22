import React, { useState } from "react";
import "../styles/LoginScreen.css";

export default function LoginScreen() {
    const [passkey, setPasskey] = useState(""); // State to hold the passkey
    const [correctPassword, setCorrectPassword] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault(); // Prevent the default form submission behavior
        if (passkey === "1234") {
            alert("Welcome to the Resume Sifting Session!");
            //setCorrectPassword(true);
        } else {
            //setCorrectPassword(false);
            alert("Invalid passkey. Please try again.");
        }
    };

    return (
        <div className="login-container">
            <h2>Join Resume Sifting Session</h2>
            <form onSubmit={handleSubmit}>
                <input
                    className="input"
                    type="password"
                    value={passkey}
                    onChange={(e) => setPasskey(e.target.value)}
                    placeholder="Enter Passkey"
                    required
                />
                <button type="submit">Join Session</button>
            </form>
        </div>
    );
}
