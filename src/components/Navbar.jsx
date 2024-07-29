import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSessionAuth } from "../context/SessionAuthContext";
import "../styles/Navbar.css";

export default function Navbar() {
    const [click, setClick] = useState(false);
    const { sessionAuthenticated, adminAuthenticated, userAuthenticated, logout } = useSessionAuth();

    const handleClick = () => setClick(!click);
    const closeMobileMenu = () => setClick(false);
    const navigate = useNavigate();

    return (
        <nav className="navbar">
            <Link
                to="/"
                className="navbar-logo"
            >
                SIFT <i className="fab fa-typo3"></i>
            </Link>
            <div
                className="menu-icon"
                onClick={handleClick}
            >
                <i className={click ? "fas fa-times" : "fas fa-bars"} />
            </div>
            <ul className={click ? "nav-menu active" : "nav-menu"}>
                <li className="nav-item">
                    <Link
                        to="/"
                        className="nav-links"
                        onClick={closeMobileMenu}
                    >
                        Home
                    </Link>
                </li>
                {adminAuthenticated && (
                    <li className="nav-item">
                        <Link
                            to="/admin"
                            className="nav-links"
                            onClick={closeMobileMenu}
                        >
                            Admin
                        </Link>
                    </li>
                )}
                {adminAuthenticated && (
                    <li className="nav-item">
                        <Link
                            to="/upload"
                            className="nav-links"
                            onClick={closeMobileMenu}
                        >
                            Upload
                        </Link>
                    </li>
                )}
                {sessionAuthenticated && !userAuthenticated && (
                    <li className="nav-item">
                        <Link
                            to="/users"
                            className="nav-links"
                            onClick={closeMobileMenu}
                        >
                            Users
                        </Link>
                    </li>
                )}
                {sessionAuthenticated && (
                    <li className="nav-item">
                        <Link
                            to="/compare"
                            className="nav-links"
                            onClick={closeMobileMenu}
                        >
                            Compare
                        </Link>
                    </li>
                )}
                {sessionAuthenticated && (
                    <li className="nav-item">
                        <Link
                            to="/rankings"
                            className="nav-links"
                            onClick={closeMobileMenu}
                        >
                            Rankings
                        </Link>
                    </li>
                )}
                {sessionAuthenticated ? (
                    <li className="nav-item">
                        <Link
                            to="#"
                            className="nav-links"
                            onClick={() => {
                                logout();
                                setClick(false);
                                navigate("/login");
                            }}
                        >
                            Logout
                        </Link>
                    </li>
                ) : (
                    <li className="nav-item">
                        <Link
                            to="/login"
                            className="nav-links"
                            onClick={closeMobileMenu}
                        >
                            Login
                        </Link>
                    </li>
                )}
            </ul>
        </nav>
    );
}
