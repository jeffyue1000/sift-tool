import { React, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSessionAuth } from "../context/SessionAuthContext";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/ClubLogin.css";

export default function SessionConfig() {
    const [clubName, setClubName] = useState("");
    const [passkey, setPasskey] = useState("");
    const [failedLogin, setFailedLogin] = useState(false);
    const { setClubAuthenticated, setClubDetails } = useSessionAuth();

    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const res = await axios.post(`http://localhost:3001/clubs/loginClub`, { clubName, passkey }, { withCredentials: true });
            if (res.data.validLogin) {
                setClubAuthenticated(true);
                setClubDetails({ clubName: clubName });
                navigate("/club");
            } else {
                setFailedLogin(true);
            }
        } catch (error) {
            console.error("Error logging in to club: ", error);
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            handleLogin();
        }
    };

    return (
        <div className="club-login-container">
            <h2 className="club-login-header">Club Login</h2>
            <input
                className="input"
                type="text"
                value={clubName}
                placeholder="Enter Club Name"
                onChange={(e) => setClubName(e.target.value)}
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
            {/* make animation to create session page? */}
            {failedLogin && <div className="error-message">Could not find a club with those credentials!</div>}
            <button
                onClick={handleLogin}
                className="submit-button"
            >
                Enter Session
            </button>
            <div className="register-text">
                Club not registered? Click <Link to="/create-club">here</Link>!
            </div>
        </div>
    );
}
