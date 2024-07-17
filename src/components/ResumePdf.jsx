import { React } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import "../styles/ResumePdf.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function ResumePDF({ onClick, resumeURL, disabled }) {
    return (
        <div className={`resume-container ${disabled ? "disabled" : ""} `}>
            <Document
                onClick={!disabled ? onClick : null}
                file={resumeURL}
            >
                <Page
                    pageNumber={1}
                    scale={1.02}
                />
            </Document>
        </div>
    );
}
