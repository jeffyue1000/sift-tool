import { React, useState, useEffect, createContext, useContext } from "react";
import Cookies from "js-cookie";
import axios from "axios";

export const SessionAuthContext = createContext();

export const useSessionAuth = () => useContext(SessionAuthContext);

export function SessionAuthProvider({ children }) {
    const [sessionAuthenticated, setSessionAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    const verifySession = async () => {
        try {
            const sessionIdToken = Cookies.get("sessionID");
            if (sessionIdToken) {
                const res = await axios.get("http://localhost:3001/sessions/checkSessionToken", {
                    params: { sessionIdToken },
                });
                if (res.data.valid) {
                    setSessionAuthenticated(true);
                }
            }
        } catch (error) {
            console.error("Error verifying session", error);
        } finally {
            setLoading(false);
        }
    };

    const login = async (loginCredentials) => {
        try {
            const res = await axios.post("http://localhost:3001/sessions/loginSession", loginCredentials, {
                withCredentials: true,
            });
            if (res.data.validLogin) {
                setSessionAuthenticated(true);
                return true;
            }
        } catch (error) {
            console.log("Error signing in to session", error);
        }
        return false;
    };

    const logout = async () => {
        try {
            const res = await axios.get("http://localhost:3001/sessions/logoutSession");
            setSessionAuthenticated(false);
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    useEffect(() => {
        verifySession();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <SessionAuthContext.Provider value={{ sessionAuthenticated, login, logout }}>
            {children}
        </SessionAuthContext.Provider>
    );
}
