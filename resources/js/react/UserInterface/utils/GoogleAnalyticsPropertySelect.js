import React, { Component } from 'react'

import HttpClient from './HttpClient'

import Select from 'react-select/async';

export default class GoogleAnalyticsPropertySelect extends Component {

    constructor(props) {
        super(props)
        this.state = {
            aProperties: [{ value: "", label: "All Accounts" }],
        };
        this.searchGoogleAnalyticsProperties = this.searchGoogleAnalyticsProperties.bind(this);
        this.onChangeHandler = this.onChangeHandler.bind(this);
    }

    componentDidMount() {
    }
    componentDidUpdate(prevProps) {
        if (this.props != prevProps) {
            if (this.props.aProperties) {
                this.setState({ aProperties: this.props.aProperties });
            }
        }
    }

    searchGoogleAnalyticsProperties(keyword, callback) {
        HttpClient.get('settings/google-analytics-property?keyword=' + keyword)
            .then((response) => {
                let gaps = response.data.google_analytics_properties;
                let options = gaps.map(gap => { return { value: gap.id, label: gap.name + ' ' + gap.google_analytics_account.name }; });
                callback(options);
            });
    }

    onChangeHandler(sOption) {
        if (sOption == null) {
            this.setState({ aProperties: [{ value: "", label: "All Accounts" }] });
            this.props.onChangeCallback({ target: { name: this.props.name, value: [""] } });
            if (this.props.onChangeCallback2) (this.props.onChangeCallback2)([{ value: "", label: "All Accounts" }]);
        } else {
            // aProperties.push(sOption);
            let aProperties = null;
            if (this.props.multiple) {
                aProperties = sOption.filter(sO => sO.value !== "");
            } else {
                aProperties = sOption;
            }
            this.setState({ aProperties: aProperties });
            (this.props.onChangeCallback)({ target: { name: this.props.name, value: this.props.multiple ? sOption.filter(sO => sO.value !== "").map(sO => sO.value) : sOption.value } });
            if (this.props.onChangeCallback2) (this.props.onChangeCallback2)(aProperties);
        }
    }

    render() {
        if (this.state.redirectTo) return <Redirect to={this.state.redirectTo} />
        let aProperties = this.state.aProperties;

        // let selectedOptions;
        // if (this.props.multiple) {
        //     selectedOptions = allOptions.filter(aO => this.props.value.indexOf(aO.value) !== -1);
        // } else {
        //     selectedOptions = this.props.value;
        // }

        return (
            <Select
                loadOptions={this.searchGoogleAnalyticsProperties}
                noOptionsMessage={() => { return "Enter chars to search" }}

                name={this.props.name}
                disabled={this.props.disabled}
                value={this.state.aProperties}
                id={this.props.id}
                isMulti={this.props.multiple}
                onChange={this.onChangeHandler}
                // options={allOptions}
                isSearchable={true}
                placeholder={this.props.placeholder}
            />
        )
    }
}
