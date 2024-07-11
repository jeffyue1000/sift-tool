import React, { useState, useCallback } from "react";
import { useSessionAuth } from "../context/SessionAuthContext";
import { useDropzone } from "react-dropzone";
import Screen from "../components/Screen";
import { faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import "../styles/UploadScreen.css";

export default function UploadScreen() {
    const [resumes, setResumes] = useState([]); //set of resumes to be uploaded
    const [submitted, setSubmitted] = useState(false); //check if resumes submitted
    const [numResumes, setNumResumes] = useState(0); //to display resume count for user
    const [resumeOverflow, setResumeOverflow] = useState(false);
    const { sessionDetails, setSessionDetails } = useSessionAuth();

    const onDrop = useCallback(
        (acceptedFiles) => {
            console.log("accepted files: ", acceptedFiles);
            console.log("resumes: ", resumes);
            let resumeArray = [...acceptedFiles, ...resumes];
            //uses map to eliminate duplicate resumes
            const resumeMap = new Map();
            resumeArray.forEach((resume) => {
                resumeMap.set(resume.name, resume);
            });
            const uniqueResumes = Array.from(resumeMap.values());
            console.log(uniqueResumes);
            setResumes(uniqueResumes);
            setNumResumes(uniqueResumes.length);
        },
        [resumes]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "application/pdf": [],
        },
        maxSize: 500000,
        maxFiles: 10000,
    });

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
        <Screen>
            {!resumeOverflow ? (
                <div className="upload-boxes-container">
                    <div className="upload-instruction-container">
                        <h2 className="instruction-header">Upload Resumes</h2>
                        <div className="upload-instruction">
                            Submit any resumes to be sifted to the dropzone on the right. You may drag and drop
                            individual files or select multiple to be submitted at once.
                            <br />
                            <p>
                                Files must be named in the following format:{" "}
                                <b>FirstName_LastName_Resume_GradYear.pdf</b>
                                <br />
                                <b>(e.g. Joe_Bruin_Resume_2026) </b>
                            </p>
                        </div>
                    </div>
                    <form
                        className="drop-box-container"
                        onSubmit={uploadResumes}
                    >
                        <div
                            className="drop-box"
                            {...getRootProps()}
                        >
                            <input {...getInputProps()} />
                            <FontAwesomeIcon
                                icon={faFilePdf}
                                className="large-icon"
                            />{" "}
                            Browse Files
                        </div>
                        <div className="submission-details">
                            Attached: {numResumes}
                            <br />
                            {`Remaining Resume Slots: ${
                                parseInt(sessionDetails.maxResumes) - parseInt(sessionDetails.resumeCount)
                            }`}
                        </div>
                        <button className="upload-button">Upload</button>
                        {submitted && <div>Uploaded Successfully!</div>}
                    </form>
                </div>
            ) : (
                <div>resumeoverflowplaceholder</div> //make a popup that tells user they have to many resumes
            )}
        </Screen>
    );
}
