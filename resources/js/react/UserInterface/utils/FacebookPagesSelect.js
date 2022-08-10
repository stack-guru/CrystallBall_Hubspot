import React from "react";
import Creatable, {makeCreatableSelect} from 'react-select/creatable';
import CreatableSelect from 'react-select/creatable';

import HttpClient from "./HttpClient";

export default class FacebookPagesSelect extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isBusy: false,
            errors: '',
            options: [],
            selected_options: ''
        }

        this.onChangeHandler = this.onChangeHandler.bind(this)
    }

    componentDidMount() {
        HttpClient.get('/data-source/get-facebook-page-list').then(resp => {
            this.setState({
                options: resp.data.facebook_pages,
                isBusy: false,
            })
        }, (err) => {
            this.setState({ isBusy: false, errors: (err.response).data });
        }).catch(err => {
            this.setState({ isBusy: false, errors: err });
        });
    }

    onChangeHandler(sOption) {
        // update in the parent component state
        let is_updated = this.props.onChangeCallback(sOption);

        if (is_updated) {
            // update in the selected ui
            this.setState({
                selected_option: sOption
            });
        }

    }

    render() {
        return (
            <CreatableSelect
                name={this.props.name}
                disabled={this.props.disabled}
                value={this.props.value}
                id={this.props.id}
                isMulti={this.props.multiple}
                onChange={this.onChangeHandler}
                className="gray_clr w-100"
                options={this.state.options}
                placeholder={this.props.placeholder}
            >
            </CreatableSelect>
        )
    }


}
