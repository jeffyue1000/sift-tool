import { React, useState, useEffect, createContext, useContext } from "react";
import axios from "axios";

export const SessionAuthContext = createContext();

export const useSessionAuth = () => useContext(SessionAuthContext);

export function SessionAuthProvider({ children }) {
    const [sessionAuthenticated, setSessionAuthenticated] = useState(false);
    const [adminAuthenticated, setAdminAuthenticated] = useState(false);
    const [userAuthenticated, setUserAuthenticated] = useState(false);
    const [sessionDetails, setSessionDetails] = useState({
        sessionID: "defaultID",
        duration: 1, //expire immediately if invalid session
        resumeCount: 0,
        maxResumes: 100,
        totalComparisons: 0,
        useReject: false,
        usePush: false,
        requireAdminReject: true,
        requireAdminPush: true,
        rejectQuota: 1,
        pushQuota: 1,
        useTimer: false,
        compareTimer: 3,
        user: "",
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        verifySession();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const verifySession = async () => {
        try {
            const res = await axios.get("http://localhost:3001/sessions/getCookies", {
                withCredentials: true,
            });
            const sessionCookieToken = res.data.sessionCookieToken;
            const userCookieToken = res.data.userCookieToken;
            if (sessionCookieToken) {
                const res = await axios.get("http://localhost:3001/sessions/getSessionFromToken", {
                    params: { encodedSessionToken: sessionCookieToken },
                });
                if (res.data.valid) {
                    setSessionAuthenticated(true);
                    if (res.data.isAdmin) {
                        setAdminAuthenticated(true);
                    }
                    const session = res.data.session;
                    setSessionDetails({
                        sessionID: session.sessionID,
                        duration: session.duration,
                        resumeCount: session.resumeCount,
                        maxResumes: session.maxResumes,
                        totalComparisons: session.totalComparisons,
                        useReject: session.useReject,
                        usePush: session.usePush,
                        rejectRequireAdmin: session.rejectRequireAdmin,
                        pushRequireAdmin: session.pushRequireAdmin,
                        rejectQuota: session.rejectQuota,
                        pushQuota: session.pushQuota,
                        useTimer: session.useTimer,
                        compareTimer: session.compareTimer,
                    });

                    if (userCookieToken) {
                        const userRes = await axios.get(`http://localhost:3001/sessions/getUserFromToken`, {
                            params: { encodedUsertoken: userCookieToken },
                        });
                        setSessionDetails({ ...sessionDetails, user: userRes.data.user });
                    }
                }
            } else {
                setSessionAuthenticated(false);
                setAdminAuthenticated(false);
                setUserAuthenticated(false);
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
            setUserAuthenticated(false);
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

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
                userAuthenticated,
                setUserAuthenticated,
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
