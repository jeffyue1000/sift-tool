import React, { useState, useEffect } from "react";
import Screen from "../components/Screen";
import { useNavigate } from "react-router-dom";
import { useSessionAuth } from "../context/SessionAuthContext";

export default function SelectUserScreen() {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState("");
    const [newUser, setNewUser] = useState("");
    const [showAddUser, setShowAddUser] = useState(false);
    const { sessionDetails, setSessionDetails } = useSessionAuth();

    const navigate = useNavigate();

    useEffect(() => {
        getUsers();
    }, []);

    const getUsers = async () => {
        try {
            const res = await axios.get(`http://localhost:3001/sessions/getUsers`, {
                params: { sessionID: sessionDetails.sessionID },
            });
            if (res.data.getSuccess) {
                const userArray = Array.from(res.data.users.keys());
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
        } else {
            setSelectedUser(user);
            setShowAddUser(false);
        }
    };

    const handleUserChosen = async () => {
        try {
            const res = await axios.post(`http://localhost:3001/sessions/setUser`, { user: selectedUser }, { withCredentials: true });
            setSessionDetails({ ...sessionDetails, user: res.data.user });
            navigate("/compare");
        } catch (error) {
            console.error("Error choosing user: ", error);
        }
    };

    const handleCreateUser = async () => {
        try {
            const res = await axios.post(
                `http://localhost:3001/sessions/addUser`,
                { sessionID: sessionDetails.sessionID, user: newUser },
                { withCredentials: true }
            );
            setSessionDetails({ ...sessionDetails, user: res.data.user });
            navigate("/compare");
        } catch (error) {
            console.error("Error creating new user: ", error);
        }
    };

    return (
        <Screen>
            <h1>Select or Create User Before Proceeding: </h1>
            <select
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
                        {item}
                    </option>
                ))}
                <option value="create-user">Create new user</option>
            </select>
            {showAddUser && (
                <div>
                    <input
                        type="text"
                        value={newUser}
                        onChange={(e) => setNewUser(e.target.value)}
                        placeholder="Enter your name"
                    />
                    <button onClick={handleCreateUser}>Add User</button>
                </div>
            )}
            <button onClick={handleUserChosen}></button>
        </Screen>
    );
}
