import React from "react";

export default function QuotaSetting({ settingName, handleSubmit, quota, setQuota, type }) {
    const handleQuotaSubmit = (e) => {
        e.preventDefault();
        handleSubmit(quota, type);
    };
    return (
        <div className="setting-row">
            {settingName}
            <form onSubmit={handleQuotaSubmit}>
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
        </div>
    );
}
