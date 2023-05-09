import React from "react";
import HttpClient from "../utils/HttpClient";
import ErrorAlert from "../utils/ErrorAlert";
import Select from "react-select";
import GoogleAnalyticsPropertySelect from "../utils/GoogleAnalyticsPropertySelect";

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
            editSelected: "",
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
            this.props.updateTrackingStatus(true);
            this.props.updateUserService({ target: {
                    name: "is_ds_weather_alerts_enabled",
                    checked: true,
                },
            });
        } else {
            this.props.onUncheckCallback(
                e.target.id,
                "open_weather_map_cities"
            );
        }
    }

    selectAllShowing(e) {
        let userOWMCityIds = this.props.ds_data.forEach(ds => ds.open_weather_map_city_id);
        this.state.weather_alerts_cities.forEach(owmCity => {
            if (userOWMCityIds.indexOf(owmCity.id) == -1) {
                this.props.onCheckCallback({
                    code: "open_weather_map_cities",
                    name: "OpenWeatherMapCity",
                    country_name: null,
                    open_weather_map_city_id: owmCity.id,
                });
            }
        });
        this.props.updateTrackingStatus(true);
        this.props.updateUserService({ target: {
                name: "is_ds_weather_alerts_enabled",
                checked: true,
            },
        });
    }

    clearAll(e) {
        let userOWMCityIds = this.props.ds_data.map(ds => ds.open_weather_map_city_id);
        let userDSEvents = this.props.ds_data.map(ds => ds.id);
        userOWMCityIds.forEach((owmEvent, index) => {
            (this.props.onUncheckCallback)(userDSEvents[index], 'open_weather_map_cities')
        })
        this.props.updateTrackingStatus(false);
        this.props.updateUserService({ target: {
                name: "is_ds_weather_alerts_enabled",
                checked: false,
            },
        });
    }

    selectedCountryChanged(data) {
        this.setState({ searchCountry: data.value });
        HttpClient.get(
            `data-source/weather-alert/city?country_code=${data.value}`
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
            <div
                className={`weather_alert_cities-form ${
                    this.props.showSelectedOnly ? "gray-box" : "white-box"
                }`}
            >
                {this.props.showSelectedOnly ? (
                    <></>
                ) : (
                    <>
                        <h4 className="textblue">Select Cities</h4>
                        <ErrorAlert errors={this.state.errors} />
                    </>
                )}

                {this.props.showSelectedOnly ? (
                    <></>
                ) : (
                    <>
                        <div className="input-group mb-3 themeNewInputGroup themeNewselect flex-column">
                            <Select
                                value={this.state.searchCountry}
                                name="searchCountry"
                                onChange={this.selectedCountryChanged}
                                options={[
                                    {
                                        value: "",
                                        label: "Please select country",
                                        default: true,
                                    },
                                    ...this.state.weather_alerts_countries.map(
                                        (wAC) => {
                                            return {
                                                value: wAC.country_code,
                                                label: (
                                                    <>
                                                        <span><img style={{width: 20, height: 20,}} src={`/flags/${wAC.country_name}.png`}/></span>
                                                        <span className="pl-2">{wAC.country_name}</span>
                                                    </>
                                                ),
                                                default: true,
                                            };
                                        }
                                    ),
                                ]}
                            />
                            {/* <select className="form-control" placeholder="Search" value={this.state.searchCountry} name="searchCountry" onChange={this.selectedCountryChanged}>
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
                                             <img src={`/flags/${wAC.country_name}`} />   {wAC.country_name}
                                            </option>
                                        );
                                    })}
                            </select> */}
                        </div>
                        <div className="input-group w-100 search-input-box mb-3 d-flex justify-content-between">
                            <GoogleAnalyticsPropertySelect
                                className="themeNewselect hide-icon"
                                name="ga_property_id"
                                id="ga_property_id"
                                currentPricePlan={this.props.user.price_plan}
                                value={this.props.gaPropertyId}
                                onChangeCallback={(gAP) => {
                                    this.props.updateGAPropertyId(gAP.target.value || null)
                                }}
                                placeholder="Select GA Properties"
                                isClearable={true}
                            />
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
                <div className="d-flex flex-column border-bottom pb-3 mb-3">
                    {this.props.showSelectedOnly ? (
                        <div className="boxTitleBtn d-flex justify-content-between">
                            <h4 className="mb-0">Selected Cities</h4>
                            <span
                                className="btn-clearAll"
                                onClick={this.clearAll}
                            >
                                Clear All
                            </span>
                        </div>
                    ) : (
                        <div className="checkBoxList">
                            <label
                                className="themeNewCheckbox d-flex align-items-center justify-content-start"
                                htmlFor="check-all"
                            >
                                <input
                                    type="checkbox"
                                    id="check-all"
                                    onChange={this.selectAllShowing}
                                />
                                <span>Select All</span>
                            </label>
                        </div>
                    )}
                </div>

                { (this.props.showSelectedOnly) ? <>

                    <div className="checkBoxList">
                        {this.props.ds_data.map((wAC) => {
                                return (
                                    <label
                                        className="themeNewCheckbox d-flex align-items-center justify-content-start"
                                        htmlFor="defaultCheck1"
                                        key={wAC.open_weather_map_city_id}
                                    >
                                        <input
                                            checked
                                            id={
                                                userOWMCIds.indexOf(wAC.open_weather_map_city_id) !== -1
                                                    ? userDSIds[
                                                        userOWMCIds.indexOf(
                                                            wAC.open_weather_map_city_id
                                                        )
                                                    ]
                                                    : null
                                            }
                                            type="checkbox"
                                            onChange={this.handleClick}
                                            open_weather_map_city_id={wAC.open_weather_map_city_id}
                                        />
                                        <span className="d-flex w-100 justify-content-between">
                                            <div>{wAC.open_weather_map_city.name}</div>
                                            {/*{wAC.open_weather_map_city_id === this.state.editSelected
                                                ?
                                                <GoogleAnalyticsPropertySelect
                                                    className="w-175px themeNewselect hide-icon"
                                                    name="ga_property_id"
                                                    id="ga_property_id"
                                                    currentPricePlan={this.props.user.price_plan}
                                                    value={this.props.gaPropertyId}
                                                    onChangeCallback={(gAP) => {
                                                        this.setState({ editSelected: '' })
                                                        this.props.userDataSourceUpdateHandler(wAC.id, gAP.target.value || null)
                                                    }}
                                                    placeholder="Select GA Properties"
                                                    isClearable={true}
                                                />
                                                :
                                                <div>
                                                    {wAC.ga_property_name}
                                                    <i className="ml-2 icon fa" onClick={() => this.setState({ editSelected: wAC.open_weather_map_city_id })}>
                                                        <img className="w-20px" src='/icon-edit.svg' />
                                                    </i>
                                                </div>
                                            }*/}
                                        </span>
                                    </label>
                                );
                            })}
                    </div>
                </> : null }
                <div className="checkBoxList">
                    {this.state.weather_alerts_cities
                        .filter(this.checkSearchText)
                        .map((wAC) => {
                            return (
                                <label
                                    className="themeNewCheckbox d-flex align-items-center justify-content-start"
                                    htmlFor="defaultCheck1"
                                    key={wAC.id}
                                >
                                    <input
                                        checked={
                                            userOWMCIds.indexOf(wAC.id) !== -1
                                        }
                                        type="checkbox"
                                        id={
                                            userOWMCIds.indexOf(wAC.id) !== -1
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
                                    <span>{wAC.name}</span>
                                </label>
                            );
                        })}
                </div>
            </div>
        );
    }
}
