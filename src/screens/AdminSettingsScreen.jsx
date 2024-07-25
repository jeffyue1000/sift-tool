import { React, useState, useEffect } from "react";
import InputSetting from "../components/InputSetting";
import ToggleSetting from "../components/ToggleSetting";
import { useSessionAuth } from "../context/SessionAuthContext";
import Screen from "../components/Screen";
import axios from "axios";
import "../styles/AdminSettingsScreen.css";

export default function AdminSettingsScreen() {
    const [useReject, setUseReject] = useState(false);
    const [usePush, setUsePush] = useState(false);
    const [rejectAdmin, setRejectAdmin] = useState(false);
    const [pushAdmin, setPushAdmin] = useState(false);
    const [rejectQuota, setRejectQuota] = useState(1);
    const [pushQuota, setPushQuota] = useState(1);
    const [useTimer, setUseTimer] = useState(false);
    const [compareTimer, setCompareTimer] = useState(5);
    const { sessionDetails, setSessionDetails } = useSessionAuth();
    useEffect(() => {
        console.log(sessionDetails);
    });
    useEffect(() => {
        setUseReject(sessionDetails.useReject);
        setUsePush(sessionDetails.usePush);
        setRejectAdmin(sessionDetails.rejectRequireAdmin);
        setPushAdmin(sessionDetails.pushRequireAdmin);
        setRejectQuota(sessionDetails.rejectQuota * -1);
        setPushQuota(sessionDetails.pushQuota);
        setUseTimer(sessionDetails.useTimer);
        setCompareTimer(sessionDetails.compareTimer);
    }, [sessionDetails]);

    const handleRejectOrPushQuotaSubmit = async (quota, type) => {
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
                    setSessionDetails({ ...sessionDetails, rejectQuota: quota * -1 });
                }
            }
        } catch (error) {
            console.error("Error updating rejectQuota or pushQuota", error);
        }
    };

    const handleRejectOrPushAdminRequired = async (checked, type) => {
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
            <div className="page-container">
                <h1 className="admin-header">Admin Settings</h1>
                <div className="settings-container">
                    <div className="reject-container">
                        <ToggleSetting
                            settingName="Allow auto-reject voting"
                            onToggle={handleUseRejectOrPush}
                            checked={useReject}
                            type="reject"
                        />
                        {useReject && (
                            <ToggleSetting
                                settingName="Require admin to reject"
                                onToggle={handleRejectOrPushAdminRequired}
                                checked={rejectAdmin}
                                type="reject"
                            />
                        )}
                        {useReject && (
                            <InputSetting
                                settingName="Number of rejections to reject"
                                handleSubmit={handleRejectOrPushQuotaSubmit}
                                input={rejectQuota}
                                setInput={setRejectQuota}
                                type="reject"
                            />
                        )}
                    </div>
                    <div className="push-container">
                        <ToggleSetting
                            settingName="Allow auto-push voting"
                            onToggle={handleUseRejectOrPush}
                            checked={usePush}
                            type="push"
                        />
                        {usePush && (
                            <ToggleSetting
                                settingName="Require admin to push"
                                onToggle={handleRejectOrPushAdminRequired}
                                checked={pushAdmin}
                                setChecked={setPushAdmin}
                                type="push"
                            />
                        )}
                        {usePush && (
                            <InputSetting
                                settingName="Number of pushes to push"
                                handleSubmit={handleRejectOrPushQuotaSubmit}
                                input={pushQuota}
                                setInput={setPushQuota}
                                type="push"
                            />
                        )}
                    </div>
                    <div className="timer-container">
                        <ToggleSetting
                            settingName="Enable resume comparison timer"
                            onToggle={handleComparisonTimerRequired}
                            checked={useTimer}
                            type="placeholder"
                        />
                        {useTimer && (
                            <InputSetting
                                settingName="Minimum seconds to compare"
                                handleSubmit={handleComparisonTimerSubmit}
                                input={compareTimer}
                                setInput={setCompareTimer}
                                type="placeholder"
                            />
                        )}
                    </div>
                </div>
            </div>
        </Screen>
    );
}
