import React from 'react';
import { toast } from "react-toastify";
import { Redirect } from "react-router-dom";

import Countries from "../../utils/Countries";
import HttpClient from "../../utils/HttpClient";
import DSRMDatesSelect from '../../utils/DSRMDatesSelect';
import DSOWMCitiesSelect from '../../utils/DSOWMCitiesSelect';
import DSOWMEventsSelect from '../../utils/DSOWMEventsSelect';

export default class DataSourceIndex extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sectionName: null,
            userDataSources: {},
            userServices: this.props.user,
            isBusy: false,
            errors: '',
            redirectTo: null,
        }
        this.userDataSourceAddHandler = this.userDataSourceAddHandler.bind(this)
        this.userDataSourceDeleteHandler = this.userDataSourceDeleteHandler.bind(this)
        this.serviceStatusHandler = this.serviceStatusHandler.bind(this);
    }

    componentDidMount() {
        document.title = 'Data Source';
        if (!this.state.isBusy) {
            HttpClient.get('/user-data-source').then(resp => {
                this.setState({ isBusy: false, userDataSources: resp.data.user_data_sources });
            }, (err) => {
                this.setState({ isBusy: false, errors: (err.response).data });
                console.log(err)
            }).catch(err => {
                console.log(err)
                this.setState({ isBusy: false, errors: err });
            })
        }
    }

    serviceStatusHandler(e) {
        e.persist();
        if (e.target.name == 'is_ds_holidays_enabled' && e.target.checked) {
            window.scroll(0, 0);
            this.setState({ sectionName: 'holidays' })
        } else if (e.target.name == 'is_ds_holidays_enabled' && !e.target.checked) {
            this.setState({ sectionName: null })
        }
        if (e.target.name == 'is_ds_retail_marketing_enabled' && e.target.checked) {
            window.scroll(0, 0);
            this.setState({ sectionName: 'retail_marketings' })
        } else if (e.target.name == 'is_ds_retail_marketing_enabled' && !e.target.checked) {
            this.setState({ sectionName: null })
        }
        if (e.target.name == 'is_ds_weather_alerts_enabled' && e.target.checked) {
            window.scroll(0, 0);
            this.setState({ sectionName: 'weather_alerts' })
        } else if (e.target.name == 'is_ds_weather_alerts_enabled' && !e.target.checked) {
            this.setState({ sectionName: null })
        }
        HttpClient.post('/userService', { [e.target.name]: e.target.checked ? 1 : 0 }).then(resp => {
            if (resp.data.user_services[e.target.name] == 1) {
                toast.success("Service activated successfully.");
                this.setState({ userServices: resp.data.user_services })
            }
            if (resp.data.user_services[e.target.name] == 0) {
                this.setState({ userServices: resp.data.user_services })
                toast.info("Service deactivated successfully.");
            }
            (this.props.reloadUser)();
        }, (err) => {
            console.log(err);
            this.setState({ isBusy: false, errors: (err.response).data });
            if ((err.response).status == 402) {
                swal("Upgrade to Pro Plan!", "Data Sources are not available in this package.", "warning").then(value => {
                    this.setState({ redirectTo: '/settings/price-plans' });
                })
            }
        }).catch(err => {
            console.log(err)
            this.setState({ isBusy: false, errors: err });
        });
    }

    userDataSourceAddHandler(dataSource) {
        let formData = {
            'ds_code': dataSource.code,
            'ds_name': dataSource.name,
            'country_name': dataSource.country_name,
            'retail_marketing_id': dataSource.retail_marketing_id,
            'open_weather_map_city_id': dataSource.open_weather_map_city_id,
            'open_weather_map_event': dataSource.open_weather_map_event,
            'is_enabled': 1,
        }
        HttpClient.post('/user-data-source', formData).then(resp => {
            let uds = resp.data.user_data_source;
            let ar = this.state.userDataSources[uds.ds_code];
            ar.push(uds)
            this.setState({ userDataSources: { ...this.state.userDataSources, [uds.ds_code]: ar } })
        }, (err) => {
            console.log(err)
        }).catch(err => {
            console.log(err)
        })
    }

    userDataSourceDeleteHandler(userDataSourceId, dsCode) {
        HttpClient.delete(`/user-data-source/${userDataSourceId}`).then(resp => {
            let ar = this.state.userDataSources[dsCode];
            let newAr = ar.filter(a => a.id != userDataSourceId)
            this.setState({ userDataSources: { ...this.state.userDataSources, [dsCode]: newAr } })
        }, (err) => {
            console.log(err)
        }).catch(err => {
            console.log(err)
        })
    }

    render() {
        if (this.state.redirectTo) return <Redirect to={this.state.redirectTo} />

        return (
            <div className="container-xl bg-white  d-flex flex-column justify-content-center component-wrapper">
                <div className="row ml-0 mr-0">
                    <div className="col-12">
                        <h2 className="heading-section gaa-title">Data Source</h2>
                    </div>
                </div>
                <div className="row ml-0 mr-0 mt-4">
                    <div className="col-md-8 col-sm-12" id="data-source-page-container">

                        <div className="container ds-sections border-bottom">

                            <div className="row ml-0 mr-0 w-100 ">
                                <div className="col-9">
                                    <h4 className="gaa-text-primary">Holidays</h4>
                                </div>
                                <div className="col-3 d-flex flex-column justify-content-start align-items-center">
                                    {this.state.userServices.is_ds_holidays_enabled ? "Active" : "Deactive"}
                                    <label className="trigger switch">
                                        <input
                                            type="checkbox"
                                            name="is_ds_holidays_enabled"
                                            onChange={this.serviceStatusHandler}
                                            checked={this.state.userServices.is_ds_holidays_enabled}
                                        />
                                        <span className="slider round" />
                                    </label>
                                </div>
                            </div>
                            <div className="row ml-0 mr-0 w-100">
                                <div className="col-9">
                                    <div className="list-wrapper">
                                        {this.state.userDataSources.holidays ?
                                            <dl className="d-flex flex-row flex-wrap userCountryList">

                                                <dt>Annotations for:</dt>
                                                {this.state.userDataSources.holidays
                                                    ? this.state.userDataSources.holidays.map(country => (
                                                        <dd className="mx-2" key={country.id}>{country.country_name}</dd>
                                                    ))
                                                    : <dd className="mx-2">no country added</dd>
                                                }

                                            </dl> : null}
                                    </div>
                                </div>
                                <div className="col-3">
                                    <p className="ds-update-text m-0 text-center"
                                        onClick={() => { this.setState({ sectionName: this.state.sectionName == "holidays" ? null : "holidays" }) }}>
                                        {this.state.sectionName == "holidays" ? "Hide" : "Choose Countries"}
                                    </p>
                                </div>
                            </div>

                        </div>

                        <div className="container mt-3 ds-sections border-bottom">
                            <div className="ml-0 mr-0 row h-100 w-100">

                                <div className="col-9">
                                    <h4 className="gaa-text-primary">Google Updates</h4>
                                </div>
                                <div className="col-3  d-flex flex-column justify-content-start align-items-center">
                                    {this.state.userServices.is_ds_google_algorithm_updates_enabled ? "Active" : "Deactive"}
                                    <label className="trigger switch">
                                        <input type="checkbox"
                                            checked={this.state.userServices.is_ds_google_algorithm_updates_enabled}
                                            onChange={this.serviceStatusHandler}
                                            name="is_ds_google_algorithm_updates_enabled"
                                        />
                                        <span className="slider round" />
                                    </label>
                                </div>

                            </div>
                        </div>

                        <div className="container mt-3 ds-sections border-bottom">
                            <div className="row ml-0 mr-0 w-100">
                                <div className="col-9">
                                    <h4 className="gaa-text-primary">Retail Marketing Dates</h4>
                                </div>
                                <div className="col-3 d-flex flex-column justify-content-start align-items-center">
                                    {this.state.userServices.is_ds_retail_marketing_enabled ? "Active" : "Deactive"}
                                    <label className="trigger switch">
                                        <input
                                            type="checkbox"
                                            name="is_ds_retail_marketing_enabled"
                                            onChange={this.serviceStatusHandler}
                                            checked={this.state.userServices.is_ds_retail_marketing_enabled}
                                        />
                                        <span className="slider round" />
                                    </label>
                                </div>
                            </div>
                            <div className="row ml-0 mr-0 w-100">
                                <div className="col-9">

                                </div>
                                <div className="col-3">
                                    <p
                                        className="ds-update-text m-0 text-center"
                                        onClick={() => { this.setState({ sectionName: this.state.sectionName == "retail_marketings" ? null : "retail_marketings" }) }}
                                    >
                                        {this.state.sectionName == "retail_marketings" ? "Hide" : "Choose Dates"}
                                    </p>
                                </div>
                            </div>

                        </div>

                        <div className="container mt-3 ds-sections border-bottom">
                            <div className="row ml-0 mr-0 w-100">
                                <div className="col-9">
                                    <h4 className="gaa-text-primary">Weather Alerts</h4>
                                </div>
                                <div className="col-3 d-flex flex-column justify-content-start align-items-center">
                                    {this.state.userServices.is_ds_weather_alerts_enabled ? "Active" : "Deactive"}
                                    <label className="trigger switch">
                                        <input
                                            type="checkbox"
                                            name="is_ds_weather_alerts_enabled"
                                            onChange={this.serviceStatusHandler}
                                            checked={this.state.userServices.is_ds_weather_alerts_enabled}
                                        />
                                        <span className="slider round" />
                                    </label>
                                </div>
                            </div>
                            <div className="row ml-0 mr-0 w-100">
                                <div className="col-9">

                                    <div className="list-wrapper">
                                        {this.state.userDataSources.open_weather_map_cities ?
                                            <dl className="d-flex flex-row flex-wrap userCountryList">
                                                <dt>Alerts for:</dt>
                                                {this.state.userDataSources.open_weather_map_cities
                                                    ? this.state.userDataSources.open_weather_map_cities.map(owmc => (
                                                        <dd className="mx-2" key={owmc.id}>{owmc.open_weather_map_city.name}, {owmc.open_weather_map_city.country_name}</dd>
                                                    ))
                                                    : <dd className="mx-2">no city added</dd>
                                                }
                                            </dl> : null}
                                    </div>

                                </div>
                                <div className="col-3">
                                    <p
                                        className="ds-update-text m-0 text-center"
                                        onClick={() => { this.setState({ sectionName: this.state.sectionName == "weather_alerts" ? null : "weather_alerts" }) }}
                                    >
                                        {this.state.sectionName == "weather_alerts" ? "Hide" : "Choose Cities"}
                                    </p>
                                    <p
                                        className="ds-update-text m-0 text-center"
                                        onClick={() => { this.setState({ sectionName: this.state.sectionName == "open_weather_map_events" ? null : "open_weather_map_events" }) }}
                                    >
                                        {this.state.sectionName == "open_weather_map_events" ? "Hide" : "Choose Events"}
                                    </p>
                                </div>
                            </div>

                        </div>

                        {/* <div className="container mt-3 ds-sections border-bottom">
                            <div className="row ml-0 mr-0 w-100">
                                <div className="col-9">
                                    <h4 className="gaa-text-primary">Google Ads History</h4>
                                </div>
                                <div className="col-3 d-flex flex-column justify-content-start align-items-center">
                                    {this.state.userServices.is_ds_google_ads_history_enabled ? "Active" : "Deactive"}
                                    <label className="trigger switch">
                                        <input
                                            type="checkbox"
                                            name="is_ds_google_ads_history_enabled"
                                            onChange={() => { swal("Coming soon!", '', 'info'); }}
                                            checked={this.state.userServices.is_ds_google_ads_history_enabled}
                                        />
                                        <span className="slider round" />
                                    </label>
                                </div>
                            </div>
                            <div className="row ml-0 mr-0 w-100">
                                <div className="col-9">

                                </div>
                                <div className="col-3">
                                    <p
                                        className="ds-update-text m-0 text-center"
                                        onClick={() => { this.setState({ sectionName: this.state.sectionName == "google_ads_history" ? null : "google_ads_history" }) }}
                                    >
                                    </p>
                                </div>
                            </div>

                        </div> */}
                    </div>
                    <div className="col-md-4 col-sm-12 mt-3 border-left">
                        {
                            this.state.sectionName == 'holidays' && this.state.userDataSources ?
                                <div className="switch-wrapper">
                                    <Countries
                                        sectionTitle={this.state.sectionName}
                                        onCheckCallback={this.userDataSourceAddHandler}
                                        onUncheckCallback={this.userDataSourceDeleteHandler}
                                        ds_data={this.state.userDataSources.holidays}
                                    />
                                </div>
                                : null
                        }
                        {
                            this.state.sectionName == 'retail_marketings' && this.state.userDataSources ?
                                <div className="switch-wrapper">
                                    <DSRMDatesSelect
                                        sectionTitle={this.state.sectionName}
                                        onCheckCallback={this.userDataSourceAddHandler}
                                        onUncheckCallback={this.userDataSourceDeleteHandler}
                                        ds_data={this.state.userDataSources.retail_marketings}
                                    />
                                </div>
                                : null
                        }
                        {
                            this.state.sectionName == 'weather_alerts' && this.state.userDataSources ?
                                <div className="switch-wrapper">
                                    <DSOWMCitiesSelect
                                        sectionTitle={this.state.sectionName}
                                        onCheckCallback={this.userDataSourceAddHandler}
                                        onUncheckCallback={this.userDataSourceDeleteHandler}
                                        ds_data={this.state.userDataSources.open_weather_map_cities}
                                    />
                                </div>
                                : null
                        }
                        {
                            this.state.sectionName == 'open_weather_map_events' && this.state.userDataSources ?
                                <div className="switch-wrapper">
                                    <DSOWMEventsSelect
                                        sectionTitle={this.state.sectionName}
                                        onCheckCallback={this.userDataSourceAddHandler}
                                        onUncheckCallback={this.userDataSourceDeleteHandler}
                                        ds_data={this.state.userDataSources.open_weather_map_events}
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
