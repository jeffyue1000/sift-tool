import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import Navbar from "./components/Navbar";
import ComparisonScreen from "./screens/ComparisonScreen";
import LoginScreen from "./screens/LoginScreen";
import RankingScreen from "./screens/RankingScreen";
import UploadScreen from "./screens/UploadScreen";
import CreateSessionScreen from "./screens/CreateSessionScreen";
import { SessionAuthProvider } from "./context/SessionAuthContext";
import { SessionProtectedRoute, AdminProtectedRoute, LoginRedirect } from "./components/ProtectedRoutes";
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
                        element={<LoginRedirect component={<LoginScreen />} />}
                    />
                    <Route
                        path="/compare"
                        element={<SessionProtectedRoute component={<ComparisonScreen />} />}
                    />
                    <Route
                        path="/rankings"
                        element={<SessionProtectedRoute component={<RankingScreen />} />}
                    />
                    <Route
                        path="/upload"
                        element={<AdminProtectedRoute component={<UploadScreen />} />}
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
