import React from 'react';

require('../../Main.css');
import Countries from "../../utils/Countries";
import HttpClient from "../../utils/HttpClient";
import { toast } from "react-toastify";

export default class DataSourceIndex extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sectionName: null,
            showCountries: false,
            dataSources: [],
            userServices: this.props.user,
            isBusy: false,
            errors: '',
        }
        this.addCountry = this.addCountry.bind(this);
        this.serviceStatusHandler = this.serviceStatusHandler.bind(this);
    }

    componentDidMount() {
        document.title = 'Data Source';
        if (!this.state.isBusy) {
            HttpClient.get('/user-data-source').then(resp => {
                this.setState({ isBusy: false, dataSources: resp.data.data_sources });

            }, (err) => {
                this.setState({ isBusy: false, errors: err.response });
                console.log(err)
            }).catch(err => {
                console.log(err)
                this.setState({ isBusy: false, errors: err });
            })
        }
    }


    addCountry(e) {
        if (!e.target.defaultChecked) {
            this.setState({ countryCheck: true })
            let formData = {
                'ds_code': 'holidays',
                'ds_name': 'Holiday',
                'country_name': e.target.name,
                'is_enabled': 1,
            }
            HttpClient.post('/user-data-source', formData).then(resp => {
                this.setState({ dataSources: this.state.dataSources.concat(resp.data.user_data_source) })
            }, (err) => {
                console.log(err)
            }).catch(err => {
                console.log(err)
            })
        }
        if (e.target.defaultChecked) {
            this.setState({ countryCheck: false })

            HttpClient.delete(`/user-data-source/${e.target.id}`).then(resp => {
                let dataSources = this.state.dataSources;
                dataSources = dataSources.filter(a => a.id != resp.data.data_source.id);
                this.setState({ isBusy: false, dataSources: dataSources })
            }, (err) => {
                console.log(err)
            }).catch(err => {
                console.log(err)
            })
        }
    }

    serviceStatusHandler(e) {
        e.persist();
        if (e.target.name == 'is_ds_holidays_enabled' && !e.target.defaultChecked) {
            this.setState({ sectionName: 'holidays', showCountries: true })
        } else if (e.target.name == 'is_ds_holidays_enabled' && e.target.defaultChecked) {
            this.setState({ sectionName: null, showCountries: false })
        }
        HttpClient.post('/userService', { [e.target.name]: e.target.defaultChecked ? 0 : 1 }).then(resp => {
            if (resp.data.user_services[e.target.name] == 1) {
                toast.success("Service activated successfully.");
                this.setState({ userServices: resp.data.user_services })
            }
            if (resp.data.user_services[e.target.name] == 0) {
                this.setState({ userServices: resp.data.user_services })
                toast.info("Service deactivated successfully.");
            }
        }, (err) => {
            console.log(err)
        }).catch(err => {
            console.log(err)
        })
    }

    render() {
        let countries = this.state.dataSources;

        return (
            <div className="container-xl bg-white  d-flex flex-column justify-content-center component-wrapper">
                <div className="row ml-0 mr-0">
                    <div className="col-12">
                        <h2 className="heading-section gaa-title">Data Source</h2>
                    </div>
                </div>
                <div className="row ml-0 mr-0 mt-4">
                    <div className="col-md-8 col-sm-12 M">
                        <div className="container ds-sections">
                            <div className="w-75 h-100 border-bottom d-flex align-items-center">
                                <div className="w-100 row">
                                    <div className="row ml-0 mr-0 w-100">
                                        <div className="col-9">
                                            <h4 className="gaa-text-primary">Holidays</h4>
                                        </div>
                                        <div className="col-3 d-flex flex-column justify-content-center align-items-center">
                                            <label className="trigger switch">
                                                <input
                                                    type="checkbox"
                                                    name="is_ds_holidays_enabled"
                                                    onChange={this.serviceStatusHandler}
                                                    defaultChecked={this.state.userServices.is_ds_holidays_enabled}
                                                />
                                                <span className="slider round" />
                                            </label>
                                        </div>
                                    </div>
                                    <div className="row ml-0 mr-0 w-100">
                                        <div className="col-9">
                                            <div className="list-wrapper">
                                                <dl className="d-flex flex-row flex-wrap userCountryList">
                                                    <dt>Annotations for:</dt>
                                                    {countries
                                                        ? countries.map(country => (
                                                            <dd className="mx-2" key={country.id}>{country.country_name}</dd>
                                                        ))
                                                        : <dd className="mx-2">no country added</dd>
                                                    }

                                                </dl>
                                            </div>
                                        </div>
                                        <div className="col-3">
                                            <p
                                                className="ds-update-text m-0 text-center"
                                                onClick={() => { this.setState({ sectionName: this.state.sectionName == "holidays" ? null : "holidays", showCountries: !this.state.showCountries }) }}
                                            >
                                                {this.state.sectionName == "holidays" ? "Hide" : "Show"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* <div className="container mt-3 ds-sections">
                            <div className="w-75 h-100 border-bottom d-flex align-items-center">
                                <div className="w-100 row">
                                    <div className="row ml-0 mr-0 w-100">
                                        <div className="col-9">
                                            <h4 className="gaa-text-primary">Weather Alerts</h4>
                                        </div>
                                        <div className="col-3 d-flex flex-column justify-content-center align-items-center">
                                            <label className="trigger switch">
                                                <input
                                                    type="checkbox"
                                                    className="weather"
                                                    defaultChecked={this.state.showWeather}
                                                    checked={this.state.showWeather}
                                                    onChange={this.weatherSwitchHandler}
                                                />
                                                <span className="slider round" />
                                            </label>
                                        </div>
                                    </div>
                                    <div className="row ml-0 mr-0 mt-3 w-100">
                                        <div className="col-9">
                                            <dl className="d-flex flex-row flex-wrap">
                                                <dt>Annotations for:</dt>
                                                <dd className="mx-2">spain</dd>
                                                <dd className="mx-2">Argentina</dd>
                                                <dd className="mx-2">spain</dd>
                                            </dl>
                                        </div>
                                        <div className="col-3">
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
                        </div> */}

                        <div className="container mt-3 ds-sections">
                            <div className="ml-0 mr-0 w-75 h-100 border-bottom d-flex align-items-center">
                                <div className="w-100 row">
                                    <div className="col-9">
                                        <h4 className="gaa-text-primary">Google Algorithm Updates</h4>
                                    </div>
                                    <div className="col-3 text-center d-flex justify-content-center">
                                        <label className="trigger switch">
                                            <input
                                                type="checkbox"
                                                defaultChecked={this.state.userServices.is_ds_google_algorithm_updates_enabled}
                                                onChange={this.serviceStatusHandler}
                                                name="is_ds_google_algorithm_updates_enabled"
                                            />
                                            <span className="slider round" />
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="container mt-3 ds-sections">
                            <div className="ml-0 mr-0 w-75 h-100 border-bottom d-flex align-items-center">
                                <div className="w-100 row">
                                    <div className="col-9">
                                        <h4 className="gaa-text-primary">Retail Marketing</h4>
                                    </div>
                                    <div className="col-3 text-center d-flex justify-content-center">
                                        <label className="trigger switch">
                                            <input
                                                type="checkbox"
                                                name="is_ds_retail_marketing_enabled"
                                                defaultChecked={this.state.userServices.is_ds_retail_marketing_enabled}
                                                onChange={this.serviceStatusHandler}
                                            />
                                            <span className="slider round" />
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 col-sm-12 M mt-3 border-left">
                        {this.state.showCountries ?
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
            </div >
        );
    }
}
