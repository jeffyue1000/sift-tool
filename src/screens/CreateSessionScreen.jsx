import { React, useState } from "react";
import SessionConfig from "../components/SessionConfig";
import SessionCreate from "../components/SessionCreate";

export default function CreateSessionScreen() {
    const [configData, setConfigData] = useState({
        maxResumes: 1,
        duration: 1,
    });
    const [currentScreen, setCurrentScreen] = useState("config");

    const onConfigSubmit = (maxResumes, duration) => {
        setConfigData({ maxResumes, duration });
        setCurrentScreen("create");
    };

    return (
        <div>
            {currentScreen === "config" ? (
                <SessionConfig onSubmit={onConfigSubmit} />
            ) : (
                <SessionCreate configData={configData} />
            )}
        </div>
    );
}
