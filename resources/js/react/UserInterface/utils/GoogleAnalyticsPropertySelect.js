import React, { Component } from 'react'

import HttpClient from './HttpClient'

import Select from 'react-select';

export default class GoogleAnalyticsPropertySelect extends Component {

    constructor(props) {
        super(props)
        this.state = {
            aProperties: [{ value: "", label: "All Properties" }],
            allProperties: []
        };
        this.searchGoogleAnalyticsProperties = this.searchGoogleAnalyticsProperties.bind(this);
        this.onChangeHandler = this.onChangeHandler.bind(this);
    }

    componentDidMount() {
        this.searchGoogleAnalyticsProperties(' ', (options) => {
            if (options.length) {
                if (this.props.autoSelectFirst) {
                    this.setState({ aProperties: [{ value: "", label: "Loading..." }] });
                    setTimeout(() => {
                        this.onChangeHandler(options[0]);
                    }, 5000);
                }
            }
            this.setState({ allProperties: options });
        });
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
                let options = gaps.map(gap => {
                    return {
                        value: gap.id,
                        label: gap.name + ' ' + gap.google_analytics_account.name,
                        wasLastDataFetchingSuccessful: gap.was_last_data_fetching_successful
                    };
                });
                callback(options);
            }, (err) => {
                if (err.response.status == 400) {
                    swal.fire({
                        title: "Your Google Analytics Account is not linked yet",
                        text: "To assign an annotation to a property, first, you need to connect your Google Analytics accounts.",
                        icon: "info",
                        buttons: ['Cancel', 'Connect'],
                        dangerMode: false,
                    }).then(value => {
                        if (value) {
                            // Save pathname in this storage without domain name
                            localStorage.setItem("frontend_redirect_to", window.location.pathname);
                            window.location = "/settings/google-account/create";
                        }
                    })
                }
            }).catch(err => {
                this.setState({ errors: err, isLoading: false });
            });
    }

    onChangeHandler(sOption) {
        if (sOption == null) {
            this.setState({ aProperties: [{ value: "", label: "All Properties" }] });
            if (this.props.multiple) this.props.onChangeCallback({ target: { name: this.props.name, value: [""], wasLastDataFetchingSuccessful: sOption.was_last_data_fetching_successful } });
            if (!this.props.multiple) this.props.onChangeCallback({ target: { name: this.props.name, value: "" }, wasLastDataFetchingSuccessful: sOption.was_last_data_fetching_successful });
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
            if (this.props.multiple) (this.props.onChangeCallback)({ target: { name: this.props.name, value: sOption.filter(sO => sO.value !== "").map(sO => sO.value), wasLastDataFetchingSuccessful: sOption.wasLastDataFetchingSuccessful } });
            if (!this.props.multiple) (this.props.onChangeCallback)({ target: { name: this.props.name, value: sOption.value, wasLastDataFetchingSuccessful: sOption.wasLastDataFetchingSuccessful } });
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
            />
        )
    }
}
