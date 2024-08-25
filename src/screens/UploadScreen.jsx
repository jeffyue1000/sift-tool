import React, { useState, useCallback, useEffect } from "react";
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
    const [loading, setLoading] = useState(false);
    const [loadingText, setLoadingText] = useState("");
    const { sessionDetails, setSessionDetails } = useSessionAuth();

    useEffect(() => {
        const loadingStates = ["Loading", "Loading.", "Loading..", "Loading..."];
        let index = 0;

        const loadingInterval = setInterval(() => {
            index = (index + 1) % loadingStates.length;
            setLoadingText(loadingStates[index]);
        }, 500);

        return () => clearInterval(loadingInterval);
    }, []);

    const onDrop = useCallback(
        (acceptedFiles) => {
            let resumeArray = [...acceptedFiles, ...resumes];
            //uses map to eliminate duplicate resumes
            const resumeMap = new Map();
            resumeArray.forEach((resume) => {
                resumeMap.set(resume.name, resume);
            });
            const uniqueResumes = Array.from(resumeMap.values());
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
            if (numResumes == 0) {
                alert("Add more resumes before uploading!");
                return;
            }
            setSubmitted(false);
            event.preventDefault();
            setLoading(true);

            if (sessionDetails.maxResumes - sessionDetails.resumeCount < numResumes) {
                alert("Not enough capacity! Try uploading fewer resumes.");
                setLoading(false);
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
            setLoading(false);
            setSubmitted(true);
            setResumes([]);
            setNumResumes(0);
        } catch (error) {
            console.error("Error uploading resume", error);
        }
    };

    const handleClearResumes = () => {
        setResumes([]);
        setNumResumes(0);
        setSubmitted(false);
    };

    return (
        <Screen>
            <div className="upload-boxes-container">
                <div className="upload-instruction-container">
                    <h2 className="instruction-header">Upload Resumes</h2>
                    <div className="upload-instruction">
                        Submit any resumes to be sifted to the dropzone on the right. You may drag and drop individual
                        files or select multiple to be submitted at once.
                        <br />
                        <p>
                            Files must be named in the following format: <b>FirstName_LastName_Resume_GradYear.pdf</b>
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
                        />
                        {isDragActive ? <p>Drop Resume...</p> : <div>Browse Files</div>}
                    </div>
                    <div className="submission-details">
                        Attached: {numResumes}
                        <br />
                        {`Remaining Resume Slots: ${
                            parseInt(sessionDetails.maxResumes) - parseInt(sessionDetails.resumeCount)
                        }`}
                    </div>
                    <div className="upload-buttons-container">
                        <button
                            className="upload-button"
                            onClick={handleClearResumes}
                            type="button"
                        >
                            Clear
                        </button>
                        <button
                            className="upload-button"
                            type="submit"
                        >
                            Upload
                        </button>
                    </div>
                    <div className="popup-text">
                        {loading && <div>{loadingText}</div>}
                        {submitted && <div>Uploaded Successfully!</div>}
                    </div>
                </form>
            </div>
        </Screen>
    );
}
