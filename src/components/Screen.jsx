import React from "react";
import "../styles/Screen.css";

export default function Screen({ children }) {
    //general screen wrapper
    return <div className="screen-container">{children}</div>;
}
