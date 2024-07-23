import { React, useState, useEffect } from "react";
import QuotaSetting from "../components/QuotaSetting";
import ToggleSetting from "../components/ToggleSetting";
import { useSessionAuth } from "../context/SessionAuthContext";
import Screen from "../components/Screen";
import axios from "axios";

export default function AdminSettingsScreen() {
    const [useReject, setUseReject] = useState(false);
    const [usePush, setUsePush] = useState(false);
    const [rejectAdmin, setRejectAdmin] = useState(false);
    const [pushAdmin, setPushAdmin] = useState(false);
    const [rejectQuota, setRejectQuota] = useState(1);
    const [pushQuota, setPushQuota] = useState(1);
    const { sessionDetails, setSessionDetails } = useSessionAuth();

    useEffect(() => {
        setUseReject(sessionDetails.useReject);
        setUsePush(sessionDetails.usePush);
        setRejectAdmin(sessionDetails.rejectRequireAdmin);
        setPushAdmin(sessionDetails.pushRequireAdmin);
        setRejectQuota(sessionDetails.rejectQuota);
        setPushQuota(sessionDetails.pushQuota);
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
                    setSessionDetails({ ...sessionDetails, rejectQuota: quota });
                } else {
                    setSessionDetails({ ...sessionDetails, pushQuota: quota });
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

    return (
        <Screen>
            <div className="page-container">
                <h1 className="admin-header">Admin Settings</h1>
                <div className="settings-container">
                    <ToggleSetting
                        settingName="Allow auto-reject voting:"
                        onToggle={handleUseRejectOrPush}
                        checked={useReject}
                        setChecked={setUseReject}
                        type="reject"
                    />
                    {useReject && (
                        <QuotaSetting
                            settingName="Number of rejections to reject:"
                            handleSubmit={handleRejectOrPushQuotaSubmit}
                            quota={rejectQuota}
                            setQuota={setRejectQuota}
                            type="reject"
                        />
                    )}
                    {useReject && (
                        <ToggleSetting
                            settingName="Require admin to reject:"
                            onToggle={handleRejectOrPushAdminRequired}
                            checked={rejectAdmin}
                            setChecked={setRejectAdmin}
                            type="reject"
                        />
                    )}
                    <ToggleSetting
                        settingName="Allow auto-push voting:"
                        onToggle={handleUseRejectOrPush}
                        checked={usePush}
                        setChecked={setUsePush}
                        type="push"
                    />
                    {usePush && (
                        <QuotaSetting
                            settingName="Number of pushes to push:"
                            handleSubmit={handleRejectOrPushQuotaSubmit}
                            quota={pushQuota}
                            setQuota={setPushQuota}
                            type="push"
                        />
                    )}
                    {usePush && (
                        <ToggleSetting
                            settingName="Require admin to push:"
                            onToggle={handleRejectOrPushAdminRequired}
                            checked={pushAdmin}
                            setChecked={setPushAdmin}
                            type="push"
                        />
                    )}
                </div>
            </div>
        </Screen>
    );
}
