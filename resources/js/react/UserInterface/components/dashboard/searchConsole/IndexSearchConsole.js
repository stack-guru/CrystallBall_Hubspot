import React, { Component } from 'react';
import { DateRangePicker } from 'react-date-range';

import HttpClient from '../../../utils/HttpClient';
import ErrorAlert from '../../../utils/ErrorAlert';
import { newStaticRanges } from '../../../utils/CustomDateRange';
import { timezoneToDateFormat } from '../../../utils/TimezoneTodateFormat';
import GoogleSearchConsoleSiteSelect from '../../../utils/GoogleSearchConsoleSiteSelect';

import AnnotationsTable from './tables/annotationsTable';

import ClicksImpressionsDaysGraph from './graphs/clicksImpressionsDaysGraph';
import DeviceClicksImpressionsGraph from './graphs/deviceClicksImpressionsGraph';

import NoGoogleAccountConnectedPage from './subPages/NoGoogleAccountConnectedPage';
import NoDataFoundPage from './subPages/NoDataFoundPage';
import MapChart from './graphs/WorldMap';

export default class IndexSearchConsole extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isBusy: false,
            showDateRangeSelect: false,
            googleAccount: undefined,
            queriesStatistics: [],
            pagesStatistics: [],
            countriesStatistics: [],
            devicesStatistics: [],
            searchApearancesStatistics: [],
            clicksImpressionsDaysStatistics: [],
            annotations: [],
            startDate: moment().subtract(14, 'days').format('YYYY-MM-DD'),
            endDate: moment().subtract(2, 'days').format('YYYY-MM-DD'),
            google_search_console_site_id: '*',
            statisticsPaddingDays: 7,
            errors: undefined
        };

        this.fetchStatistics = this.fetchStatistics.bind(this);
        this.changeStatisticsPaddingDays = this.changeStatisticsPaddingDays.bind(this);
    }

    render() {

        if (!this.props.user.google_accounts_count) return <NoGoogleAccountConnectedPage />

        return <div className="container-xl bg-white anno-container  d-flex flex-column justify-content-center component-wrapper" >
            <section className="ftco-section" id="inputs">
                <div className="container-xl p-0">
                    <div className="row ml-0 mr-0 mb-1">
                        <div className="col-md-6 pl-0">
                            <h2 className="heading-section gaa-title">Search Console</h2>
                        </div>
                        <div className="col-md-6 text-right">
                            <h6 className="gaa-text-color">This page is on Beta</h6>
                        </div>
                    </div>
                    <div className="row ml-0 mr-0 mb-4">
                        <div className="col-md-12 text-right">
                            <button className="btn gaa-btn-primary btn-sm" onClick={() => {
                                html2pdf(document.getElementById("dashboard-index-container"), {
                                    margin: 0.5,
                                    filename: 'dashboard_search_console.pdf',
                                    image: { type: 'jpeg', quality: 1.0 },
                                    html2canvas: { scale: 1 },
                                    jsPDF: { unit: 'in', format: 'A4', orientation: 'landscape' }
                                });
                            }}><i className="fa fa-file-pdf-o"></i> Download</button>
                        </div>
                    </div>
                    <div id="dashboard-index-container">
                        <div className="row ml-0 mr-0">
                            <div className="col-md-12">
                                <ErrorAlert errors={this.state.errors} />
                            </div>
                        </div>
                        <div className="row ml-0 mr-0">
                            <div style={{ maxWidth: '10%', width: '10%' }} >
                                Date range:
                            </div>
                            <div style={{ maxWidth: '30%', width: '30%' }} >
                                <button className="btn thin-light-gray-border text-black w-100"
                                    style={{ paddingRight: '8px' }}
                                    onClick={() => { this.setState({ showDateRangeSelect: !this.state.showDateRangeSelect }); }}>
                                    From: {moment(this.state.startDate).format(timezoneToDateFormat(this.props.user.timezone))}
                                    &nbsp;&nbsp;&nbsp;
                                    To: {moment(this.state.endDate).format(timezoneToDateFormat(this.props.user.timezone))}
                                    &nbsp;
                                    <svg height="20" width="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false" className="css-19bqh2r float-right" style={{ color: "rgb(204, 204, 204)" }}>
                                        <path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"></path>
                                    </svg>
                                </button>
                            </div>
                            <div style={{ maxWidth: '50%', width: '50%' }} >
                                {
                                    this.state.showDateRangeSelect ?
                                        <DateRangePicker
                                            style={{ 'position': 'absolute', backgroundColor: '#F7F7F7', zIndex: 9999999999999 }}
                                            editableDateInputs={true}
                                            moveRangeOnFirstSelection={false}
                                            staticRanges={newStaticRanges}
                                            inputRanges={[]}
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
                                        null
                                }
                            </div>
                        </div>
                        <div className="row ml-0 mr-0 mt-3">
                            <div style={{ maxWidth: '10%', width: '10%' }} >
                                Site:
                            </div>
                            <div style={{ maxWidth: '30%', width: '30%' }} >
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
                            this.state.clicksImpressionsDaysStatistics.length ?
                                <React.Fragment>
                                    <ClicksImpressionsDaysGraph statistics={this.state.clicksImpressionsDaysStatistics} />
                                    <AnnotationsTable user={this.props.user} annotations={this.state.annotations} satisticsPaddingDaysCallback={this.changeStatisticsPaddingDays} statisticsPaddingDays={this.state.statisticsPaddingDays} />
                                    <div className="row ml-0 mr-0 mt-4">
                                        <div className="col-6" style={{ maxHeight: '300px', overflowY: 'scroll' }}>
                                            <table className="table table-bordered table-hover gaa-hover">
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
                                        <div className="col-6" style={{ maxHeight: '300px', overflowY: 'scroll' }}>
                                            <table className="table table-bordered table-hover gaa-hover">
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
                                    <div className="row ml-0 mr-0 mt-4">
                                        <div className="col-6" style={{ maxHeight: '300px', overflowY: 'scroll' }}>
                                            <MapChart countriesStatistics={this.state.countriesStatistics} />
                                        </div>
                                        <div className="col-6">
                                            <DeviceClicksImpressionsGraph devicesStatistics={this.state.devicesStatistics} />
                                        </div>
                                    </div>
                                    {/* <div className="row ml-0 mr-0 mt-4">
                                        <div className="col-6" style={{ maxHeight: '300px', overflowY: 'scroll' }}>
                                            <table className="table table-bordered table-hover gaa-hover">
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
                                    </div> */}
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
            HttpClient.get(`/dashboard/search-console/clicks-impressions-days-annotations?start_date=${this.state.startDate}&end_date=${this.state.endDate}&google_search_console_site_id=${gaPropertyId}&statistics_padding_days=${this.state.statisticsPaddingDays}`)
                .then(response => {
                    this.setState({ isBusy: false, clicksImpressionsDaysStatistics: response.data.statistics });
                }, (err) => {
                    this.setState({ isBusy: false, errors: (err.response).data });
                }).catch(err => {
                    this.setState({ isBusy: false, errors: err });
                });
            HttpClient.get(`/dashboard/search-console/annotations-dates?start_date=${this.state.startDate}&end_date=${this.state.endDate}&google_search_console_site_id=${gaPropertyId}&statistics_padding_days=${this.state.statisticsPaddingDays}`)
                .then(response => {
                    this.setState({ isBusy: false, annotations: response.data.annotations });
                }, (err) => {
                    this.setState({ isBusy: false, errors: (err.response).data });
                }).catch(err => {
                    this.setState({ isBusy: false, errors: err });
                });
            HttpClient.get(`/dashboard/search-console/queries?start_date=${this.state.startDate}&end_date=${this.state.endDate}&google_search_console_site_id=${gaPropertyId}`)
                .then(response => {
                    this.setState({ isBusy: false, queriesStatistics: response.data.statistics, googleAccount: response.data.google_account });
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
        }
    }

    changeStatisticsPaddingDays(statisticsPaddingDays) {
        this.setState(
            { statisticsPaddingDays: statisticsPaddingDays },
            () => {
                this.fetchStatistics(this.state.google_search_console_site_id);
            }
        );
    }
}