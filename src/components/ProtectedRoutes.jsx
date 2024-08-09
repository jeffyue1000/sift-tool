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
    const { sessionAuthenticated, clubAuthenticated } = useSessionAuth();
    if ((clubAuthenticated && sessionAuthenticated) || sessionAuthenticated) {
        return <Navigate to="/compare" />;
    } else if (clubAuthenticated) {
        return <Navigate to="/club" />;
    }
    return component;
}

export function UserProtectedRoute({ component }) {
    const { sessionAuthenticated, userAuthenticated } = useSessionAuth();
    return sessionAuthenticated ? userAuthenticated ? <Navigate to="/rankings" /> : component : <Navigate to="/login" />;
}

export function ClubProtectedRoute({ component }) {
    const { clubAuthenticated } = useSessionAuth();
    return clubAuthenticated ? component : <Navigate to="/login" />;
}
