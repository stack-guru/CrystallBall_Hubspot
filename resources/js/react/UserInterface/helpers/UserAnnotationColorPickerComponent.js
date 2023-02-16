import React from "react";
import HttpClient from "../utils/HttpClient";
import { GithubPicker } from 'react-color';

export default class UserAnnotationColorPicker extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            displayColorPicker: false,
        };

        this.handleClick = this.handleClick.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleClick() {
        this.setState({ displayColorPicker: !this.state.displayColorPicker })
    };

    handleClose() {
        this.setState({ displayColorPicker: false })
    };

    handleChange(color) {
        HttpClient.post(`/data-source/user-annotation-color`, { [this.props.name]: color.hex }).then(resp => {
            (this.props.updateCallback)(resp.data.user_annotation_color);
            this.handleClose();
        })
    };


    render() {

        // const styles = reactCSS({
        //     'default': {
        //         color: {
        //             width: '36px',
        //             height: '14px',
        //             borderRadius: '2px',
        //             background: this.props.value,
        //         },
        //         swatch: {
        //             padding: '5px',
        //             background: '#fff',
        //             borderRadius: '1px',
        //             boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
        //             display: 'inline-block',
        //             cursor: 'pointer',
        //         },
        //         popover: {
        //             position: 'absolute',
        //             zIndex: '2',
        //         },
        //         cover: {
        //             position: 'fixed',
        //             top: '0px',
        //             right: '0px',
        //             bottom: '0px',
        //             left: '0px',
        //         },
        //     },
        // });

        return (
            <div className="position-relative">
                <div onClick={this.handleClick} className="user-annotation-color-picker" style={{ backgroundColor: this.props.value }}></div>
                {
                    this.state.displayColorPicker ? <div className="colorPalette">
                        <div onClick={this.handleClose} />
                        <GithubPicker
                            width={199}
                            color={this.props.value}
                            colors={['#D96FFF', '#A00CE6', '#17DE6B', '#00BB4F', '#04D6E3', '#1976FE', '#1324B0', '#FFB8BF', '#FE4C3C', '#DE180E', '#FFE082', '#FFC514', '#FF9147', '#FF6600']}
                            onChangeComplete={this.handleChange}
                        />
                    </div> : null
                }
            </div>
        )
        // return <input className="user-annotation-color-picker" type="color" name={props.name} value={props.value} onInput={(e) => {
        //     HttpClient.post(`/data-source/user-annotation-color`, { [props.name]: e.target.value }).then(resp => {
        //         (props.updateCallback)(resp.data.user_annotation_color);
        //     })
        // }} />
    }
}