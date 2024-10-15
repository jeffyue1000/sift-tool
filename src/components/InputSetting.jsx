import React, { useState } from "react";
import "../styles/InputSetting.css";

export default function InputSetting({ settingName, handleSubmit, input, setInput, type }) {
    //numeric input fields for admin setting screen
    const [savedMessage, setSavedMessage] = useState(false);

    const handleInputSubmit = (e) => {
        e.preventDefault();
        handleSubmit(input, type);
        setSavedMessage(true);
        setTimeout(() => {
            setSavedMessage(false);
        }, 2000);
    };
    return (
        <div className="setting-row">
            {settingName}
            <form
                className="input-form"
                onSubmit={handleInputSubmit}
            >
                <input
                    className="input-box"
                    type="number"
                    min="1"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter amount"
                />
                <button
                    className="input-btn"
                    type="submit"
                >
                    Save
                </button>
            </form>
            {savedMessage && <div className="saved-message">Saved Successfully</div>}
        </div>
    );
}
