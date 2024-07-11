import React from "react";
import "../styles/WelcomeScreen.css";
import { Link, useNavigate } from "react-router-dom";

export default function WelcomeScreen() {
    return (
        <div className="welcome-container">
            <div className="welcome-content">
                {/* <h2 className="welcome-description">Introducing</h2> */}
                <h1 className="welcome-title">SIFT</h1>
                <h2 className="welcome-subtitle">
                    Collaborative Resume Review Tool
                </h2>
                <p className="welcome-instructions"></p>
                <div className="instructions-wrapper">
                    {/* <div className="welcome-instructions-container">
                        <p className="welcome-instructions">
                            How to get started:
                        </p>
                        <ol className="instruction-list">
                            <li className="welcome-instruction-item">
                                Create your group's unique session key &
                                password
                            </li>
                            <li className="welcome-instruction-item">
                                Complete the payment process through Stripe to
                                activate your session
                            </li>
                            <li className="welcome-instruction-item">
                                Share the session key with your group and start
                                sifting!
                            </li>
                        </ol>
                    </div> */}
                    <div className="sift-instructions-container">
                        <p className="sift-instructions">
                            Sifting Instructions
                        </p>
                        <ol className="instruction-list">
                            <li className="sift-instruction-item">
                                Login: Enter your session key to join your
                                group's sifting session or create your group's
                                unique session
                            </li>
                            <li className="sift-instruction-item">
                                Upload: Upload resumes in PDF format. Once you
                                upload a resume, you cannot remove it from your
                                session.{" "}
                            </li>
                            <li className="sift-instruction-item">
                                Compare: You will be presented with two resumes
                                at a time. Click on the resume you believe is
                                stronger. Repeat this process.{" "}
                            </li>
                            <li className="sift-instruction-item">
                                Rankings: View your group resume rankings. The
                                more comparisons you make, the more accurate the
                                overall ranking will be.{" "}
                            </li>
                        </ol>
                        <Link
                            to="/login"
                            className="start-button-link"
                        >
                            <button className="start-button">
                                Get Started
                            </button>
                        </Link>
                    </div>
                </div>
                {/* <p className="faq-header">Frequently Asked Questions:</p>
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
                </ul> */}
            </div>
            <footer>© 2024 Sift. All rights reserved.</footer>
        </div>
    );
}
