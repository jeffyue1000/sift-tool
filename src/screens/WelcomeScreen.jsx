import React from "react";
import "../styles/WelcomeScreen.css";

export default function WelcomeScreen() {
    return (
        <div className="welcome-container">
            <div className="welcome-content">
                <h1 className="welcome-title">Welcome to Sift!</h1>
                <h2 className="welcome-subtitle">
                    Collaborative Resume Review and Ranking Tool
                </h2>
                <p className="welcome-instructions"></p>
                <p className="welcome-description">
                    Sift enables groups to efficiently review resumes and
                    automatically generate a comprehensive ranking
                </p>
                <p className="welcome-instructions">How to get started:</p>
                <ol className="instruction-list">
                    <li className="welcome-instruction-item">
                        Create your group's unique session key & password
                    </li>
                    <li className="welcome-instruction-item">
                        Complete the payment process through Stripe to activate
                        your session
                    </li>
                    <li className="welcome-instruction-item">
                        Share the session key with your group and you are ready
                        to start sifting!
                    </li>
                </ol>
                <p className="sift-instructions">Page-by-Page Instructions:</p>
                <ol className="instruction-list">
                    <li className="sift-instruction-item">
                        Session Login: Enter your session key to join your
                        group's sifting session.
                    </li>
                    <li className="sift-instruction-item">
                        Upload Resumes: Upload resumes with the following naming
                        convention: FirstName_LastName_Resume_GradYear.pdf. Once
                        you upload a resume, you will not be able to remove it
                        from your session.{" "}
                    </li>
                    <li className="sift-instruction-item">
                        Compare Resumes: You will be presented with two resumes
                        at a time. Click on the resume you believe is stronger.
                        This will bring up the next pair of resumes. Repeat this
                        process.{" "}
                    </li>
                    <li className="sift-instruction-item">
                        Resume Rankings: Here you will be able to view your
                        session's aggregated resume rankings. The more
                        comparisons you make, the more accurate the overall
                        ranking will be.{" "}
                    </li>
                </ol>
                <p className="faq-header">Frequently Asked Questions:</p>
                <ul className="faq-list">
                    <li className="faq-item">
                        <h3 className="faq-question">placeholder question</h3>
                        <p className="faq-answer">placeholder answer</p>
                    </li>
                    <li className="faq-item">
                        <h3 className="faq-question">placeholder question</h3>
                        <p className="faq-answer">placeholder answer</p>
                    </li>
                    <li className="faq-item">
                        <h3 className="faq-question">placeholder question</h3>
                        <p className="faq-answer">placeholder answer</p>
                    </li>
                    <li className="faq-item">
                        <h3 className="faq-question">placeholder question</h3>
                        <p className="faq-answer">placeholder answer</p>
                    </li>
                </ul>
            </div>
            <footer>© 2024 Sift. All rights reserved.</footer>
        </div>
    );
}
