import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/CreateClubScreen.css";

export default function CreateClubScreen() {
    const [clubName, setClubName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordsMatch, setPasswordsMatch] = useState(true);
    const [failedCreate, setFailedCreate] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (confirmPassword !== "" && confirmPassword !== password) {
            setPasswordsMatch(false);
        } else {
            setPasswordsMatch(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [confirmPassword, password]);

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            handleCreate();
        }
    };

    const handleCreate = async () => {
        try {
            const res = await axios.post(
                `http://localhost:3001/clubs/createClub`,
                { name: clubName, password: password },
                { withCredentials: true }
            );
            if (res.data.clubExists) {
                setFailedCreate(true);
                return;
            }
            navigate("");
        } catch (error) {
            console.error("Error creating new club: ", error);
        }
    };
    return (
        <div className="main-container">
            <div className="tabs">
                <button className="create-club-tag">Create Club</button>
            </div>
            <div className="club-create-content">
                <div className="club-create-container">
                    <h2 className="create-header">Create New Club</h2>
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
                        value={password}
                        placeholder="Enter Password"
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <input
                        className="input"
                        type="password"
                        value={confirmPassword}
                        placeholder="Confirm Password"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <div className="popup-text">
                        {!passwordsMatch && <div className="error-message">Passwords do not match!</div>}
                        {failedCreate && <div className="error-message">Club with that name already exists!</div>}
                    </div>
                    <button
                        onClick={handleCreate}
                        className="submit-button"
                    >
                        Create
                    </button>
                </div>
            </div>
        </div>
    );
}
