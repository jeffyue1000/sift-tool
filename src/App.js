import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import Navbar from "./components/Navbar";
import ComparisonScreen from "./screens/ComparisonScreen";
import LoginScreen from "./screens/LoginScreen";
import RankingScreen from "./screens/RankingScreen";
import UploadScreen from "./screens/UploadScreen";
import AdminSettingsScreen from "./screens/AdminSettingsScreen";
import SelectUserScreen from "./screens/SelectUserScreen";
import { SessionAuthProvider } from "./context/SessionAuthContext";
import {
    SessionProtectedRoute,
    AdminProtectedRoute,
    UserProtectedRoute,
    LoginRedirect,
} from "./components/ProtectedRoutes";
import NotFound from "./components/NotFound";
import { Navigate } from "react-router-dom";
import "./App.css";

function App() {
    return (
        <SessionAuthProvider>
            <Router>
                <Navbar />
                <Routes>
                    <Route
                        path="/"
                        element={<Navigate to="/login" />}
                    />
                    <Route
                        path="/login"
                        element={<LoginRedirect component={<LoginScreen />} />}
                    />

                    <Route
                        path="/rankings"
                        element={
                            <AdminProtectedRoute
                                component={<RankingScreen />}
                            />
                        }
                    />
                    <Route
                        path="/compare"
                        element={
                            <SessionProtectedRoute
                                component={<ComparisonScreen />}
                            />
                        }
                    />
                    <Route
                        path="/users"
                        element={
                            <UserProtectedRoute
                                component={<SelectUserScreen />}
                            />
                        }
                    />
                    <Route
                        path="/admin"
                        element={
                            <AdminProtectedRoute
                                component={<AdminSettingsScreen />}
                            />
                        }
                    />
                    <Route
                        path="/upload"
                        element={
                            <AdminProtectedRoute component={<UploadScreen />} />
                        }
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
