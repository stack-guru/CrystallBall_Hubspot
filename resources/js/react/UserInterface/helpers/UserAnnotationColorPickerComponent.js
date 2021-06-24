import React from "react";
import HttpClient from "../utils/HttpClient";
export default function UserAnnotationColorPicker(props) {
    return <input className="user-annotation-color-picker" type="color" name={props.name} value={props.value} onInput={(e) => {
        HttpClient.post(`/data-source/user-annotation-color`, { [props.name]: e.target.value }).then(resp => {
            (props.updateCallback)(resp.data.user_annotation_color);
        })
    }} />
}