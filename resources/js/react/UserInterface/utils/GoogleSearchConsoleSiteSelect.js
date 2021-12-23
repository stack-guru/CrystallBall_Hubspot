import React, { Component } from 'react'

import HttpClient from './HttpClient'

import Select from 'react-select';

export default class GoogleSearchConsoleSiteSelect extends Component {

    constructor(props) {
        super(props)
        this.state = {
            cSites: [{ value: "", label: "All Sites" }],
            allSites: []
        };
        this.searchGoogleSearchConsoleSites = this.searchGoogleSearchConsoleSites.bind(this);
        this.onChangeHandler = this.onChangeHandler.bind(this);
    }

    componentDidMount() {
        if (this.props.autoSelectFirst) {
            this.searchGoogleSearchConsoleSites(' ', (options) => {
                if (options.length) {
                    this.setState({ cSites: [{ value: "", label: "Loading..." }] });
                    setTimeout(() => {
                        this.onChangeHandler(options[0]);
                    }, 5000);
                }
                this.setState({ allSites: options });
            });
        }
    }
    componentDidUpdate(prevProps) {
        if (this.props != prevProps) {
            if (this.props.cSites) {
                this.setState({ cSites: this.props.cSites });
            }
        }
    }

    searchGoogleSearchConsoleSites(keyword, callback) {
        HttpClient.get('settings/google-search-console-site?keyword=' + keyword)
            .then((response) => {
                let gscss = response.data.google_search_console_sites;
                let options = gscss.map(gscs => { return { value: gscs.id, label: gscs.site_url.replace('sc-domain:', '') + ' ' + gscs.google_account.name }; });
                callback(options);
            });
    }

    onChangeHandler(sOption) {
        if (sOption == null) {
            this.setState({ cSites: [{ value: "", label: "All Sites" }] });
            if (this.props.multiple) this.props.onChangeCallback({ target: { name: this.props.name, value: [""] } });
            if (!this.props.multiple) this.props.onChangeCallback({ target: { name: this.props.name, value: "" } });
            if (this.props.onChangeCallback2) (this.props.onChangeCallback2)([{ value: "", label: "All Sites" }]);
        } else {
            // cSites.push(sOption);
            let cSites = null;
            if (this.props.multiple) {
                cSites = sOption.filter(sO => sO.value !== "");
            } else {
                cSites = sOption;
            }
            this.setState({ cSites: cSites });
            if (this.props.multiple) (this.props.onChangeCallback)({ target: { name: this.props.name, value: sOption.filter(sO => sO.value !== "").map(sO => sO.value) } });
            if (!this.props.multiple) (this.props.onChangeCallback)({ target: { name: this.props.name, value: sOption.value } });
            if (this.props.onChangeCallback2) (this.props.onChangeCallback2)(cSites);
        }
    }

    render() {
        if (this.state.redirectTo) return <Redirect to={this.state.redirectTo} />
        let cSites = this.state.cSites;

        // let selectedOptions;
        // if (this.props.multiple) {
        //     selectedOptions = allOptions.filter(aO => this.props.value.indexOf(aO.value) !== -1);
        // } else {
        //     selectedOptions = this.props.value;
        // }

        return (
            <Select
                loadOptions={this.searchGoogleSearchConsoleSites}
                noOptionsMessage={() => { return "Enter chars to search" }}
                className={this.props.className}
                name={this.props.name}
                disabled={this.props.disabled}
                value={this.state.cSites}
                id={this.props.id}
                isMulti={this.props.multiple}
                isClearable={this.props.isClearable}
                onChange={this.onChangeHandler}
                options={this.state.allSites}
                isSearchable={true}
                placeholder={this.props.placeholder}
                components={this.props.components}
                onFocus={this.props.onFocus}
            />
        )
    }
}
