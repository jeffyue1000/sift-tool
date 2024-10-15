import { React, useState, useEffect, createContext, useContext } from "react";
import axios from "axios";

export const SessionAuthContext = createContext();

export const useSessionAuth = () => useContext(SessionAuthContext);

export function SessionAuthProvider({ children }) {
    //session context manager to maintain user login/authentication states
    const [sessionAuthenticated, setSessionAuthenticated] = useState(false); //logged into session
    const [adminAuthenticated, setAdminAuthenticated] = useState(false); //entered correct admin key
    const [userAuthenticated, setUserAuthenticated] = useState(false); //selected a user
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
        compareTimer: 1,
        user: "",
        updateAmount: 10,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        verifySession();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const verifySession = async () => {
        try {
            //check for session and user authentication through stored browser cookies
            const res = await axios.get("http://localhost:3001/sessions/getCookies", {
                withCredentials: true,
            });
            const sessionCookieToken = res.data.sessionCookieToken;
            const userCookieToken = res.data.userCookieToken;

            //if user is logged into a session, proceed
            if (sessionCookieToken) {
                //decode session token from cookie
                const res = await axios.get("http://localhost:3001/sessions/getSessionFromToken", {
                    params: { encodedSessionToken: sessionCookieToken },
                });

                //proceed and update session state if session exists
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
                        rejectQuota: session.rejectQuota * -1,
                        pushQuota: session.pushQuota,
                        useTimer: session.useTimer,
                        compareTimer: session.compareTimer,
                        updateAmount: session.updateAmount,
                    });

                    //if user has been selected, update session state to track that user
                    if (userCookieToken) {
                        const userRes = await axios.get(`http://localhost:3001/sessions/getUserFromToken`, {
                            params: { encodedUserToken: userCookieToken },
                        });
                        setUserAuthenticated(true);
                        setSessionDetails((prevSessionDetails) => ({
                            ...prevSessionDetails,
                            user: userRes.data.user,
                        }));
                    }
                }
            } else {
                //if cookie not found, set all auth to false
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
