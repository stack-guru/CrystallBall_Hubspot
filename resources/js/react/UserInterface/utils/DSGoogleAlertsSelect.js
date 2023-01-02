import React from 'react';
import GoogleAnalyticsPropertySelect from './GoogleAnalyticsPropertySelect';

export default class DSGoogleAlertsSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isBusy: false,
            errors: '',
            keyword: ''
        }

        this.addKeyword = this.addKeyword.bind(this)
        this.deleteKeyword = this.deleteKeyword.bind(this)

    }

    addKeyword(e) {
        this.setState({ keyword: '' });
        (this.props.onCheckCallback)({ code: 'google_alert_keywords', name: 'GoogleAlertKeyword', country_name: null, retail_marketing_id: null, open_weather_map_event: null, value: e.target.getAttribute('value') })
    }

    deleteKeyword(e) {
        (this.props.onUncheckCallback)(e.target.getAttribute('user_data_source_id'), 'google_alert_keywords')
    }

    render() {

        return (
            <div className="switch-wrapper">

                <div className="weather_alert_cities-form">
                    <h4 className="gaa-text-primary">
                        Manage keywords
                </h4>
                    <div className="input-group search-input-box mb-3">
                        <input
                            type="text"
                            className="form-control search-input"
                            placeholder="Add keywords to get alerted"
                            value={this.state.keyword}
                            name="keyword"
                            onChange={(e) => this.setState({ [e.target.name]: e.target.value.toLowerCase() })}
                            onKeyUp={(e) => { if (e.keyCode === 13) { e.persist(); this.addKeyword(e); } }}
                        />
                        <div className="input-group-append">
                            <i className="ti-plus"></i>
                        </div>
                        FOR
                        <GoogleAnalyticsPropertySelect
                            name="ga_property_id"
                            id="ga_property_id"
                            currentPricePlan={this.props.user.price_plan}
                            value={this.props.ga_property_id}
                            onChangeCallback={(gAP) => {
                                if (gAP.target.value == "") {
                                    this.props.updateGAPropertyId(null);
                                    this.props.loadUserDataSources(null);
                                    this.props.reloadWebMonitors(null);
                                } else {
                                    this.props.updateGAPropertyId(gAP.target.value);
                                    this.props.loadUserDataSources(gAP.target.value);
                                    this.props.reloadWebMonitors(gAP.target.value);
                                }
                            }}
                            components={{
                                DropdownIndicator: () => null,
                                IndicatorSeparator: () => null,
                            }}
                            placeholder="Select GA Properties"
                            isClearable={true}
                        />

                    </div>
                    <div className="checkbox-box mt-3">
                        {
                            this.props.ds_data?.map(gAK => {
                                return (
                                    <button type="button" className="btn gaa-btn-primary m-2" key={gAK.id}
                                        user_data_source_id={gAK.id}
                                        onClick={this.deleteKeyword}
                                    >
                                        {gAK.value} <span className="badge badge-light" user_data_source_id={gAK.id}>&times;</span>
                                    </button>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        );
    }
}
