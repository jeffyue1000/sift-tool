import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSessionAuth } from "../context/SessionAuthContext";
import "../styles/Navbar.css";

export default function Navbar() {
    const [click, setClick] = useState(false);
    const { sessionAuthenticated, adminAuthenticated, logout } = useSessionAuth();
    // const [button, setButton] = useState(true);

    const handleClick = () => setClick(!click);
    const closeMobileMenu = () => setClick(false);

    // const showButton = () => {
    //     if (window.innerWidth <= 960) {
    //         setButton(false);
    //     } else {
    //         setButton(true);
    //     }
    // };

    // window.addEventListener("resize", showButton);

    return (
        <nav className="navbar">
            <div className="navbar-container">
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
                                to="/upload"
                                className="nav-links"
                                onClick={closeMobileMenu}
                            >
                                Upload
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
                                to="/login"
                                className="nav-links"
                                onClick={() => {
                                    logout();
                                    setClick(false);
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
            </div>
        </nav>
    );
}
