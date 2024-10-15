import { React, useState } from "react";
import "../styles/SessionConfig.css";

export default function SessionConfig({ onSubmit }) {
    //set session details component
    const [maxResumes, setMaxResumes] = useState(1);
    const [sessionDuration, setSessionDuration] = useState(1);

    const handleConfigSubmit = () => {
        onSubmit(maxResumes, sessionDuration);
    };

    return (
        <div>
            <h2 className="config-header">Configure Session</h2>
            {/* should make button non-clickable until all are filled */}
            <div className="prompt">Number of resumes to sift:</div>
            <input
                className="input-field"
                type="number"
                min="1"
                step="10"
                value={maxResumes}
                onChange={(e) => setMaxResumes(e.target.value)}
            />
            <div className="prompt">Session duration in weeks:</div>
            <input
                className="input-field"
                type="number"
                min="1"
                value={sessionDuration}
                onChange={(e) => setSessionDuration(e.target.value)}
            />
            {/* make animation to create session page? */}
            <button
                onClick={handleConfigSubmit}
                className="submit-button"
            >
                Continue
            </button>
        </div>
    );
}
