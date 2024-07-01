import React from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";

export default function Navbar() {
    return (
        <nav className="navbar">
            <ul className="navbar-list">
                <li className="navbar-item">
                    <Link to="/login">Session Login</Link>
                </li>
                <li className="navbar-item">
                    <Link to="/compare">Compare Resumes</Link>
                </li>
                <li className="navbar-item">
                    <Link to="/rankings">Resume Rankings</Link>
                </li>
                <li className="navbar-item">
                    <Link to="/upload">Upload Resumes</Link>
                </li>
                <li className="navbar-item">
                    <Link to="/createsession">Create a Session</Link>
                </li>
            </ul>
        </nav>
    );
}
