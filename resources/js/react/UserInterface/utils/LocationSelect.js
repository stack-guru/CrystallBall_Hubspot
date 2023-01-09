import React from "react";
import Creatable, { makeCreatableSelect } from "react-select/creatable";
import AsyncSelect from "react-select/async";
import CreatableSelect from "react-select/creatable";

import HttpClient from "./HttpClient";

export default class LocationSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isBusy: false,
            errors: "",
            locations: [],
            selected_option: "",
        };

        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.loadOptions = this.loadOptions.bind(this);
        this.filterLocations = this.filterLocations.bind(this);
    }

    componentDidMount() {
        this.setState({ isBusy: true });
        HttpClient.get(`/get-locations-list`)
            .then(
                (response) => {
                    let finalLocation = response.data.locations.map((loc) => ({
                        ...loc,
                        label: (
                            <>
                                <img
                                    style={{
                                        width: 30,
                                        height: 30,
                                    }}
                                    src={`/flags/${loc.label}.png`}
                                />{" "}
                                {loc.label}
                            </>
                        ),
                    }));
                    this.setState({
                        isBusy: false,
                        locations: finalLocation,
                    });
                },
                (err) => {
                    this.setState({ isBusy: false, errors: err.response.data });
                }
            )
            .catch((err) => {
                this.setState({ isBusy: false, errors: err });
            });

        if (this.props.selected.value.length > 0) {
            this.setState({
                selected_option: this.props.selected,
            });
        }
    }

    onChangeHandler(sOption) {
        // update in the parent component state
        let is_updated = this.props.onChangeCallback(sOption);
        if (is_updated) {
            // update in the selected ui
            this.setState({
                selected_option: sOption,
            });
        }
    }

    filterLocations(inputValue) {
        return this.state.locations.filter((i) =>
            i.label.toLowerCase().includes(inputValue.toLowerCase())
        );
    }

    loadOptions(input, loadCallback) {
        if (input.length >= 2) {
            HttpClient.get(`/search-locations-list?search_str=` + input)
                .then(
                    (response) => {
                        this.setState({
                            locations: response.data.locations,
                        });
                        loadCallback(this.filterLocations(input));
                    },
                    (err) => {
                        this.setState({ errors: err.response.data });
                    }
                )
                .catch((err) => {
                    this.setState({ errors: err });
                });
        }
    }

    render() {
        return (
            <AsyncSelect
                cacheOptions
                defaultOptions={this.state.locations}
                value={this.state.selected_option}
                className="gray_clr w-100 themeNewselect"
                loadOptions={this.loadOptions}
                isMulti={this.props.multiple}
                onChange={this.onChangeHandler}
            />
        );
    }
}
