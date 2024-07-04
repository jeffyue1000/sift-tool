import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import Navbar from "./components/Navbar";
import ComparisonScreen from "./screens/ComparisonScreen";
import LoginScreen from "./screens/LoginScreen";
import RankingScreen from "./screens/RankingScreen";
import UploadScreen from "./screens/UploadScreen";
import CreateSessionScreen from "./screens/CreateSessionScreen";
import { SessionAuthProvider } from "./context/SessionAuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./components/NotFound";
import WelcomeScreen from "./screens/WelcomeScreen";
import "./App.css";

function App() {
    return (
        <SessionAuthProvider>
            <Router>
                <Navbar />
                <Routes>
                    <Route
                        path="/"
                        element={<WelcomeScreen />}
                    />
                    <Route
                        path="/login"
                        element={<LoginScreen />}
                    />
                    <Route
                        path="/compare"
                        element={<ProtectedRoute component={<ComparisonScreen />} />}
                    />
                    <Route
                        path="/rankings"
                        element={<ProtectedRoute component={<RankingScreen />} />}
                    />
                    <Route
                        path="/upload"
                        element={<ProtectedRoute component={<UploadScreen />} />}
                    />
                    <Route
                        path="/createsession"
                        element={<CreateSessionScreen />}
                    />
                    <Route
                        path="*"
                        element={<NotFound />}
                    />
                </Routes>
            </Router>
        </SessionAuthProvider>
    );
}

export default App;
