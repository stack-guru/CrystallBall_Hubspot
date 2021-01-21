import React from "react";
import Select from 'react-select';
import { Redirect } from "react-router-dom";

import HttpClient from "./HttpClient";

export default class GoogleAnalyticsAccountSelect extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            aAccounts: [],
            isBusy: false,
            errors: '',
            redirectTo: null,
        }

        this.onChangeHandler = this.onChangeHandler.bind(this)
    }


    componentDidMount() {
        this.setState({ isBusy: true })
        HttpClient.get(`/settings/google-analytics-account`)
            .then(response => {
                this.setState({ isBusy: false, aAccounts: response.data.google_analytics_accounts });
            }, (err) => {
                console.log(err);
                this.setState({ isBusy: false, errors: (err.response).data });
            }).catch(err => {
                console.log(err)
                this.setState({ isBusy: false, errors: err });
            });
    }

    onChangeHandler(sOption) {
        if (sOption == null) {
            this.props.onChangeCallback({ target: { name: this.props.name, value: [""] } });
        }else if (!this.props.multiple && sOption.value == 'new-google-account') {
            this.setState({ redirectTo: '/settings/google-account' });
        } else {
            this.props.onChangeCallback({ target: { name: this.props.name, value: this.props.multiple ? sOption.filter(sO => sO.value !== "").map(sO => sO.value) : sOption.value } });
        }
    }

    render() {
        if (this.state.redirectTo) return <Redirect to={this.state.redirectTo} />
        let aAccounts = this.state.aAccounts;

        let allOptions = [
            { value: "", label: "All Accounts" }
        ];
        allOptions = allOptions.concat(aAccounts.map(acc => { return { value: acc.id, label: acc.name } }));
        // allOptions.push({ value: "new-google-account", label: "Connect new Google Account" })

        let selectedOptions;
        if (this.props.multiple) {
            selectedOptions = allOptions.filter(aO => this.props.value.indexOf(aO.value) !== -1);
        } else {
            selectedOptions = this.props.value;
        }
        return (
            <Select
                name={this.props.name}
                disabled={this.props.disabled}
                value={selectedOptions}
                id={this.props.id}
                isMulti={this.props.multiple}
                onChange={this.onChangeHandler}
                options={allOptions}
                isSearchable={allOptions.length > 3}
                placeholder={this.props.placeholder}>
            </Select>
        )
    }


}
