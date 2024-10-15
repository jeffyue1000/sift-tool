import React from "react";
import { useSessionAuth } from "../context/SessionAuthContext";
import { Navigate } from "react-router-dom";

export function SessionProtectedRoute({ component }) {
    //protects screens that are only visible upon session login + user selected
    const { sessionAuthenticated, userAuthenticated } = useSessionAuth();
    return sessionAuthenticated ? !userAuthenticated ? <Navigate to="/users" /> : component : <Navigate to="/login" />;
}

export function AdminProtectedRoute({ component }) {
    //protects screens that are only visible upon session login + user selected + admin authenticated
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
    //properly redirects users from login screen if already authenticated
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
    //properly redirects users from user screen if already authenticated
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
