import React from "react";
import Screen from "../components/Screen";
import { useSessionAuth } from "../context/SessionAuthContext";
import axios from "axios";
import "../styles/ClubScreen.css";

export default function ClubScreen() {
    const { clubDetails } = useSessionAuth();

    return (
        <Screen>
            <div className="club-container">
                <h2>{clubDetails.clubName}'s Dashboard</h2>
                <div className="club-details">
                    <div>Available Resume Slots: {clubDetails.sessionBudget}</div>
                </div>
            </div>
        </Screen>
    );
}
