import React, { Component } from 'react'

import HttpClient from '../../../../utils/HttpClient'

import Select from 'react-select';

export default class GoogleAnalyticsPropertySelect extends Component {

    constructor(props) {
        super(props)
        this.state = {
            aProperties: [{ value: "", label: "All Properties" }],
            allProperties: [],
        };
        this.searchGoogleAnalyticsProperties = this.searchGoogleAnalyticsProperties.bind(this);
        this.onChangeHandler = this.onChangeHandler.bind(this);
    }

    componentDidMount() {
        if (this.props.autoSelectFirst) {
            this.searchGoogleAnalyticsProperties(' ', (options) => {
                if (options.length) {
                    this.setState({ aProperties: [{ value: "", label: "Loading..." }] });
                    setTimeout(() => {
                        this.onChangeHandler(options[0]);
                    }, 5000);
                }
                this.setState({ allProperties: options });
            });
        }
    }
    componentDidUpdate(prevProps) {
        if (this.props != prevProps) {
            if (this.props.aProperties) {
                this.setState({ aProperties: this.props.aProperties });
            }
        }
    }

    searchGoogleAnalyticsProperties(keyword, callback) {
        HttpClient.get('dashboard/analytics/google-analytics-property?keyword=' + keyword + '&start_date=' +this.props.start_date + '&end_date=' +this.props.end_date )
            .then((response) => {
                let gaps = response.data.google_analytics_properties;
                let options = gaps.map(gap => { return { value: gap.id, label: gap.name + ' ' + gap.google_analytics_account.name }; });
                callback(options);
            });
    }

    onChangeHandler(sOption) {
        if (sOption == null) {
            this.setState({ aProperties: [{ value: "", label: "All Properties" }] });
            if (this.props.multiple) this.props.onChangeCallback({ target: { name: this.props.name, value: [""] } });
            if (!this.props.multiple) this.props.onChangeCallback({ target: { name: this.props.name, value: "" } });
            if (this.props.onChangeCallback2) (this.props.onChangeCallback2)([{ value: "", label: "All Properties" }]);
        } else {
            // aProperties.push(sOption);
            let aProperties = null;
            if (this.props.multiple) {
                aProperties = sOption.filter(sO => sO.value !== "");
            } else {
                aProperties = sOption;
            }
            this.setState({ aProperties: aProperties });
            if (this.props.multiple) (this.props.onChangeCallback)({ target: { name: this.props.name, value: sOption.filter(sO => sO.value !== "").map(sO => sO.value) } });
            if (!this.props.multiple) (this.props.onChangeCallback)({ target: { name: this.props.name, value: sOption.value } });
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
                className={this.props.className}
                name={this.props.name}
                disabled={this.props.disabled}
                value={this.state.aProperties}
                id={this.props.id}
                isMulti={this.props.multiple}
                isClearable={this.props.isClearable}
                onChange={this.onChangeHandler}
                options={this.state.allProperties}
                isSearchable={true}
                placeholder={this.props.placeholder}
                components={this.props.components}
                onFocus={this.props.onFocus}
                style={this.props.style}
            />
        )
    }
}
