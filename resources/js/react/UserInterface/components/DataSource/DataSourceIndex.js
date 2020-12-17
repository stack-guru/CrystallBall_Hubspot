import React from 'react';

require('../../Main.css');
import Countries from "../../utils/Countries";
import HttpClient from "../../utils/HttpClient";
import { toast } from "react-toastify";
import DSRMDatesSelect from '../../utils/DSRMDatesSelect';

export default class DataSourceIndex extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sectionName: null,
            userDataSources: null,
            userServices: this.props.user,
            isBusy: false,
            errors: '',
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
                this.setState({ isBusy: false, errors: err.response });
                console.log(err)
            }).catch(err => {
                console.log(err)
                this.setState({ isBusy: false, errors: err });
            })
        }
    }

    serviceStatusHandler(e) {
        e.persist();
        if (e.target.name == 'is_ds_holidays_enabled' && !e.target.defaultChecked) {
            this.setState({ sectionName: 'holidays' })
        } else if (e.target.name == 'is_ds_holidays_enabled' && e.target.defaultChecked) {
            this.setState({ sectionName: null })
        }
        if (e.target.name == 'is_ds_retail_marketing_enabled' && !e.target.defaultChecked) {
            this.setState({ sectionName: 'retail_marketings' })
        } else if (e.target.name == 'is_ds_retail_marketing_enabled' && e.target.defaultChecked) {
            this.setState({ sectionName: null })
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

    userDataSourceAddHandler(dataSource) {
        let formData = {
            'ds_code': dataSource.code,
            'ds_name': dataSource.name,
            'country_name': dataSource.country_name,
            'retail_marketing_id': dataSource.retail_marketing_id,
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
        if (this.state.userDataSources == null) return null;

        let holidayCountries = this.state.userDataSources.holidays;

        return (
            <div className="container-xl bg-white  d-flex flex-column justify-content-center component-wrapper">
                <div className="row ml-0 mr-0">
                    <div className="col-12">
                        <h2 className="heading-section gaa-title">Data Source</h2>
                    </div>
                </div>
                <div className="row ml-0 mr-0 mt-4">
                    <div className="col-md-8 col-sm-12 M">

                        <div className="container ds-sections border-bottom">

                                    <div className="row ml-0 mr-0 w-100 ">
                                        <div className="col-9">
                                            <h4 className="gaa-text-primary">Holidays</h4>
                                        </div>
                                        <div className="col-3 d-flex flex-column justify-content-start align-items-center">
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
                                                    {holidayCountries
                                                        ? holidayCountries.map(country => (
                                                            <dd className="mx-2" key={country.id}>{country.country_name}</dd>
                                                        ))
                                                        : <dd className="mx-2">no country added</dd>
                                                    }

                                                </dl>
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

                        <div className="container mt-3 ds-sections border-bottom">
                            <div className="ml-0 mr-0 row h-100 w-100">

                                    <div className="col-9">
                                        <h4 className="gaa-text-primary">Google Updates</h4>
                                    </div>
                                    <div className="col-3  d-flex flex-column justify-content-start align-items-center">
                                        <label className="trigger switch">
                                            <input type="checkbox"
                                                defaultChecked={this.state.userServices.is_ds_google_algorithm_updates_enabled}
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
                                            <label className="trigger switch">
                                                <input
                                                    type="checkbox"
                                                    name="is_ds_retail_marketing_enabled"
                                                    onChange={this.serviceStatusHandler}
                                                    defaultChecked={this.state.userServices.is_ds_retail_marketing_enabled}
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



                    </div>
                    <div className="col-md-4 col-sm-12 M mt-3 border-left">
                        {this.state.sectionName == 'holidays' ?
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
                        {this.state.sectionName == 'retail_marketings' ?
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
                    </div>
                </div>
            </div >
        );
    }
}
