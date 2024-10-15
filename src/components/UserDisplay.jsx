import React, { useState, useEffect } from "react";
import { useSessionAuth } from "../context/SessionAuthContext";
import User from "./User";
import axios from "axios";
import "../styles/UserDisplay.css";

export default function UserDisplay() {
    //user comparison count box for admin setting screen
    const [users, setUsers] = useState([]);
    const { sessionDetails } = useSessionAuth();

    useEffect(() => {
        getUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getUsers = async () => {
        try {
            const res = await axios.get(`http://localhost:3001/sessions/getUsers`, {
                params: { sessionID: sessionDetails.sessionID },
            });
            if (res.data.getSuccess) {
                const userMap = res.data.users;
                const userArray = Object.entries(userMap);
                setUsers(userArray);
            }
        } catch (error) {
            console.error("Error getting users: ", error);
        }
    };

    return (
        <div className="users-box">
            {users.map(([user, comparisons], index) => (
                <User
                    key={index}
                    name={user}
                    numComparisons={comparisons}
                />
            ))}
        </div>
    );
}
