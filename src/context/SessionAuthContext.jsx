import { React, useState, useEffect, createContext, useContext } from "react";
import Cookies from "js-cookie";
import axios from "axios";

export const SessionAuthContext = createContext();

export const useSessionAuth = () => useContext(SessionAuthContext);

export function SessionAuthProvider({ children }) {
    const [sessionAuthenticated, setSessionAuthenticated] = useState(false);
    const [adminAuthenticated, setAdminAuthenticated] = useState(false);
    const [sessionDetails, setSessionDetails] = useState({
        sessionID: "defaultID",
        duration: 1, //expire immediately if invalid session
    });
    const [loading, setLoading] = useState(true);

    const verifySession = async () => {
        try {
            const sessionIdToken = Cookies.get("sessionID");
            if (sessionIdToken) {
                const res = await axios.get("http://localhost:3001/sessions/getSessionFromToken", {
                    params: { encodedSessionToken: sessionIdToken },
                });
                if (res.data.valid) {
                    setSessionAuthenticated(true);
                    setSessionDetails({ sessionID: res.data.session.sessionID, duration: res.data.session.duration });
                }
            }
        } catch (error) {
            console.error("Error verifying session", error);
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await axios.get("http://localhost:3001/sessions/logoutSession");
            setSessionAuthenticated(false);
            setAdminAuthenticated(false);
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
        <SessionAuthContext.Provider
            value={{
                sessionAuthenticated,
                setSessionAuthenticated,
                adminAuthenticated,
                setAdminAuthenticated,
                sessionDetails,
                setSessionDetails,
                logout,
            }}
        >
            {children}
        </SessionAuthContext.Provider>
    );
}
