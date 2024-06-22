import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import Navbar from "./components/Navbar";
import ComparisonScreen from "./screens/ComparisonScreen";
import LoginScreen from "./screens/LoginScreen";
import RankingScreen from "./screens/RankingScreen";
import UploadScreen from "./screens/UploadScreen";

function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route
                    path="/login"
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
        </Router>
    );
}

export default App;
