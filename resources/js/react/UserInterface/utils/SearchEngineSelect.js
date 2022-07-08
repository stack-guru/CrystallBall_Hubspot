import React from "react";
import Creatable, {makeCreatableSelect} from 'react-select/creatable';
import CreatableSelect from 'react-select/creatable';

import HttpClient from "./HttpClient";

export default class SearchEngineSelect extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isBusy: false,
            errors: '',
            search_engines: [],
            selected_option: {
                label: '',
                value: ''
            }
        }

        this.onChangeHandler = this.onChangeHandler.bind(this)
    }


    componentDidMount() {
        this.setState({isBusy: true})
        HttpClient.get(`/get-search-engine-list`)
            .then(response => {
                this.setState({isBusy: false, search_engines: response.data.search_engines});
                this.setState({
                    'selected_option': response.data.selected_search_engine
                });
            }, (err) => {
                this.setState({isBusy: false, errors: (err.response).data});
            }).catch(err => {

            this.setState({isBusy: false, errors: err});
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
                // value={this.state.selected_option}
                id={this.props.id}
                isMulti={this.props.multiple}
                onChange={this.onChangeHandler}
                className="gray_clr w-100"
                options={this.state.search_engines}
                placeholder={this.props.placeholder}
            >
            </CreatableSelect>
        )
    }


}
