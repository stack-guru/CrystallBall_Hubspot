import React from 'react';
import { toast } from "react-toastify";
import { Redirect } from "react-router-dom";
import { UncontrolledPopover, Popover, PopoverHeader, PopoverBody } from 'reactstrap';
import LoaderAnimation from "../../utils/LoaderAnimation";
import Countries from "../../utils/Countries";
import HttpClient from "../../utils/HttpClient";
import DSRMDatesSelect from '../../utils/DSRMDatesSelect';
import DSOWMCitiesSelect from '../../utils/DSOWMCitiesSelect';
import DSOWMEventsSelect from '../../utils/DSOWMEventsSelect';
import DSGAUDatesSelect from '../../utils/DSGAUDatesSelect';
import DSGoogleAlertsSelect from '../../utils/DSGoogleAlertsSelect';
import DSWebMonitorsSelect from '../../utils/DSWebMonitorsSelect';
import GoogleAnalyticsPropertySelect from '../../utils/GoogleAnalyticsPropertySelect';

export default class DataSourceIndex extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sectionName: null,
            userDataSources: {},
            userServices: this.props.user,
            isBusy: false,
            isLoading: false,
            errors: '',
            redirectTo: null,
            showHintFor: null,
            ga_property_id: ''
        }
        this.userDataSourceAddHandler = this.userDataSourceAddHandler.bind(this)
        this.userDataSourceDeleteHandler = this.userDataSourceDeleteHandler.bind(this)
        this.serviceStatusHandler = this.serviceStatusHandler.bind(this);

        this.loadUserDataSources = this.loadUserDataSources.bind(this);

        this.sectionToggler = this.sectionToggler.bind(this);

    }

    componentDidMount() {
        document.title = 'Automation';
        this.loadUserDataSources('');
    }
    loadUserDataSources(gaPropertyId) {
        if (!this.state.isLoading) {
            this.setState({ isLoading: true });
            HttpClient.get(`/data-source/user-data-source?ga_property_id=${gaPropertyId}`).then(resp => {
                this.setState({ isLoading: false, userDataSources: resp.data.user_data_sources });
            }, (err) => {
                this.setState({ isLoading: false, errors: (err.response).data });
            }).catch(err => {
                this.setState({ isLoading: false, errors: err });
            })
        }
    }

    serviceStatusHandler(e) {
        e.persist();
        if (e.target.name == 'is_ds_holidays_enabled' && e.target.checked) {
            this.sectionToggler('holidays')
        } else if (e.target.name == 'is_ds_holidays_enabled' && !e.target.checked) {
            this.sectionToggler(null)
        }
        if (e.target.name == 'is_ds_retail_marketing_enabled' && e.target.checked) {
            this.sectionToggler('retail_marketings')
        } else if (e.target.name == 'is_ds_retail_marketing_enabled' && !e.target.checked) {
            this.sectionToggler(null)
        }
        if (e.target.name == 'is_ds_weather_alerts_enabled' && e.target.checked) {
            this.sectionToggler('weather_alerts')
        } else if (e.target.name == 'is_ds_weather_alerts_enabled' && !e.target.checked) {
            this.sectionToggler(null)
        }
        if (e.target.name == 'is_ds_google_alerts_enabled' && e.target.checked) {
            this.sectionToggler('google_alerts')
        } else if (e.target.name == 'is_ds_google_alerts_enabled' && !e.target.checked) {
            this.sectionToggler(null)
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

            this.setState({ isBusy: false, errors: (err.response).data });
            if ((err.response).status == 402) {
                swal("Upgrade to Pro Plan!", "Data Sources are not available in this package.", "warning").then(value => {
                    this.setState({ redirectTo: '/settings/price-plans' });
                })
            }
        }).catch(err => {

            this.setState({ isBusy: false, errors: err });
        });
    }

    userDataSourceAddHandler(dataSource) {
        this.setState({ isBusy: true });
        let formData = {
            'ds_code': dataSource.code,
            'ds_name': dataSource.name,
            'country_name': dataSource.country_name,
            'retail_marketing_id': dataSource.retail_marketing_id,
            'open_weather_map_city_id': dataSource.open_weather_map_city_id,
            'open_weather_map_event': dataSource.open_weather_map_event,
            'status': dataSource.status,
            'value': dataSource.value,
            'is_enabled': 1,
            'ga_property_id': this.state.ga_property_id
        }
        HttpClient.post('/data-source/user-data-source', formData).then(resp => {
            let uds = resp.data.user_data_source;
            let ar = this.state.userDataSources[uds.ds_code];
            if (uds.ds_code == 'google_algorithm_update_dates') { ar = [uds]; } else { ar.push(uds) }
            this.setState({ userDataSources: { ...this.state.userDataSources, [uds.ds_code]: ar }, isBusy: false })
        }, (err) => {

            this.setState({ isBusy: false });
        }).catch(err => {

            this.setState({ isBusy: false });
        })
    }

    userDataSourceDeleteHandler(userDataSourceId, dsCode) {
        this.setState({ isBusy: true });
        HttpClient.delete(`/data-source/user-data-source/${userDataSourceId}`).then(resp => {
            let ar = this.state.userDataSources[dsCode];
            let newAr = ar.filter(a => a.id != userDataSourceId)
            this.setState({ userDataSources: { ...this.state.userDataSources, [dsCode]: newAr }, isBusy: false })
        }, (err) => {

            this.setState({ isBusy: false })
        }).catch(err => {

            this.setState({ isBusy: false })
        })
    }

    changeShownHint(obj) {
        this.setState({ showHintFor: obj })
    }

    sectionToggler(sectionName) {
        if (null == sectionName) {
            this.setState({ sectionName: null })
        } else if (this.state.sectionName == sectionName) {
            this.setState({ sectionName: null })
        } else {
            this.setState({ sectionName: sectionName });
        }
    }

    render() {
        if (this.state.redirectTo) return <Redirect to={this.state.redirectTo} />

        return (
            <div className="container-xl bg-white  d-flex flex-column justify-content-center component-wrapper" style={{ height: '75vh' }}>
                <LoaderAnimation show={this.state.isLoading} />
                <div className="row ml-0 mr-0">
                    <div className="col-4">
                        <h2 className="heading-section gaa-title">Set Automation for:</h2>
                        <GoogleAnalyticsPropertySelect
                            name="ga_property_id"
                            id="ga_property_id"
                            value={this.state.ga_property_id}
                            onChangeCallback={(gAP) => {
                                if (gAP.target.value == "") {
                                    this.setState({ ga_property_id: null });
                                    this.loadUserDataSources(null);
                                } else {
                                    this.setState({ ga_property_id: gAP.target.value });
                                    this.loadUserDataSources(gAP.target.value);
                                }
                            }}
                            placeholder="Select GA Properties"
                            isClearable={true}
                        />
                    </div>
                    <div className="col-3">
                    </div>
                </div>
                <div className="row ml-0 mr-0 mt-4" style={{ height: '55vh' }}>
                    <div className="col-md-8 col-sm-12" id="data-source-page-container" >
                        <hr />
                        <div className="container ds-sections border-bottom">

                            <div className="row ml-0 mr-0 w-100 ">
                                <div className="col-9">
                                    <h4 className="gaa-text-primary">
                                        Website Monitoring
                                        <img id="web-monitors-datasource-hint" className="hint-button-2" onClick={() => { this.changeShownHint('web-monitors') }} src="/images/info-logo.png" />
                                    </h4>
                                    <UncontrolledPopover trigger="legacy" placement="right" isOpen={this.state.showHintFor == 'web-monitors'} target="web-monitors-datasource-hint" toggle={() => { this.changeShownHint(null) }} onClick={() => { this.changeShownHint(null) }}>
                                        <PopoverHeader>Web Monitoring</PopoverHeader>
                                        <PopoverBody>Downtime happens even to the best of us. But it’s important to know it before customers are affected and also keep annotations on your reports. Add your website URL; we will monitor it every 1 minute.</PopoverBody>
                                    </UncontrolledPopover>
                                </div>
                                <div className="col-3 d-flex flex-column justify-content-start align-items-center">
                                    {this.state.userServices.is_ds_web_monitors_enabled ? "Active" : "Deactive"}
                                    <label className="trigger switch">
                                        <input
                                            type="checkbox"
                                            name="is_ds_web_monitors_enabled"
                                            onChange={this.serviceStatusHandler}
                                            checked={this.state.userServices.is_ds_web_monitors_enabled}
                                        />
                                        <span className="slider round" />
                                    </label>
                                </div>
                            </div>
                            <div className="row ml-0 mr-0 w-100">
                                <div className="col-9">
                                    <div className="list-wrapper">
                                    </div>
                                </div>
                                <div className="col-3">
                                    <p className="ds-update-text m-0 text-center"
                                        onClick={() => { this.sectionToggler('web_monitors') }}>
                                        {this.state.sectionName == "web_monitors" ? "Hide" : "Configure Monitors"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="container ds-sections border-bottom">

                            <div className="row ml-0 mr-0 w-100 ">
                                <div className="col-9">
                                    <h4 className="gaa-text-primary">Holidays
                                        <img id="holidays-datasource-hint" className="hint-button-2" onClick={() => { this.changeShownHint('holidays') }} src="/images/info-logo.png" />
                                    </h4>
                                    <UncontrolledPopover trigger="legacy" placement="right" isOpen={this.state.showHintFor == 'holidays'} target="holidays-datasource-hint" toggle={() => { this.changeShownHint(null) }} onClick={() => { this.changeShownHint(null) }}>
                                        <PopoverHeader>Holidays</PopoverHeader>
                                        <PopoverBody>How Christmas Day affect your sells? Add automatic annotations for the Holidays of any country</PopoverBody>
                                    </UncontrolledPopover>
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
                                        onClick={() => { this.sectionToggler('holidays') }}>
                                        {this.state.sectionName == "holidays" ? "Hide" : "Choose Countries"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="container mt-3 ds-sections border-bottom">
                            <div className="ml-0 mr-0 row h-100 w-100">

                                <div className="col-9">
                                    <h4 className="gaa-text-primary">
                                        Wordpress Updates
                                        <img id="wordpress-updates-datasource-hint" className="hint-button-2" onClick={() => { this.changeShownHint('wordpress-updates') }} src="/images/info-logo.png" />
                                    </h4>
                                    <div className="input-group-prepend">
                                        <div className="input-group" style={{ marginTop: "7px" }}>
                                            <input type="checkbox" style={{ position: 'absolute', top: '3px' }}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        this.userDataSourceAddHandler({ code: 'wordpress_updates', name: 'WordpressUpdate', country_name: null, retail_marketing_id: null, value: 'last year' })
                                                    } else {
                                                        this.userDataSourceDeleteHandler(this.state.userDataSources.wordpress_updates[0].id, 'wordpress_updates')
                                                    }
                                                }}
                                                checked={this.state.userDataSources.wordpress_updates && this.state.userDataSources.wordpress_updates.length > 0}
                                                name="last_year_only" />
                                            <h6 style={{ position: 'absolute', top: '0px', left: '10px' }}> &nbsp;&nbsp; Show last year only</h6>
                                        </div>
                                    </div>
                                    <UncontrolledPopover trigger="legacy" placement="right" isOpen={this.state.showHintFor == 'wordpress-updates'} target="wordpress-updates-datasource-hint" toggle={() => { this.changeShownHint(null) }}>
                                        <PopoverHeader>WordPress Core Updates</PopoverHeader>
                                        <PopoverBody>WordPress Core Updates: Our automated annotation feature will inform you when a new version, Security, or Maintenance Release of WordPress is available.</PopoverBody>
                                    </UncontrolledPopover>
                                </div>
                                <div className="col-3  d-flex flex-column justify-content-start align-items-center">
                                    {this.state.userServices.is_ds_wordpress_updates_enabled ? "Active" : "Deactive"}
                                    <label className="trigger switch">
                                        <input type="checkbox"
                                            checked={this.state.userServices.is_ds_wordpress_updates_enabled}
                                            onChange={this.serviceStatusHandler}
                                            name="is_ds_wordpress_updates_enabled"
                                        />
                                        <span className="slider round" />
                                    </label>
                                </div>
                                <div className="row ml-0 mr-0 w-100">
                                    <div className="col-8">

                                    </div>
                                    <div className="col-4">

                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="container mt-3 ds-sections border-bottom">
                            <div className="ml-0 mr-0 row h-100 w-100">

                                <div className="col-9">
                                    <h4 className="gaa-text-primary">
                                        Google Updates
                                        <img id="google-updates-datasource-hint" className="hint-button-2" onClick={() => { this.changeShownHint('google-updates') }} src="/images/info-logo.png" />
                                    </h4>
                                    <UncontrolledPopover trigger="legacy" placement="right" isOpen={this.state.showHintFor == 'google-updates'} target="google-updates-datasource-hint" toggle={() => { this.changeShownHint(null) }}>
                                        <PopoverHeader>Google Algorithm Updates</PopoverHeader>
                                        <PopoverBody>Most of these Google updates are so slight that they go completely unnoticed. However, on occasion, the search engine rolls out major algorithmic updates that significantly impact the Search Engine Results Pages</PopoverBody>
                                    </UncontrolledPopover>
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
                                <div className="row ml-0 mr-0 w-100">
                                    <div className="col-8">

                                    </div>
                                    <div className="col-4">
                                        <p
                                            className="ds-update-text m-0 text-center"
                                            onClick={() => { this.sectionToggler('google_algorithm_updates'); }}
                                        >
                                            {this.state.sectionName == "google_algorithm_updates" ? "Hide" : "Confirmed/Unconfirmed"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="container mt-3 ds-sections border-bottom">
                            <div className="row ml-0 mr-0 w-100">
                                <div className="col-9">
                                    <h4 className="gaa-text-primary">
                                        News Alerts
                                        <img id="google-alert-datasource-hint" className="hint-button-2" onClick={() => { this.changeShownHint('google-alert') }} src="/images/info-logo.png" />
                                    </h4>
                                    <UncontrolledPopover trigger="legacy" placement="right" isOpen={this.state.showHintFor == 'google-alert'} target="google-alert-datasource-hint" toggle={() => { this.changeShownHint(null) }}>
                                        <PopoverHeader>News Alerts</PopoverHeader>
                                        <PopoverBody><strong>News Alerts</strong>Is a content change detection feature on the web. GAannotations add annotations that match the user's search terms, such as web pages, newspaper articles, blogs, or scientific research. Add keywords like https://www.domain.com/, Company Name. The system will search for news once a day at midnight.</PopoverBody>
                                    </UncontrolledPopover>
                                </div>
                                <div className="col-3 d-flex flex-column justify-content-start align-items-center">
                                    {this.state.userServices.is_ds_google_alerts_enabled ? "Active" : "Deactive"}
                                    <label className="trigger switch">
                                        <input
                                            type="checkbox"
                                            name="is_ds_google_alerts_enabled"
                                            onChange={this.serviceStatusHandler}
                                            checked={this.state.userServices.is_ds_google_alerts_enabled}
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

                                                <dt>Keywords:</dt>
                                                {this.state.userDataSources.google_alert_keywords
                                                    ? this.state.userDataSources.google_alert_keywords.map(keyword => (
                                                        <dd className="mx-2" key={keyword.id}>{keyword.value}</dd>
                                                    ))
                                                    : <dd className="mx-2">no keyword added</dd>
                                                }

                                            </dl> : null}
                                    </div>
                                </div>
                                <div className="col-3">
                                    <p
                                        className="ds-update-text m-0 text-center"
                                        onClick={() => { this.sectionToggler('google_alerts'); }}
                                    >
                                        {this.state.sectionName == "google_alerts" ? "Hide" : "Choose Keywords"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="container mt-3 ds-sections border-bottom">
                            <div className="row ml-0 mr-0 w-100">
                                <div className="col-9">
                                    <h4 className="gaa-text-primary">
                                        Retail Marketing Dates
                                        <img id="retail-marketing-datasource-hint" className="hint-button-2" onClick={() => { this.changeShownHint('retail-marketing') }} src="/images/info-logo.png" />
                                    </h4>
                                    <UncontrolledPopover trigger="legacy" placement="right" isOpen={this.state.showHintFor == 'retail-marketing'} target="retail-marketing-datasource-hint" toggle={() => { this.changeShownHint(null) }}>
                                        <PopoverHeader>Retail Marketing Dates</PopoverHeader>
                                        <PopoverBody>If you run an ecommerce business, you know the drill: Having a promotional calendar for marketing and shopping events is key to deliver on your sales targets. Add automated annotations to see how affected your site.</PopoverBody>
                                    </UncontrolledPopover>
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
                                        onClick={() => { this.sectionToggler('retail_marketings'); }}
                                    >
                                        {this.state.sectionName == "retail_marketings" ? "Hide" : "Choose Dates"}
                                    </p>
                                </div>
                            </div>

                        </div>

                        <div className="container mt-3 ds-sections border-bottom">
                            <div className="row ml-0 mr-0 w-100">
                                <div className="col-9">
                                    <h4 className="gaa-text-primary">
                                        Weather Alerts
                                        <img id="weather-alert-datasource-hint" className="hint-button-2" onClick={() => { this.changeShownHint('weather-alert') }} src="/images/info-logo.png" />
                                    </h4>
                                    <UncontrolledPopover trigger="legacy" placement="right" isOpen={this.state.showHintFor == 'weather-alert'} target="weather-alert-datasource-hint" toggle={() => { this.changeShownHint(null) }}>
                                        <PopoverHeader>Weather Alerts</PopoverHeader>
                                        <PopoverBody><strong>Weather</strong> disrupts the operating and financial performance of 70% of businesses worldwide. Add automated annotations for the location you operate </PopoverBody>
                                    </UncontrolledPopover>
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
                                                        owmc.open_weather_map_city ?
                                                            <dd className="mx-2" key={owmc.id}>{owmc.open_weather_map_city.name}, {owmc.open_weather_map_city.country_name}</dd>
                                                            : null
                                                    ))
                                                    : <dd className="mx-2">no city added</dd>
                                                }
                                            </dl> : null}
                                    </div>

                                </div>
                                <div className="col-3">
                                    <p
                                        className="ds-update-text m-0 text-center"
                                        onClick={() => { this.sectionToggler('weather_alerts') }}
                                    >
                                        {this.state.sectionName == "weather_alerts" ? "Hide" : "Choose Cities"}
                                    </p>
                                    <p
                                        className="ds-update-text m-0 text-center"
                                        onClick={() => { this.sectionToggler('open_weather_map_events') }}
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
                    <div className="col-md-4 col-sm-12 border-left" id="data-source-detail-container">
                        {
                            this.state.sectionName == 'holidays' && this.state.userDataSources ?
                                <Countries
                                    onCheckCallback={this.userDataSourceAddHandler}
                                    onUncheckCallback={this.userDataSourceDeleteHandler}
                                    ds_data={this.state.userDataSources.holidays}
                                />
                                : null
                        }
                        {
                            this.state.sectionName == 'retail_marketings' && this.state.userDataSources ?
                                <DSRMDatesSelect
                                    onCheckCallback={this.userDataSourceAddHandler}
                                    onUncheckCallback={this.userDataSourceDeleteHandler}
                                    ds_data={this.state.userDataSources.retail_marketings}
                                />
                                : null
                        }
                        {
                            this.state.sectionName == 'weather_alerts' && this.state.userDataSources ?
                                <DSOWMCitiesSelect
                                    onCheckCallback={this.userDataSourceAddHandler}
                                    onUncheckCallback={this.userDataSourceDeleteHandler}
                                    ds_data={this.state.userDataSources.open_weather_map_cities}
                                />
                                : null
                        }
                        {
                            this.state.sectionName == 'open_weather_map_events' && this.state.userDataSources ?
                                <DSOWMEventsSelect
                                    onCheckCallback={this.userDataSourceAddHandler}
                                    onUncheckCallback={this.userDataSourceDeleteHandler}
                                    ds_data={this.state.userDataSources.open_weather_map_events}
                                />
                                : null
                        }
                        {
                            this.state.sectionName == 'google_algorithm_updates' && this.state.userDataSources ?
                                <DSGAUDatesSelect
                                    onCheckCallback={this.userDataSourceAddHandler}
                                    onUncheckCallback={this.userDataSourceDeleteHandler}
                                    ds_data={this.state.userDataSources.google_algorithm_update_dates}
                                />
                                : null
                        }
                        {
                            this.state.sectionName == 'google_alerts' && this.state.userDataSources ?
                                <DSGoogleAlertsSelect
                                    onCheckCallback={this.userDataSourceAddHandler}
                                    onUncheckCallback={this.userDataSourceDeleteHandler}
                                    ds_data={this.state.userDataSources.google_alert_keywords}
                                />
                                : null
                        }
                        {
                            this.state.sectionName == 'web_monitors' && this.state.userDataSources ?
                                <DSWebMonitorsSelect
                                    onCheckCallback={this.userDataSourceAddHandler}
                                    onUncheckCallback={this.userDataSourceDeleteHandler}
                                    ga_property_id={this.state.ga_property_id}
                                />
                                : null
                        }
                    </div>
                </div>
            </div>
        );
    }
}
