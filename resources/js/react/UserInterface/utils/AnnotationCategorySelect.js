import React from "react";
import Creatable, { makeCreatableSelect } from 'react-select/creatable';
import CreatableSelect from 'react-select/creatable';

import HttpClient from "./HttpClient";

export default class AnnotationCategorySelect extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isBusy: false,
            errors: '',
        }

        this.onChangeHandler = this.onChangeHandler.bind(this)
    }


    componentDidMount() {

    }

    onChangeHandler(sOption) {
        this.props.onChangeCallback({ target: { name: this.props.name, value: sOption.value } });
    }

    render() {
        return (
            <CreatableSelect
                name={this.props.name}
                disabled={this.props.disabled}
                value={{ label: this.props.value, value: this.props.value }}
                id={this.props.id}
                isMulti={this.props.multiple}
                onChange={this.onChangeHandler}
                className="gray_clr"
                options={this.props.categories}
                placeholder={this.props.placeholder || 'Category *'}
            >
            </CreatableSelect>
        )
    }


}
