import { React, useState } from "react";

export default function SessionConfig({ onSubmit }) {
    const [maxResumes, setMaxResumes] = useState(1);
    const [sessionDuration, setSessionDuration] = useState(1);

    const handleConfigSubmit = () => {
        onSubmit(maxResumes, sessionDuration);
    };
    return (
        <div>
            <h2>Configure Session</h2>
            {/* should make button non-clickable until all are filled */}
            <div>Number of resumes to sift:</div>
            <input
                type="number"
                min="1"
                step="10"
                value={maxResumes}
                onChange={(e) => setMaxResumes(e.target.value)}
            />
            <div>Session duration in weeks:</div>
            <input
                type="number"
                min="1"
                value={sessionDuration}
                onChange={(e) => setSessionDuration(e.target.value)}
            />
            {/* make animation to create session page? */}
            <button onClick={handleConfigSubmit}>Continue</button>
        </div>
    );
}
