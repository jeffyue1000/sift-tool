import { React, useState, useEffect } from "react";
import InputSetting from "../components/InputSetting";
import ToggleSetting from "../components/ToggleSetting";
import { useSessionAuth } from "../context/SessionAuthContext";
import Screen from "../components/Screen";
import UserDisplay from "../components/UserDisplay";
import axios from "axios";
import "../styles/AdminSettingsScreen.css";

export default function AdminSettingsScreen() {
    const [useReject, setUseReject] = useState(false);
    const [usePush, setUsePush] = useState(false);
    const [rejectAdmin, setRejectAdmin] = useState(false); //require admin to reject resumes
    const [pushAdmin, setPushAdmin] = useState(false); //require admin to push resumes
    const [rejectQuota, setRejectQuota] = useState(1); //number of votes to reject
    const [pushQuota, setPushQuota] = useState(1); //number of votes to push
    const [useTimer, setUseTimer] = useState(false);
    const [compareTimer, setCompareTimer] = useState(5); //seconds until resumes are able to be compared
    const [currentTab, setCurrentTab] = useState("settings");
    const { sessionDetails, setSessionDetails } = useSessionAuth(); //session states

    useEffect(() => {
        //update settings according to session state
        setUseReject(sessionDetails.useReject);
        setUsePush(sessionDetails.usePush);
        setRejectAdmin(sessionDetails.rejectRequireAdmin);
        setPushAdmin(sessionDetails.pushRequireAdmin);
        setRejectQuota(sessionDetails.rejectQuota);
        setPushQuota(sessionDetails.pushQuota);
        setUseTimer(sessionDetails.useTimer);
        setCompareTimer(sessionDetails.compareTimer);
    }, [sessionDetails]);

    const handleRejectOrPushQuotaSubmit = async (quota, type) => {
        //update reject/push voting quotas
        try {
            const res = await axios.post(`http://localhost:3001/sessions/updateRejectOrPushQuota`, {
                quota: quota,
                sessionID: sessionDetails.sessionID,
                type: type,
            });
            if (res.data.updateSuccess) {
                if (type === "push") {
                    setSessionDetails({ ...sessionDetails, pushQuota: quota });
                } else {
                    setSessionDetails({ ...sessionDetails, rejectQuota: quota });
                }
            }
        } catch (error) {
            console.error("Error updating rejectQuota or pushQuota", error);
        }
    };

    const handleRejectOrPushAdminRequired = async (checked, type) => {
        //update reject/push admin requirements
        try {
            const res = await axios.post(`http://localhost:3001/sessions/updateRequireAdminPushOrReject`, {
                checked: checked,
                sessionID: sessionDetails.sessionID,
                type: type,
            });
            if (res.data.updateSuccess) {
                if (type === "push") {
                    setSessionDetails({ ...sessionDetails, pushRequireAdmin: checked });
                } else {
                    setSessionDetails({ ...sessionDetails, rejectRequireAdmin: checked });
                }
            }
        } catch (error) {
            console.error("Error updating requireAdminPush or requireAdminReject", error);
        }
    };

    const handleUseRejectOrPush = async (checked, type) => {
        //update whether to use reject/push functionalities
        try {
            const res = await axios.post(`http://localhost:3001/sessions/updateUsePushOrReject`, {
                checked: checked,
                sessionID: sessionDetails.sessionID,
                type: type,
            });
            if (res.data.updateSuccess) {
                if (type === "push") {
                    setSessionDetails({ ...sessionDetails, usePush: checked });
                } else {
                    setSessionDetails({ ...sessionDetails, useReject: checked });
                }
            }
        } catch (error) {
            console.error("Error updating useReject or usePush", error);
        }
    };

    const handleComparisonTimerRequired = async (checked) => {
        //update whether comparison timer is used
        try {
            const res = await axios.post(`http://localhost:3001/sessions/updateUseTimer`, {
                checked: checked,
                sessionID: sessionDetails.sessionID,
            });
            if (res.data.updateSuccess) {
                setSessionDetails({ ...sessionDetails, useTimer: checked });
            }
        } catch (error) {
            console.error("Error updating useTimer", error);
        }
    };

    const handleComparisonTimerSubmit = async (time) => {
        //update the comparison timer second count
        try {
            const res = await axios.post(`http://localhost:3001/sessions/updateCompareTimer`, {
                sessionID: sessionDetails.sessionID,
                time: time,
            });
            if (res.data.updateSuccess) {
                setSessionDetails({ ...sessionDetails, compareTimer: time });
            }
        } catch (error) {
            console.error("Error updating comparison timer", error);
        }
    };

    return (
        <Screen>
            <div className="admin-wrapper">
                <div className="settings-tabs">
                    <button
                        className={`tab ${currentTab === "settings" ? "active" : ""}`}
                        onClick={() => setCurrentTab("settings")}
                    >
                        Settings
                    </button>
                    <button
                        className={`tab ${currentTab === "users" ? "active" : ""}`}
                        onClick={() => setCurrentTab("users")}
                    >
                        Users
                    </button>
                </div>
                <div className="admin-container">
                    {currentTab === "users" ? (
                        <UserDisplay />
                    ) : (
                        <div className="settings-container">
                            <div className="reject-container">
                                <ToggleSetting
                                    settingName="Allow auto-reject voting:"
                                    onToggle={handleUseRejectOrPush}
                                    checked={useReject}
                                    type="reject"
                                />
                                {useReject && (
                                    <ToggleSetting
                                        settingName="Admin Only:"
                                        onToggle={handleRejectOrPushAdminRequired}
                                        checked={rejectAdmin}
                                        type="reject"
                                    />
                                )}
                                {useReject && (
                                    <InputSetting
                                        settingName="Number of rejections to reject:"
                                        handleSubmit={handleRejectOrPushQuotaSubmit}
                                        input={rejectQuota}
                                        setInput={setRejectQuota}
                                        type="reject"
                                    />
                                )}
                            </div>
                            <div className="push-container">
                                <ToggleSetting
                                    settingName="Allow auto-push voting:"
                                    onToggle={handleUseRejectOrPush}
                                    checked={usePush}
                                    type="push"
                                />
                                {usePush && (
                                    <ToggleSetting
                                        settingName="Admin only:"
                                        onToggle={handleRejectOrPushAdminRequired}
                                        checked={pushAdmin}
                                        setChecked={setPushAdmin}
                                        type="push"
                                    />
                                )}
                                {usePush && (
                                    <InputSetting
                                        settingName="Number of pushes to push:"
                                        handleSubmit={handleRejectOrPushQuotaSubmit}
                                        input={pushQuota}
                                        setInput={setPushQuota}
                                        type="push"
                                    />
                                )}
                            </div>
                            <div
                                className={useTimer ? "timer-setting-container-center" : "timer-setting-container-top"}
                            >
                                <ToggleSetting
                                    settingName="Enable timer:"
                                    onToggle={handleComparisonTimerRequired}
                                    checked={useTimer}
                                    type="placeholder"
                                />
                                {useTimer && (
                                    <InputSetting
                                        settingName="Minimum seconds to compare:"
                                        handleSubmit={handleComparisonTimerSubmit}
                                        input={compareTimer}
                                        setInput={setCompareTimer}
                                        type="placeholder"
                                    />
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Screen>
    );
}
