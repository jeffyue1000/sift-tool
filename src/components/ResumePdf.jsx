import { React } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function ResumePDF({ onClick, resumeURL }) {
    return (
        <div onClick={onClick}>
            <Document file={resumeURL}>
                <Page pageNumber={1} />
            </Document>
        </div>
    );
}
