import React from 'react';

require('../../Main.css');
import Countries from "../../utils/Countries";
import HttpClient from "../../utils/HttpClient";
import * as $ from 'jquery';
import {toast} from "react-toastify";

export default class DataSourceIndex extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sectionName: null,
            showCountry: false,
            showWeather: false,
            showRetail: false,
            dataSources: [],
            countryCheck: false,
            serviceCheck: false,
            userServices: this.props.user,
            isBusy: false,
            errors: '',
        }
        this.holidaySwitchHandler = this.holidaySwitchHandler.bind(this);
        this.weatherSwitchHandler = this.weatherSwitchHandler.bind(this);
        this.retailSwitchHandler = this.retailSwitchHandler.bind(this);
        this.onHolidayUpdateClick = this.onHolidayUpdateClick.bind(this);
        this.onWeatherUpdateClick = this.onWeatherUpdateClick.bind(this);
        this.addCountry = this.addCountry.bind(this);
        this.serviceStatusHandler = this.serviceStatusHandler.bind(this);
    }

    componentDidMount() {
        document.title = 'Data Source';
        if (!this.state.isBusy) {
            HttpClient.get('/user-data-source').then(resp => {
                this.setState({isBusy: false, dataSources: resp.data.data_sources});

            }, (err) => {
                this.setState({isBusy: false, errors: err.response});
                console.log(err)
            }).catch(err => {
                console.log(err)
                this.setState({isBusy: false, errors: err});
            })
        }
    }

    addCountry(e) {
        if (!e.target.defaultChecked) {
            this.setState({countryCheck: true})
            let formData = {
                'ds_code': 'holidays',
                'ds_name': 'Holiday',
                'country_name': e.target.name,
                'is_enabled': 1,
            }
            HttpClient.post('/user-data-source', formData).then(resp => {
                this.setState({dataSources: this.state.dataSources.concat(resp.data.user_data_source)})
            }, (err) => {
                console.log(err)
            }).catch(err => {
                console.log(err)
            })
        }
        if (e.target.defaultChecked) {
            this.setState({countryCheck: false})

            HttpClient.delete(`/user-data-source/${e.target.id}`).then(resp => {
                let dataSources = this.state.dataSources;
                dataSources = dataSources.filter(a => a.id != resp.data.data_source.id);
                this.setState({isBusy: false, dataSources: dataSources})
            }, (err) => {
                console.log(err)
            }).catch(err => {
                console.log(err)
            })
        }
    }

    showAllChange(e) {

    }

    clearAllChange(e) {

    }

    holidaySwitchHandler(e) {
        if (!this.state.showCountry || this.state.sectionName == null) {
            this.setState({
                showCountry: true,
                showWeather: false,
                showRetail: false,
                sectionName: e.target.className
            });
        } else {
            this.setState({showCountry: false, sectionName: null});
        }
    }

    onHolidayUpdateClick() {
        this.setState({
            showCountry: true,
            showWeather: false,
            showRetail: false,
            sectionName: "holiday"
        });
    }

    weatherSwitchHandler(e) {
        if (!this.state.showWeather || this.state.sectionName == null) {
            this.setState({
                showWeather: true,
                showCountry: false,
                showRetail: false,
                sectionName: e.target.className,
            });
        } else {
            this.setState({showWeather: false, sectionName: null});
        }
    }

    onWeatherUpdateClick() {
        this.setState({
            showWeather: true,
            showCountry: false,
            showRetail: false,
            sectionName: "weather",
        });
    }

    retailSwitchHandler(e) {
        if (!this.state.showRetail || this.state.sectionName == null) {
            this.setState({
                showRetail: true,
                showWeather: false,
                showCountry: false,
                sectionName: e.target.className
            });
        } else {
            this.setState({showRetail: false, sectionName: null});
        }
    }

    serviceStatusHandler(e) {
        let formData;
        if (!e.target.defaultChecked) {
            if (e.target.name == 'is_ds_holidays_enabled') {
                formData = {'is_ds_holidays_enabled': 1}
            }
            if (e.target.name == 'is_ds_google_algorithm_updates_enabled') {
                formData = {'is_ds_google_algorithm_updates_enabled': 1}
            }
            if (e.target.name == 'is_ds_retail_marketing_enabled') {
                formData = {'is_ds_retail_marketing_enabled': 1}
            }
            HttpClient.post('/userService', formData).then(resp => {
                this.setState({userServices: resp.data.user_services})
                toast.success("Service activated successfully.");
            }, (err) => {
                console.log(err)
            }).catch(err => {
                console.log(err)
            })
        }
        if (e.target.defaultChecked) {
            if (e.target.name == 'is_ds_holidays_enabled') {
                formData = {'is_ds_holidays_enabled': 0}
            }
            if (e.target.name == 'is_ds_google_algorithm_updates_enabled') {
                formData = {'is_ds_google_algorithm_updates_enabled': 0}
            }
            if (e.target.name == 'is_ds_retail_marketing_enabled') {
                formData = {'is_ds_retail_marketing_enabled': 0}
            }
            HttpClient.post('/userService', formData).then(resp => {
                this.setState({userServices: resp.data.user_services})
                toast.success("Service deactivated successfully.");
            }, (err) => {
                console.log(err)
            }).catch(err => {
                console.log(err)
            })
        }
    }

    render() {
        let countries = this.state.dataSources;

        return (
            <div className="container-xl bg-white  d-flex flex-column justify-content-center component-wrapper">
                <div className="row ml-0 mr-0">
                    <div className="col-12">
                        <h1 className="heading-section gaa-title">Data Source</h1>
                    </div>
                </div>
                <div className="row ml-0 mr-0 mt-4">
                    <div className="col-md-8 col-sm-12 M">
                        <div className="container ds-sections">
                            <div className="w-75 h-100 border-bottom d-flex align-items-center">
                                <div className="w-100 row">
                                    <div className="row ml-0 mr-0 w-100">
                                        <div className="col-8">
                                            <h3 className="gaa-text-primary">Holiday</h3>
                                        </div>
                                        <div className="col-4 d-flex flex-column justify-content-center align-items-center">
                                            <label className="trigger switch">
                                                <input
                                                    type="checkbox"
                                                    className="holiday"
                                                    defaultChecked={this.state.showCountry}
                                                    checked={this.state.showCountry}
                                                    onChange={this.holidaySwitchHandler}
                                                />
                                                <span className="slider round"/>
                                            </label>
                                        </div>
                                    </div>
                                    <div className="row ml-0 mr-0 mt-3 w-100">
                                        <div className="col-8">
                                            <dl className="d-flex flex-row flex-wrap">
                                                <dt>Annotations for:</dt>
                                                {countries
                                                    ? countries.map(country => (
                                                        <dd className="mx-2" key={country.id}>{country.country_name}</dd>
                                                    ))
                                                    : <dd className="mx-2">no country added</dd>
                                                }
                                            </dl>
                                        </div>
                                        <div className="col-4">
                                            <p
                                                className="ds-update-text m-0 text-center"
                                                onClick={this.onHolidayUpdateClick}
                                            >
                                                Update
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="container mt-3 ds-sections">
                            <div className="w-75 h-100 border-bottom d-flex align-items-center">
                                <div className="w-100 row">
                                    <div className="row ml-0 mr-0 w-100">
                                        <div className="col-8">
                                            <h3 className="gaa-text-primary">Weather Alert</h3>
                                        </div>
                                        <div className="col-4 d-flex flex-column justify-content-center align-items-center">
                                            <label className="trigger switch">
                                                <input
                                                    type="checkbox"
                                                    className="weather"
                                                    defaultChecked={this.state.showWeather}
                                                    checked={this.state.showWeather}
                                                    onChange={this.weatherSwitchHandler}
                                                />
                                                <span className="slider round"/>
                                            </label>
                                        </div>
                                    </div>
                                    <div className="row ml-0 mr-0 mt-3 w-100">
                                        <div className="col-8">
                                            <dl className="d-flex flex-row flex-wrap">
                                                <dt>Annotations for:</dt>
                                                <dd className="mx-2">spain</dd>
                                                <dd className="mx-2">Argentina</dd>
                                                <dd className="mx-2">spain</dd>
                                            </dl>
                                        </div>
                                        <div className="col-4">
                                            <p
                                                className="ds-update-text m-0 text-center"
                                                onClick={this.onWeatherUpdateClick}
                                            >
                                                Update
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="container mt-3 ds-sections">
                            <div className="ml-0 mr-0 w-75 h-100 border-bottom d-flex align-items-center">
                                <div className="w-100 row">
                                    <div className="col-8">
                                        <h3 className="gaa-text-primary">Google Algorithm Updates</h3>
                                    </div>
                                    <div className="col-4 text-center d-flex justify-content-center">
                                        <label className="trigger switch">
                                            <input
                                                type="checkbox"
                                                defaultChecked={this.state.userServices.is_ds_google_algorithm_updates_enabled}
                                                onChange={this.serviceStatusHandler}
                                                name="is_ds_google_algorithm_updates_enabled"
                                            />
                                            <span className="slider round"/>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="container mt-3 ds-sections">
                            <div className="ml-0 mr-0 w-75 h-100 border-bottom d-flex align-items-center">
                                <div className="w-100 row">
                                    <div className="col-8">
                                        <h3 className="gaa-text-primary">Retail Marketing</h3>
                                    </div>
                                    <div className="col-4 text-center d-flex justify-content-center">
                                    <label className="trigger switch">
                                        <input
                                            type="checkbox"
                                            className="retail"
                                            defaultChecked={this.state.showRetail}
                                            checked={this.state.showRetail}
                                            onChange={this.retailSwitchHandler}
                                        />
                                        <span className="slider round"/>
                                    </label>
                                </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 col-sm-12 M mt-3 border-left">
                        {(this.state.showCountry || this.state.showWeather || this.state.showRetail) ?
                            <div className="switch-wrapper">
                                <Countries
                                    sectionTitle={this.state.sectionName}
                                    onChangeCallback={this.addCountry}
                                    ds_data={this.state.dataSources}
                                    showAllChange={this.showAllChange}
                                    clearAllChange={this.clearAllChange}
                                />
                            </div>
                            : null
                        }
                    </div>
                </div>
            </div>
        );
    }
}
