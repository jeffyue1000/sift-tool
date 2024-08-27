import React, { useState, useEffect } from "react";
import Screen from "../components/Screen";
import { useNavigate } from "react-router-dom";
import { useSessionAuth } from "../context/SessionAuthContext";
import axios from "axios";
import "../styles/SelectUserScreen.css";

export default function SelectUserScreen() {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState("");
    const [selectUserDisabled, setSelectUserDisabled] = useState(true);
    const [newUser, setNewUser] = useState("");
    const [showAddUser, setShowAddUser] = useState(false);
    const { sessionDetails, setSessionDetails, setUserAuthenticated } =
        useSessionAuth();

    const navigate = useNavigate();

    useEffect(() => {
        getUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSelectUserKeyDown = (event) => {
        if (event.key === "Enter") {
            handleUserChosen();
        }
    };

    const handleCreateUserKeyDown = (event) => {
        if (event.key === "Enter") {
            handleCreateUser();
        }
    };

    const getUsers = async () => {
        try {
            const res = await axios.get(
                `https://sift-tool.com/api/sessions/getUsers`,
                {
                    params: { sessionID: sessionDetails.sessionID },
                }
            );
            if (res.data.getSuccess) {
                const userMap = res.data.users;
                const userArray = Object.keys(userMap);
                setUsers(userArray);
            }
        } catch (error) {
            console.error("Error getting users: ", error);
        }
    };

    const handleSelectedChange = (event) => {
        const user = event.target.value;

        if (user === "create-user") {
            setShowAddUser(true);
            setSelectedUser(user);
        } else {
            setSelectedUser(user);
            setShowAddUser(false);
            setSelectUserDisabled(false);
        }
    };

    const handleUserChosen = async () => {
        try {
            const res = await axios.post(
                `hhttps://sift-tool.com/api/sessions/setUser`,
                { user: selectedUser },
                { withCredentials: true }
            );
            setSessionDetails({ ...sessionDetails, user: res.data.user });
            setUserAuthenticated(true);
            navigate("/compare");
        } catch (error) {
            console.error("Error choosing user: ", error);
        }
    };

    const handleCreateUser = async () => {
        try {
            const res = await axios.post(
                `https://sift-tool.com/api/sessions/addUser`,
                { sessionID: sessionDetails.sessionID, user: newUser },
                { withCredentials: true }
            );
            setSessionDetails({ ...sessionDetails, user: res.data.user });
            setUserAuthenticated(true);
            navigate("/compare");
        } catch (error) {
            console.error("Error creating new user: ", error);
        }
    };

    return (
        <Screen>
            <div className="select-user-container">
                <h1>Select User Before Proceeding: </h1>
                <div className="select-user-box">
                    <select
                        className="user-options"
                        value={selectedUser}
                        onChange={handleSelectedChange}
                    >
                        <option
                            value=""
                            disabled
                        >
                            Select an option
                        </option>
                        {users.map((user, index) => (
                            <option
                                key={index}
                                value={user}
                            >
                                {user}
                            </option>
                        ))}
                        <option value="create-user">Create new user</option>
                    </select>
                    {!showAddUser && !selectUserDisabled && (
                        <button
                            className="select-user-button"
                            onClick={handleUserChosen}
                            onKeyDown={handleSelectUserKeyDown}
                        >
                            Select User
                        </button>
                    )}
                </div>

                {showAddUser && (
                    <div className="add-user-box">
                        <input
                            className="new-user-input"
                            type="text"
                            value={newUser}
                            onChange={(e) => setNewUser(e.target.value)}
                            placeholder="Enter your name"
                        />
                        <div
                            className="add-user-button"
                            onClick={handleCreateUser}
                            onKeyDown={handleCreateUserKeyDown}
                        >
                            Add User
                        </div>
                    </div>
                )}
            </div>
        </Screen>
    );
}
