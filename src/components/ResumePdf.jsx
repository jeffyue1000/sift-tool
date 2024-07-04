import { React } from "react";

export default function ResumePDF({ onClick, resumeURL }) {
    return (
        <object
            onClick={onClick}
            data={resumeURL}
            type="applcation/pdf"
            height="80%"
            width="80%"
        />
    );
}
