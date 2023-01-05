import React from "react";
import HttpClient from "../utils/HttpClient";
import ErrorAlert from "../utils/ErrorAlert";

export default class DSOWMCitiesSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            weather_alerts_cities: [],
            weather_alerts_countries: [],
            isBusy: false,
            errors: "",
            searchCountry: "",
            searchText: "",
        };

        this.handleClick = this.handleClick.bind(this);
        this.selectAllShowing = this.selectAllShowing.bind(this);
        this.clearAll = this.clearAll.bind(this);

        this.selectedCountryChanged = this.selectedCountryChanged.bind(this);
        this.checkSearchText = this.checkSearchText.bind(this);
    }

    componentDidMount() {
        if (!this.state.isBusy) {
            this.setState({ isBusy: true });
            HttpClient.get("data-source/weather-alert/country")
                .then(
                    (resp) => {
                        this.setState({
                            isBusy: false,
                            weather_alerts_countries: resp.data.countries,
                        });
                    },
                    (err) => {
                        this.setState({
                            isBusy: false,
                            errors: err.response.data,
                        });
                    }
                )
                .catch((err) => {
                    this.setState({ isBusy: false, errors: err });
                });
        }
    }

    handleClick(e) {
        if (e.target.checked) {
            this.props.onCheckCallback({
                code: "open_weather_map_cities",
                name: "OpenWeatherMapCity",
                country_name: null,
                retail_marketing_id: null,
                open_weather_map_city_id: e.target.getAttribute(
                    "open_weather_map_city_id"
                ),
            });
        } else {
            this.props.onUncheckCallback(
                e.target.id,
                "open_weather_map_cities"
            );
        }
    }

    selectAllShowing(e) {
        let userOWMCityIds = this.props.ds_data.map(
            (ds) => ds.open_weather_map_city_id
        );
        this.state.weather_alerts_cities.map((owmCity) => {
            if (userOWMCityIds.indexOf(owmCity.id) == -1) {
                this.props.onCheckCallback({
                    code: "open_weather_map_cities",
                    name: "OpenWeatherMapCity",
                    country_name: null,
                    open_weather_map_city_id: owmCity.id,
                });
            }
        });
    }

    clearAll(e) {
        let userOWMCityIds = this.props.ds_data.map(
            (ds) => ds.open_weather_map_city_id
        );
        let userDSEvents = this.props.ds_data.map((ds) => ds.id);
        userOWMCityIds.map((owmEvent, index) => {
            this.props.onUncheckCallback(
                userDSEvents[index],
                "open_weather_map_cities"
            );
        });
    }

    selectedCountryChanged(e) {
        this.setState({ [e.target.name]: e.target.value });
        HttpClient.get(
            `data-source/weather-alert/city?country_code=${e.target.value}`
        )
            .then(
                (resp) => {
                    this.setState({
                        isBusy: false,
                        weather_alerts_cities: resp.data.cities,
                    });
                },
                (err) => {
                    this.setState({ isBusy: false, errors: err.response.data });
                }
            )
            .catch((err) => {
                this.setState({ isBusy: false, errors: err });
            });
    }

    checkSearchText(city) {
        if (this.state.searchText.length) {
            if (
                city.name
                    .toLowerCase()
                    .indexOf(this.state.searchText.toLowerCase()) > -1
            ) {
                return true;
            }
            return false;
        }
        return true;
    }

    render() {
        let userOWMCIds = this.props.ds_data.map((ds) =>
            parseInt(ds.open_weather_map_city_id)
        );
        let userDSIds = this.props.ds_data.map((ds) => ds.id);

        return (
            <div className="apps-bodyContent switch-wrapper">
                <div
                    className={`weather_alert_cities-form ${
                        this.props.showSelectedOnly ? "gray-box" : "white-box"
                    }`}
                >
                    {this.props.showSelectedOnly ? (
                        <>

                        </>
                    ) : (
                        <>
                            <h4>Select Cities for Weather Alerts</h4>
                            <ErrorAlert errors={this.state.errors} />
                        </>
                    )}

                    {this.props.showSelectedOnly ? (
                        <></>
                    ) : (
                        <>
                            <div className="input-group mb-3">
                                <select
                                    className="form-control"
                                    placeholder="Search"
                                    value={this.state.searchCountry}
                                    name="searchCountry"
                                    onChange={this.selectedCountryChanged}
                                >
                                    {[
                                        {
                                            country_name:
                                                "Please select country",
                                            value: "",
                                        },
                                    ]
                                        .concat(
                                            this.state.weather_alerts_countries
                                        )
                                        .map((wAC) => {
                                            return (
                                                <option
                                                    value={wAC.country_code}
                                                >
                                                    {wAC.country_name}
                                                </option>
                                            );
                                        })}
                                </select>
                            </div>
                            <div className="input-group search-input-box mb-3">
                                <input
                                    type="text"
                                    className="form-control search-input"
                                    placeholder="Search"
                                    value={this.state.searchText}
                                    name="searchText"
                                    onChange={(e) =>
                                        this.setState({
                                            [e.target.name]: e.target.value,
                                        })
                                    }
                                />
                                <div className="input-group-append">
                                    <i className="ti-search"></i>
                                </div>
                            </div>
                        </>
                    )}
                    <div className="d-flex justify-content-between align-items-center border-bottom">
                        {this.props.showSelectedOnly ? (
                            <div>
                                <p className="font-weight-bold cursor m-0">
                                    Selected Cities
                                </p>
                            </div>
                        ) : (
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="check-all"
                                    onChange={this.selectAllShowing}
                                />
                                <label
                                    className="form-check-label font-weight-bold"
                                    htmlFor="check-all"
                                >
                                    Select All
                                </label>
                            </div>
                        )}

                        {this.props.showSelectedOnly ? (
                            <div>
                                <p
                                    className="font-weight-bold cursor m-0"
                                    onClick={this.clearAll}
                                >
                                    Clear All
                                </p>
                            </div>
                        ) : null}
                    </div>
                    <div className="checkbox-box mt-3">
                        {this.state.weather_alerts_cities
                            .filter(this.checkSearchText)
                            .map((wAC) => {
                                // if((this.props.showSelectedOnly && userOWMCIds.indexOf(wAC.id) === -1) || (!this.props.showSelectedOnly && userOWMCIds.indexOf(wAC.id) !== -1)) {
                                //     return null
                                // }

                                return (
                                    <div
                                        className="form-check wac"
                                        key={wAC.id}
                                    >
                                        <input
                                            className="form-check-input"
                                            checked={
                                                userOWMCIds.indexOf(wAC.id) !== -1
                                            }
                                            type="checkbox"
                                            id={
                                                userOWMCIds.indexOf(wAC.id) !==
                                                -1
                                                    ? userDSIds[
                                                          userOWMCIds.indexOf(
                                                              wAC.id
                                                          )
                                                      ]
                                                    : null
                                            }
                                            onChange={this.handleClick}
                                            open_weather_map_city_id={wAC.id}
                                        />
                                        <label
                                            className="form-check-label"
                                            htmlFor="defaultCheck1"
                                        >
                                            {wAC.name}
                                        </label>
                                    </div>
                                );
                            })}
                    </div>
                </div>
            </div>
        );
    }
}
