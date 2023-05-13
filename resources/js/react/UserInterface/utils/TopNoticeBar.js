import React from "react";

export default function TopNoticeBar(props) {
    if (!props.show) return null;

    return (
        <div
            className="notice-top-bar"
            style={{
                width: "100%",
                backgroundImage: props.backgroundColor,
                textAlign: "center",
                padding: "5px",
                top: "-7px",
                left: "0px",
                position: "fixed",
                zIndex: 800,
            }}
        >
            {props.content}
        </div>
    );
}
