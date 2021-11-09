import React, { Component } from 'react';
import { DateRange } from 'react-date-range';

import UsersDaysGraph from './graphs/usersDaysGraph';
import HttpClient from '../../../utils/HttpClient';
import AnnotationsTable from './tables/annotationsTable';
import MediaGraph from './graphs/mediaGraph';
import GoogleAnalyticsPropertySelect from '../../../utils/GoogleAnalyticsPropertySelect';
import ErrorAlert from '../../../utils/ErrorAlert';
import NoGoogleAccountConnectedPage from './subPages/NoGoogleAccountConnectedPage';
import UsersDaysWithAnnotationsGraph from './graphs/usersDaysWithAnnotationsGraph';
import GoogleSearchConsoleSiteSelect from '../../../utils/GoogleSearchConsoleSiteSelect';
import NoDataFoundPage from './subPages/NoDataFoundPage';
import { timezoneToDateFormat } from '../../../utils/TimezoneTodateFormat';

export default class IndexSearchConsole extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isBusy: false,
            showDateRangeSelect: false,
            queriesStatistics: [],
            pagesStatistics: [],
            countriesStatistics: [],
            devicesStatistics: [],
            searchApearancesStatistics: [],
            annotations: [],
            startDate: moment().subtract(14, 'days').format('YYYY-MM-DD'),
            endDate: moment().format('YYYY-MM-DD'),
            google_search_console_site_id: '*',
            errors: undefined
        };

        this.fetchStatistics = this.fetchStatistics.bind(this);
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
                            <div className="col-8"></div>
                            <div className="col-3 text-right">
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
                                                        this.fetchStatistics(this.state.google_search_console_site_id);
                                                    }
                                                });
                                            }}
                                        />
                                        :
                                        <React.Fragment>
                                            <p>From: {moment(this.state.startDate).format(timezoneToDateFormat(this.props.user.timezone))}</p>
                                            <p>To: {moment(this.state.endDate).format(timezoneToDateFormat(this.props.user.timezone))}</p>
                                        </React.Fragment>
                                }
                            </div>
                            <div className="col-1">
                                <button className="btn btn-secondary" onClick={() => { this.setState({ showDateRangeSelect: !this.state.showDateRangeSelect }); }}>{this.state.showDateRangeSelect ? 'Close' : 'Select Dates'}</button>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-9 text-right">Site:</div>
                            <div className="col-3">
                                <GoogleSearchConsoleSiteSelect
                                    name="google_search_console_site_id"
                                    id="google_search_console_site_id"
                                    value={this.state.google_search_console_site_id}
                                    onChangeCallback={(event) => { this.setState({ google_search_console_site_id: event.target.value }); this.fetchStatistics(event.target.value); }} placeholder="Select Site"
                                    components={{ IndicatorSeparator: () => null }}
                                    autoSelectFirst
                                />
                            </div>
                        </div>
                        {
                            this.state.queriesStatistics.length ?
                                <React.Fragment>
                                    {/* <UsersDaysGraph statistics={this.state.usersDaysStatistics} /> */}
                                    {/* <UsersDaysWithAnnotationsGraph statistics={this.state.usersDaysStatistics} /> */}
                                    <AnnotationsTable user={this.props.user} annotations={this.state.annotations} />
                                    {/* <MediaGraph statistics={this.state.mediaStatistics} /> */}
                                    <div className="row">
                                        <div className="col-6">
                                            <table className="table table-bordered table-hover">
                                                <thead><tr><th>Query</th><th>Clicks</th><th>Impressions</th></tr></thead>
                                                <tbody>
                                                    {
                                                        this.state.queriesStatistics.map(qS => {
                                                            return <tr>
                                                                <td>{qS.query}</td>
                                                                <td>{qS.sum_clicks_count}</td>
                                                                <td>{qS.sum_impressions_count}</td>
                                                            </tr>
                                                        })
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="col-6">
                                            <table className="table table-bordered table-hover">
                                                <thead><tr><th>Page</th><th>Clicks</th><th>Impressions</th></tr></thead>
                                                <tbody>
                                                    {
                                                        this.state.pagesStatistics.map(pS => {
                                                            return <tr>
                                                                <td>{pS.page}</td>
                                                                <td>{pS.sum_clicks_count}</td>
                                                                <td>{pS.sum_impressions_count}</td>
                                                            </tr>
                                                        })
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-6">
                                            <table className="table table-bordered table-hover">
                                                <thead><tr><th>Country</th><th>Clicks</th><th>Impressions</th></tr></thead>
                                                <tbody>
                                                    {
                                                        this.state.countriesStatistics.map(cS => {
                                                            return <tr>
                                                                <td>{cS.country}</td>
                                                                <td>{cS.sum_clicks_count}</td>
                                                                <td>{cS.sum_impressions_count}</td>
                                                            </tr>
                                                        })
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="col-6">
                                            <table className="table table-bordered table-hover">
                                                <thead><tr><th>Device</th><th>Clicks</th><th>Impressions</th></tr></thead>
                                                <tbody>
                                                    {
                                                        this.state.devicesStatistics.map(dS => {
                                                            return <tr>
                                                                <td>{dS.device}</td>
                                                                <td>{dS.sum_clicks_count}</td>
                                                                <td>{dS.sum_impressions_count}</td>
                                                            </tr>
                                                        })
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-6">
                                            <table className="table table-bordered table-hover">
                                                <thead><tr><th>Search Appearance</th><th>Clicks</th><th>Impressions</th></tr></thead>
                                                <tbody>
                                                    {
                                                        this.state.searchApearancesStatistics.map(sAS => {
                                                            return <tr>
                                                                <td>{sAS.search_appearance}</td>
                                                                <td>{sAS.sum_clicks_count}</td>
                                                                <td>{sAS.sum_impressions_count}</td>
                                                            </tr>
                                                        })
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </React.Fragment>
                                :
                                <NoDataFoundPage />
                        }
                    </div>
                </div>

            </section>
        </div >;
    }

    fetchStatistics(gaPropertyId) {
        if (!this.state.isBusy) {
            this.setState({ isBusy: true });
            HttpClient.get(`/dashboard/search-console/queries?start_date=${this.state.startDate}&end_date=${this.state.endDate}&google_search_console_site_id=${gaPropertyId}`)
                .then(response => {
                    this.setState({ isBusy: false, queriesStatistics: response.data.statistics });
                }, (err) => {
                    this.setState({ isBusy: false, errors: (err.response).data });
                }).catch(err => {
                    this.setState({ isBusy: false, errors: err });
                });
            HttpClient.get(`/dashboard/search-console/pages?start_date=${this.state.startDate}&end_date=${this.state.endDate}&google_search_console_site_id=${gaPropertyId}`)
                .then(response => {
                    this.setState({ isBusy: false, pagesStatistics: response.data.statistics });
                }, (err) => {
                    this.setState({ isBusy: false, errors: (err.response).data });
                }).catch(err => {
                    this.setState({ isBusy: false, errors: err });
                });
            HttpClient.get(`/dashboard/search-console/countries?start_date=${this.state.startDate}&end_date=${this.state.endDate}&google_search_console_site_id=${gaPropertyId}`)
                .then(response => {
                    this.setState({ isBusy: false, countriesStatistics: response.data.statistics });
                }, (err) => {
                    this.setState({ isBusy: false, errors: (err.response).data });
                }).catch(err => {
                    this.setState({ isBusy: false, errors: err });
                });
            HttpClient.get(`/dashboard/search-console/devices?start_date=${this.state.startDate}&end_date=${this.state.endDate}&google_search_console_site_id=${gaPropertyId}`)
                .then(response => {
                    this.setState({ isBusy: false, devicesStatistics: response.data.statistics });
                }, (err) => {
                    this.setState({ isBusy: false, errors: (err.response).data });
                }).catch(err => {
                    this.setState({ isBusy: false, errors: err });
                });
            HttpClient.get(`/dashboard/search-console/search-appearances?start_date=${this.state.startDate}&end_date=${this.state.endDate}&google_search_console_site_id=${gaPropertyId}`)
                .then(response => {
                    this.setState({ isBusy: false, searchApearancesStatistics: response.data.statistics });
                }, (err) => {
                    this.setState({ isBusy: false, errors: (err.response).data });
                }).catch(err => {
                    this.setState({ isBusy: false, errors: err });
                });
            HttpClient.get(`/dashboard/search-console/annotations-dates?start_date=${this.state.startDate}&end_date=${this.state.endDate}&google_search_console_site_id=${gaPropertyId}`)
                .then(response => {
                    this.setState({ isBusy: false, annotations: response.data.annotations });
                }, (err) => {
                    this.setState({ isBusy: false, errors: (err.response).data });
                }).catch(err => {
                    this.setState({ isBusy: false, errors: err });
                });
        }
    }
}