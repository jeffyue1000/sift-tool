import React, { useState } from "react";
import axios from "axios";

export default function UploadScreen() {
    const [resumes, setResumes] = useState([]); //set of resumes to be uploaded
    const [submitted, setSubmitted] = useState(false); //check if resumes submitted
    const [numResumes, setNumResumes] = useState(0); //to display resume count for user
    const [sessionID, setSessionID] = useState("placeholderID"); //sessionID
    const [sessionDuration, setSessionDuration] = useState(2 * 7 * 24 * 60 * 60 * 1000); //time until document expires
    const [resume, setResume] = useState({
        sessionID: "placeholderID",
        name: "Jeff Yue",
        gradYear: "2026",
    });

    const onResumeChange = (event) => {
        let resumeArray = Array.from(event.target.files);
        resumeArray = [...resumeArray, ...resumes];

        //uses map to eliminate duplicate resumes
        const resumeMap = new Map();
        resumeArray.forEach((resume) => {
            resumeMap.set(resume.name, resume);
        });
        const uniqueResumes = Array.from(resumeMap.values());

        setResumes(uniqueResumes);
        setNumResumes(uniqueResumes.length);
    };

    const uploadResumes = async (event) => {
        //prepare resumes for upload
        try {
            event.preventDefault();

            const formData = new FormData();
            resumes.forEach((resume) => {
                formData.append("resumes", resume);
            });
            formData.append("sessionID", sessionID);
            formData.append("duration", sessionDuration);

            await axios.post(`http://localhost:3001/resumes/uploadResumes`, formData, {
                headers: {
                    "content-type": "multipart/form-data",
                },
            });
            setSubmitted(true);
        } catch (error) {
            console.error("Error uploading resume", error);
        }
    };
    return (
        <div>
            <h2>Upload Resumes Here</h2>
            <div>Resumes Submitted: {numResumes}</div>
            <form onSubmit={uploadResumes}>
                <input
                    type="file"
                    accept="application/pdf"
                    multiple
                    onChange={onResumeChange}
                />
                <button type="submit">Upload</button>
            </form>
            {submitted && <div>Uploaded Successfully!</div>}
        </div>
    );
}
