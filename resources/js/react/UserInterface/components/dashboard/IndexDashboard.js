import React, { Component } from 'react';
import UsersDaysGraph from './graphs/usersDaysGraph';
import HttpClient from '../../utils/HttpClient';
import AnnotationsTable from './tables/annotationsTable';
import MediaGraph from './graphs/mediaGraph';
import GoogleAnalyticsPropertySelect from '../../utils/GoogleAnalyticsPropertySelect';
import ErrorAlert from '../../utils/ErrorAlert';

export default class IndexDashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isBusy: false,
            usersDaysStatistics: [],
            annotations: [],
            mediaStatistics: [],
            sourcesStatistics: [],
            deviceCategoriesStatistics: [],
            startDate: '2021-01-01',
            endDate: '2021-10-15',
            ga_property_id: '*',
            errors: undefined
        };

        this.fetchStatistics = this.fetchStatistics.bind(this);
    }

    componentDidMount() {
        this.fetchStatistics('*');
    }



    render() {
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
                            <div className="col-6"></div>
                            <div className="col-2">
                                <input type="date" name="startDate" onBlur={(e) => { this.setState({ [e.target.name]: e.target.value }); this.fetchStatistics(this.state.ga_property_id); }} className="form-control" />
                            </div>
                            <div className="col-2">
                                <input type="date" name="endDate" onBlur={(e) => { this.setState({ [e.target.name]: e.target.value }); this.fetchStatistics(this.state.ga_property_id); }} className="form-control" />
                            </div>
                            <div className="col-2">
                                <GoogleAnalyticsPropertySelect
                                    name="ga_property_id"
                                    id="ga_property_id"
                                    value={this.state.ga_property_id}
                                    onChangeCallback={(event) => { this.setState({ ga_property_id: event.target.value }); this.fetchStatistics(event.target.value); }} placeholder="Select GA Properties"
                                    components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
                                />
                            </div>
                        </div>
                        <UsersDaysGraph statistics={this.state.usersDaysStatistics} />
                        <AnnotationsTable user={this.props.user} annotations={this.state.annotations} />
                        <MediaGraph statistics={this.state.mediaStatistics} />
                        <div className="row">
                            <div className="col-6">
                                <table className="table table-bordered table-hover">
                                    <thead><tr><th></th><th></th><th>Users</th><th>Conversion Rate</th></tr></thead>
                                    <tbody>
                                        {
                                            this.state.sourcesStatistics.map(sS => {
                                                const conversionRate = sS.sum_events_count && sS.sum_users_count ? ((sS.sum_events_count / sS.sum_users_count) * 100).toFixed(2) : 0;
                                                return <tr>
                                                    <td><img height="25px" width="25px" src={`https://${sS.source_name}/favicon.ico`} /></td>
                                                    <td>{sS.source_name}</td>
                                                    <td>{sS.sum_users_count}</td>
                                                    <td>{conversionRate}</td>
                                                </tr>
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                            <div className="col-6">
                                <table className="table table-bordered table-hover">
                                    <thead><tr><th></th><th>Users</th><th>Conversion Rate</th></tr></thead>
                                    <tbody>
                                        {
                                            this.state.deviceCategoriesStatistics.map(dS => {
                                                const conversionRate = dS.sum_events_count && dS.sum_users_count ? ((dS.sum_events_count / dS.sum_users_count) * 100).toFixed(2) : 0;
                                                return <tr><td>{dS.source_name}</td><td>{dS.sum_users_count}</td><td>{conversionRate}</td></tr>
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

            </section>
        </div >;
    }

    fetchStatistics(gaPropertyId) {
        if (!this.state.isBusy) {
            this.setState({ isBusy: true });
            HttpClient.get(`/dashboard/users-days?start_date=${this.state.startDate}&end_date=${this.state.endDate}&ga_property_id=${gaPropertyId}`)
                .then(response => {
                    this.setState({ isBusy: false, usersDaysStatistics: response.data.statistics });
                }, (err) => {
                    this.setState({ isBusy: false, errors: (err.response).data });
                }).catch(err => {
                    this.setState({ isBusy: false, errors: err });
                });
            HttpClient.get(`/dashboard/annotations-metrics-dimensions?start_date=${this.state.startDate}&end_date=${this.state.endDate}&ga_property_id=${gaPropertyId}`)
                .then(response => {
                    this.setState({ isBusy: false, annotations: response.data.annotations });
                }, (err) => {
                    this.setState({ isBusy: false, errors: (err.response).data });
                }).catch(err => {
                    this.setState({ isBusy: false, errors: err });
                });
            HttpClient.get(`/dashboard/media?start_date=${this.state.startDate}&end_date=${this.state.endDate}&ga_property_id=${gaPropertyId}`)
                .then(response => {
                    this.setState({ isBusy: false, mediaStatistics: response.data.statistics });
                }, (err) => {
                    this.setState({ isBusy: false, errors: (err.response).data });
                }).catch(err => {
                    this.setState({ isBusy: false, errors: err });
                });
            HttpClient.get(`/dashboard/sources?start_date=${this.state.startDate}&end_date=${this.state.endDate}&ga_property_id=${gaPropertyId}`)
                .then(response => {
                    this.setState({ isBusy: false, sourcesStatistics: response.data.statistics });
                }, (err) => {
                    this.setState({ isBusy: false, errors: (err.response).data });
                }).catch(err => {
                    this.setState({ isBusy: false, errors: err });
                });
            HttpClient.get(`/dashboard/device-categories?start_date=${this.state.startDate}&end_date=${this.state.endDate}&ga_property_id=${gaPropertyId}`)
                .then(response => {
                    this.setState({ isBusy: false, deviceCategoriesStatistics: response.data.statistics });
                }, (err) => {
                    this.setState({ isBusy: false, errors: (err.response).data });
                }).catch(err => {
                    this.setState({ isBusy: false, errors: err });
                });
        }
    }
}