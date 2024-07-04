import React from "react";
import { useSessionAuth } from "../context/SessionAuthContext";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ component }) {
    const { sessionAuthenticated } = useSessionAuth();
    return sessionAuthenticated ? component : <Navigate to="/login" />;
}
