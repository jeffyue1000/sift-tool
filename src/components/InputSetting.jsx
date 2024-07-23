import React from "react";

export default function InputSetting({ settingName, handleSubmit, input, setInput, type }) {
    const handleInputSubmit = (e) => {
        e.preventDefault();
        handleSubmit(input, type);
    };
    return (
        <div className="setting-row">
            {settingName}
            <form onSubmit={handleInputSubmit}>
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
        </div>
    );
}
