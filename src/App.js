import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import Navbar from "./components/Navbar";
import ComparisonScreen from "./screens/ComparisonScreen";
import LoginScreen from "./screens/LoginScreen";
import RankingScreen from "./screens/RankingScreen";
import UploadScreen from "./screens/UploadScreen";
import "./App.css"; // Make sure you have an App.css file with the styles defined below

function App() {
    return (
        <Router>
            <Navbar />
            <div className="content-container">
                <Routes>
                    <Route
                        path="/"
                        element={<LoginScreen />}
                    />
                    <Route
                        path="/compare"
                        element={<ComparisonScreen />}
                    />
                    <Route
                        path="/rankings"
                        element={<RankingScreen />}
                    />
                    <Route
                        path="/upload"
                        element={<UploadScreen />}
                    />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
