import React, { useState } from "react";
import { useSessionAuth } from "../context/SessionAuthContext";
import axios from "axios";
import "../styles/UploadScreen.css";

export default function UploadScreen() {
    const [resumes, setResumes] = useState([]); //set of resumes to be uploaded
    const [submitted, setSubmitted] = useState(false); //check if resumes submitted
    const [numResumes, setNumResumes] = useState(0); //to display resume count for user
    const [resumeOverflow, setResumeOverflow] = useState(false);
    const { sessionDetails, setSessionDetails } = useSessionAuth();

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
            const hasCapacityRes = await axios.get(`http://localhost:3001/sessions/hasResumeCapacity`, {
                params: {
                    numResumes: numResumes,
                    sessionID: sessionDetails.sessionID,
                },
            }); //check if session has space to upload

            if (hasCapacityRes.data.resumeOverflow) {
                setResumeOverflow(true);
                return;
            }

            const formData = new FormData(); //create FormData object for backend to handle pdfs
            resumes.forEach((resume) => {
                formData.append("resumes", resume);
            });
            formData.append("sessionID", sessionDetails.sessionID);
            formData.append("duration", sessionDetails.duration * 7 * 24 * 60 * 60 * 1000); //duration in weeks expressed in ms

            await axios.post(`http://localhost:3001/resumes/uploadResumes`, formData, {
                //upload pdfs to aws and mongo
                headers: {
                    "content-type": "multipart/form-data",
                },
            });
            const updateSizeRes = await axios.post(`http://localhost:3001/sessions/updateSessionSize`, {
                sessionID: sessionDetails.sessionID,
            }); //update resume count for the current session
            setSessionDetails({ ...sessionDetails, resumeCount: updateSizeRes.data.resumeCount });
            setSubmitted(true);
        } catch (error) {
            console.error("Error uploading resume", error);
        }
    };

    return (
        <div>
            {!resumeOverflow ? (
                <div className="upload-container">
                    <h2>Upload Resumes Here</h2>

                    <h4 className="upload-instruction">
                        Files must be named in the following format: FirstName_LastName_Resume_GradYear.pdf
                    </h4>
                    <div>Resumes Submitted: {numResumes}</div>
                    <form onSubmit={uploadResumes}>
                        <input
                            type="file"
                            accept="application/pdf"
                            multiple
                            onChange={onResumeChange}
                        />
                        <button className="submit-button">Upload</button>
                    </form>
                    {submitted && <div>Uploaded Successfully!</div>}
                </div>
            ) : (
                <div>resumeoverflowplaceholder</div> //make a popup that tells user they have to many resumes
            )}
        </div>
    );
}
