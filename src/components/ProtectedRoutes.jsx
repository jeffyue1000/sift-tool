import React from "react";
import { useSessionAuth } from "../context/SessionAuthContext";
import { Navigate } from "react-router-dom";

export function SessionProtectedRoute({ component }) {
    const { sessionAuthenticated, userAuthenticated } = useSessionAuth();
    return sessionAuthenticated ? !userAuthenticated ? <Navigate to="/users" /> : component : <Navigate to="/login" />;
}

export function AdminProtectedRoute({ component }) {
    const { sessionAuthenticated, adminAuthenticated, userAuthenticated } = useSessionAuth();
    return sessionAuthenticated && adminAuthenticated ? (
        !userAuthenticated ? (
            <Navigate to="/users" />
        ) : (
            component
        )
    ) : (
        <Navigate to="/rankings" />
    );
}

export function LoginRedirect({ component }) {
    const { sessionAuthenticated, userAuthenticated } = useSessionAuth();
    return sessionAuthenticated ? (
        !userAuthenticated ? (
            <Navigate to="/users" />
        ) : (
            <Navigate to="/compare" />
        )
    ) : (
        component
    );
}

export function UserProtectedRoute({ component }) {
    const { sessionAuthenticated, userAuthenticated } = useSessionAuth();
    return sessionAuthenticated ? (
        userAuthenticated ? (
            <Navigate to="/rankings" />
        ) : (
            component
        )
    ) : (
        <Navigate to="/login" />
    );
}
