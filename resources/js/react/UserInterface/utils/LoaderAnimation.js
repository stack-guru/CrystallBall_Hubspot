import React from 'react'

export default function LoaderAnimation(props) {
    if (!props.show) return null;
    return (
        <div style={{ position: 'absolute', width: '100%', height: '150%', left: '0px', top: '0px', opacity: 0.8, zIndex: 9999, backgroundColor: "#456287", textAlign: 'center' }}>
            <i className="fa fa-spinner fa-pulse fa-5x" style={{ position: 'absolute',  top: "50%", color: "white" }}></i>
            <span style={{ position: 'absolute', left:"620px", top: "65%", color: "white" }}>{props.text}</span>
        </div>
    )
}
