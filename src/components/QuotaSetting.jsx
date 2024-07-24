import React, { useState } from "react";
import "../styles/QuotaSetting.css";

export default function QuotaSetting({
    settingName,
    handleSubmit,
    quota,
    setQuota,
    type,
}) {
    const [savedMessage, setSavedMessage] = useState(false);
    const handleQuotaSubmit = (e) => {
        e.preventDefault();
        handleSubmit(quota, type);
        setSavedMessage(true);
        setTimeout(() => {
            setSavedMessage(false);
        }, 2000);
    };
    return (
        <div className="setting-row">
            {settingName}
            <form
                className="quota-form"
                onSubmit={handleQuotaSubmit}
            >
                <input
                    className="quota-input"
                    type="number"
                    min="1"
                    value={quota}
                    onChange={(e) => setQuota(e.target.value)}
                    placeholder="Enter amount"
                />
                <button
                    className="quota-btn"
                    type="submit"
                >
                    Save
                </button>
            </form>
            {savedMessage && (
                <div className="saved-message">Saved Successfully</div>
            )}
        </div>
    );
}
