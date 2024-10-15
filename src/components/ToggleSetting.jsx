import React from "react";
import ReactSwitch from "react-switch";
import "../styles/ToggleSetting.css";
export default function ToggleSetting({ settingName, onToggle, checked, type }) {
    //toggle switch component for admin setting screen
    const handleToggle = () => {
        onToggle(!checked, type);
    };

    return (
        <div className="setting-row">
            {settingName}
            <ReactSwitch
                className="switch"
                checked={checked}
                onChange={handleToggle}
                onColor="#4caf50"
                offColor="#ccc"
                onHandleColor="#ffffff"
                offHandleColor="#ffffff"
                handleDiameter={23}
                uncheckedIcon={false}
                checkedIcon={false}
                boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                height={25}
                width={50}
            />
        </div>
    );
}
