import React from "react";
import { useSessionAuth } from "../context/SessionAuthContext";
import { Navigate } from "react-router-dom";

export function SessionProtectedRoute({ component }) {
    const { sessionAuthenticated } = useSessionAuth();
    return sessionAuthenticated ? component : <Navigate to="/login" />;
}

export function AdminProtectedRoute({ component }) {
    const { sessionAuthenticated, adminAuthenticated } = useSessionAuth();
    return sessionAuthenticated && adminAuthenticated ? component : <Navigate to="/rankings" />;
}

export function LoginRedirect({ component }) {
    const { sessionAuthenticated } = useSessionAuth();
    return sessionAuthenticated ? <Navigate to="/compare" /> : component;
}
