import { React, useState, useEffect, createContext, useContext } from "react";
import axios from "axios";

export const SessionAuthContext = createContext();

export const useSessionAuth = () => useContext(SessionAuthContext);

export function SessionAuthProvider({ children }) {
    const [sessionAuthenticated, setSessionAuthenticated] = useState(false);
    const [adminAuthenticated, setAdminAuthenticated] = useState(false);
    const [sessionDetails, setSessionDetails] = useState({
        sessionID: "defaultID",
        duration: 1, //expire immediately if invalid session
        resumeCount: 0,
    });
    const [loading, setLoading] = useState(true);

    const verifySession = async () => {
        try {
            const res = await axios.get("http://localhost:3001/sessions/getCookie", {
                withCredentials: true,
            });
            const cookieToken = res.data.cookieToken;
            if (cookieToken) {
                const res = await axios.get("http://localhost:3001/sessions/getSessionFromToken", {
                    params: { encodedSessionToken: cookieToken },
                });
                if (res.data.valid) {
                    setSessionAuthenticated(true);
                    if (res.data.isAdmin) {
                        setAdminAuthenticated(true);
                    }
                    setSessionDetails({
                        sessionID: res.data.session.sessionID,
                        duration: res.data.session.duration,
                        resumeCount: res.data.session.resumeCount,
                        maxResumes: res.data.session.maxResumes,
                        totalComparisons: res.data.session.totalComparisons,
                    });
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
            await axios.get("http://localhost:3001/sessions/logoutSession", {
                withCredentials: true,
            });
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
                verifySession,
            }}
        >
            {children}
        </SessionAuthContext.Provider>
    );
}
