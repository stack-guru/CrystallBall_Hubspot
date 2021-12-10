import React, { Component } from 'react';
import { DateRange } from 'react-date-range';

import HttpClient from '../../../utils/HttpClient';
import AnnotationsTable from './tables/annotationsTable';
import MediaGraph from './graphs/mediaGraph';
import GoogleAnalyticsPropertySelect from './utils/GoogleAnalyticsPropertySelect';
import ErrorAlert from '../../../utils/ErrorAlert';
import NoGoogleAccountConnectedPage from './subPages/NoGoogleAccountConnectedPage';
import UsersDaysWithAnnotationsGraph from './graphs/usersDaysWithAnnotationsGraph';
import NoDataFoundPage from './subPages/NoDataFoundPage';
import { timezoneToDateFormat } from '../../../utils/TimezoneTodateFormat';

export default class IndexAnalytics extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isBusy: false,
            showDateRangeSelect: false,
            googleAccount: undefined,
            usersDaysStatistics: [],
            annotations: [],
            mediaStatistics: [],
            sourcesStatistics: [],
            deviceCategoriesStatistics: [],
            startDate: moment().subtract(14, 'days').format('YYYY-MM-DD'),
            endDate: moment().subtract(1, 'days').format('YYYY-MM-DD'),
            ga_property_id: '*',
            statisticsPaddingDays: 7,
            errors: undefined
        };

        this.fetchStatistics = this.fetchStatistics.bind(this);
        this.fetchUsersDaysAnnotations = this.fetchUsersDaysAnnotations.bind(this);
        this.changeStatisticsPaddingDays = this.changeStatisticsPaddingDays.bind(this);
    }

    componentDidMount() {
    }



    render() {

        if (!this.props.user.google_accounts_count) return <NoGoogleAccountConnectedPage />

        return <div className="container-xl bg-white anno-container  d-flex flex-column justify-content-center component-wrapper" >
            <section className="ftco-section" id="inputs">
                <div className="container-xl p-0">
                    <div className="row ml-0 mr-0 mb-1">
                        <div className="col-md-12">
                            <h2 className="heading-section gaa-title">Dashboard</h2>
                        </div>
                    </div>
                    <div id="dashboard-index-container">
                        <div className="row">
                            <div className="col-md-12">
                                <ErrorAlert errors={this.state.errors} />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12" >
                                Date range:
                                &nbsp;&nbsp;&nbsp;
                                <button className="btn thin-light-gray-border text-black" onClick={() => { this.setState({ showDateRangeSelect: !this.state.showDateRangeSelect }); }}>
                                    From: {moment(this.state.startDate).format(timezoneToDateFormat(this.props.user.timezone))}
                                    &nbsp;&nbsp;&nbsp;
                                    To: {moment(this.state.endDate).format(timezoneToDateFormat(this.props.user.timezone))}
                                    &nbsp;
                                    <i className="fa fa-chevron-down"></i>
                                </button>
                                {
                                    this.state.showDateRangeSelect ?
                                        <DateRange
                                            style={{ 'position': 'absolute', backgroundColor: 'white', zIndex: 9999999999999 }}
                                            editableDateInputs={true}
                                            moveRangeOnFirstSelection={false}
                                            ranges={[{
                                                startDate: new Date(this.state.startDate),
                                                endDate: new Date(this.state.endDate),
                                                key: 'selection',
                                            }]}
                                            onChange={(ranges) => {
                                                this.setState({
                                                    startDate: moment(ranges.selection.startDate).format("YYYY-MM-DD"),
                                                    endDate: moment(ranges.selection.endDate).format("YYYY-MM-DD"),
                                                    showDateRangeSelect: moment(ranges.selection.startDate).format("YYYY-MM-DD") == moment(ranges.selection.endDate).format("YYYY-MM-DD")
                                                }, () => {
                                                    if (moment(ranges.selection.startDate).format("YYYY-MM-DD") !== moment(ranges.selection.endDate).format("YYYY-MM-DD")) {
                                                        this.fetchStatistics(this.state.ga_property_id);
                                                    }
                                                });
                                            }}
                                        />
                                        :
                                        null
                                }
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col-1" >
                                Property:
                            </div>
                            <div className="col-3" >
                                <GoogleAnalyticsPropertySelect
                                    name="ga_property_id"
                                    id="ga_property_id"
                                    value={this.state.ga_property_id}
                                    onChangeCallback={(event) => { this.setState({ ga_property_id: event.target.value }); this.fetchStatistics(event.target.value); }} placeholder="Select GA Properties"
                                    components={{ IndicatorSeparator: () => null }}
                                    autoSelectFirst
                                />
                            </div>
                        </div>
                        {
                            this.state.usersDaysStatistics.length ?
                                <React.Fragment>
                                    {/* <UsersDaysGraph statistics={this.state.usersDaysStatistics} /> */}
                                    <UsersDaysWithAnnotationsGraph statistics={this.state.usersDaysStatistics} />
                                    <AnnotationsTable user={this.props.user} annotations={this.state.annotations} satisticsPaddingDaysCallback={this.changeStatisticsPaddingDays} statisticsPaddingDays={this.state.statisticsPaddingDays} />
                                    <MediaGraph statistics={this.state.mediaStatistics} />
                                    <div className="row mt-4">
                                        <div className="col-6" style={{ maxHeight: '300px', overflowY: 'scroll' }}>
                                            <table className="table table-bordered table-hover">
                                                <thead><tr><th></th><th>Source</th><th>Users</th><th>Conversion Rate</th></tr></thead>
                                                <tbody>
                                                    {
                                                        this.state.sourcesStatistics.map(sS => {
                                                            const conversionRate = sS.sum_conversions_count && sS.sum_users_count ? ((sS.sum_conversions_count / sS.sum_users_count) * 100).toFixed(2) : 0;
                                                            return <tr>
                                                                <td><img height="25px" width="25px" src={`https://${sS.source_name}/favicon.ico`} onError={(e) => { e.target.remove(); }} /></td>
                                                                <td>{sS.source_name}</td>
                                                                <td>{sS.sum_users_count}</td>
                                                                <td>{conversionRate}</td>
                                                            </tr>
                                                        })
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="col-6" style={{ maxHeight: '300px', overflowY: 'scroll' }}>
                                            <table className="table table-bordered table-hover">
                                                <thead><tr><th>Device</th><th>Users</th><th>Conversion Rate</th></tr></thead>
                                                <tbody>
                                                    {
                                                        this.state.deviceCategoriesStatistics.map(dS => {
                                                            const conversionRate = dS.sum_conversions_count && dS.sum_users_count ? ((dS.sum_conversions_count / dS.sum_users_count) * 100).toFixed(2) : 0;
                                                            return <tr><td>{dS.device_category}</td><td>{dS.sum_users_count}</td><td>{conversionRate}</td></tr>
                                                        })
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </React.Fragment>
                                :
                                <NoDataFoundPage googleAccount={this.state.googleAccount} />
                        }
                    </div>
                </div>

            </section>
        </div >;
    }

    fetchStatistics(gaPropertyId) {
        if (!this.state.isBusy) {
            this.setState({ isBusy: true });
            this.fetchUsersDaysAnnotations(gaPropertyId);
            HttpClient.get(`/dashboard/analytics/annotations-metrics-dimensions?start_date=${this.state.startDate}&end_date=${this.state.endDate}&ga_property_id=${gaPropertyId}`)
                .then(response => {
                    this.setState({ isBusy: false, annotations: response.data.annotations });
                }, (err) => {
                    this.setState({ isBusy: false, errors: (err.response).data });
                }).catch(err => {
                    this.setState({ isBusy: false, errors: err });
                });
            HttpClient.get(`/dashboard/analytics/media?start_date=${this.state.startDate}&end_date=${this.state.endDate}&ga_property_id=${gaPropertyId}`)
                .then(response => {
                    this.setState({ isBusy: false, mediaStatistics: response.data.statistics });
                }, (err) => {
                    this.setState({ isBusy: false, errors: (err.response).data });
                }).catch(err => {
                    this.setState({ isBusy: false, errors: err });
                });
            HttpClient.get(`/dashboard/analytics/sources?start_date=${this.state.startDate}&end_date=${this.state.endDate}&ga_property_id=${gaPropertyId}`)
                .then(response => {
                    this.setState({ isBusy: false, sourcesStatistics: response.data.statistics });
                }, (err) => {
                    this.setState({ isBusy: false, errors: (err.response).data });
                }).catch(err => {
                    this.setState({ isBusy: false, errors: err });
                });
            HttpClient.get(`/dashboard/analytics/device-categories?start_date=${this.state.startDate}&end_date=${this.state.endDate}&ga_property_id=${gaPropertyId}`)
                .then(response => {
                    this.setState({ isBusy: false, deviceCategoriesStatistics: response.data.statistics });
                }, (err) => {
                    this.setState({ isBusy: false, errors: (err.response).data });
                }).catch(err => {
                    this.setState({ isBusy: false, errors: err });
                });
        }
    }

    fetchUsersDaysAnnotations(gaPropertyId) {
        HttpClient.get(`/dashboard/analytics/users-days-annotations?start_date=${this.state.startDate}&end_date=${this.state.endDate}&ga_property_id=${gaPropertyId}&statistics_padding_days=${this.state.statisticsPaddingDays}`)
            .then(response => {
                this.setState({ isBusy: false, usersDaysStatistics: response.data.statistics, googleAccount: response.data.google_account });
            }, (err) => {
                this.setState({ isBusy: false, errors: (err.response).data });
            }).catch(err => {
                this.setState({ isBusy: false, errors: err });
            });
    }

    changeStatisticsPaddingDays(statisticsPaddingDays) {
        this.setState({ statisticsPaddingDays: statisticsPaddingDays }, () => this.fetchUsersDaysAnnotations(this.state.ga_property_id));
    }
}