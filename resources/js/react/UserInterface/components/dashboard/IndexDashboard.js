import React, { Component } from 'react';
import { DateRangePicker } from 'react-date-range';

import HttpClient from '../../utils/HttpClient';
import ErrorAlert from '../../utils/ErrorAlert';
import { newStaticRanges } from '../../utils/CustomDateRange';
import { timezoneToDateFormat } from '../../utils/TimezoneTodateFormat';
import GoogleSearchConsoleSiteSelect from '../../utils/GoogleSearchConsoleSiteSelect';
import GoogleAnalyticsPropertySelect from '../../utils/GoogleAnalyticsPropertySelect';

import NoGoogleAccountConnectedPage from './subPages/NoGoogleAccountConnectedPage';
import NoDataFoundPage from './subPages/NoDataFoundPage';

import SearchConsoleAnnotationsTable from './searchConsole/tables/annotationsTable';
import SearchConsoleTopStatistics from './searchConsole/utils/TopStatistics';
import PagesTable from './searchConsole/tables/pagesTable'
import QueriesTable from './searchConsole/tables/queriesTable'
import CountriesTable from './searchConsole/tables/countriesTable'
import ClicksImpressionsDaysGraph from './searchConsole/graphs/clicksImpressionsDaysGraph';
import DeviceClicksImpressionsGraph from './searchConsole/graphs/deviceClicksImpressionsGraph';
import MapChart from './searchConsole/graphs/WorldMap';

import AnalyticsAnnotationsTable from './analytics/tables/annotationsTable';
import AnalyticsTopStatistics from './analytics/utils/TopStatistics';
import MediaGraph from './analytics/graphs/mediaGraph';
import DeviceUsersGraph from './analytics/graphs/deviceUsersGraph';
import UsersDaysWithAnnotationsGraph from './analytics/graphs/usersDaysWithAnnotationsGraph';


export default class IndexDashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isBusy: false,
            showDateRangeSelect: false,
            googleAccount: undefined,
            analyticsTopStatistics: {
                "sum_users_count": "∞",
                "sum_sessions_count": "∞",
                "sum_events_count": "∞",
                "sum_conversions_count": "∞"
            },
            searchConsoleTopStatistics: {
                "sum_clicks_count": "∞",
                "sum_impressions_count": "∞",
                "max_ctr_count": "∞",
                "min_position_rank": "∞"
            },
            // Search Console
            clicksImpressionsDaysStatistics: [],
            queriesStatistics: [],
            pagesStatistics: [],
            countriesStatistics: [],
            devicesStatistics: [],
            searchApearancesStatistics: [],
            searchConsoleAnnotations: [],
            google_search_console_site_id: '*',
            // Analytics
            usersDaysStatistics: [],
            mediaStatistics: [],
            sourcesStatistics: [],
            deviceCategoriesStatistics: [],
            analyticsAnnotations: [],
            ga_property_id: '*',

            startDate: moment().subtract(14, 'days').format('YYYY-MM-DD'),
            endDate: moment().subtract(2, 'days').format('YYYY-MM-DD'),

            statisticsPaddingDays: 7,
            errors: undefined
        };

        this.searchConsoleFetchStatistics = this.searchConsoleFetchStatistics.bind(this);
        this.searchConsoleChangeStatisticsPaddingDays = this.searchConsoleChangeStatisticsPaddingDays.bind(this);

        this.analyticsFetchStatistics = this.analyticsFetchStatistics.bind(this);
        this.analyticsFetchUsersDaysAnnotations = this.analyticsFetchUsersDaysAnnotations.bind(this);
        this.analyticsChangeStatisticsPaddingDays = this.analyticsChangeStatisticsPaddingDays.bind(this);
    }

    render() {

        if (!this.props.user.google_accounts_count) return <NoGoogleAccountConnectedPage />

        return <React.Fragment>
            <SearchConsoleTopStatistics topStatistics={this.state.searchConsoleTopStatistics} />
            <div className="container-xl bg-white anno-container  d-flex flex-column justify-content-center component-wrapper" >
                <section className="ftco-section" id="inputs">
                    <div className="container-xl p-0">
                        <div className="row ml-0 mr-0 mb-1">
                            <div className="col-md-6 pl-0">
                                <h2 className="heading-section gaa-title">Dashboard</h2>
                            </div>
                            <div className="col-md-6 text-right">
                                <h6 className="gaa-text-color">This page is on Beta</h6>
                            </div>
                        </div>
                        <div className="row ml-0 mr-0 mb-4">
                            <div className="col-md-12 text-right">
                                <button className="btn gaa-btn-primary btn-sm" onClick={() => {
                                    const scrollClassName = "scrollable";
                                    const tempScrollClassName = "removed-scrollable";
                                    // Remove scrollable class from table containers to show all data in PDF file
                                    document.getElementById("dashboard-index-container").querySelectorAll('.' + scrollClassName).forEach(scrollableElement => {
                                        scrollableElement.classList.remove(scrollClassName);
                                        scrollableElement.classList.add(tempScrollClassName);
                                    });
                                    html2pdf(document.getElementById("dashboard-index-container"), {
                                        margin: 0.5,
                                        filename: 'dashboard_search_console.pdf',
                                        image: { type: 'jpeg', quality: 1.0 },
                                        html2canvas: { scale: 1 },
                                        jsPDF: { unit: 'in', format: 'A4', orientation: 'landscape' }
                                    }).then(() => {
                                        // Add scrollable class from table containers to keep display proper
                                        document.getElementById("dashboard-index-container").querySelectorAll('.' + tempScrollClassName).forEach(scrollableElement => {
                                            scrollableElement.classList.remove(tempScrollClassName);
                                            scrollableElement.classList.add(scrollClassName);
                                        });
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
                            <div className="row ml-0 mr-0 mt-3">
                                <div style={{ maxWidth: '10%', width: '10%' }} >
                                    Site:
                                </div>
                                <div style={{ maxWidth: '30%', width: '30%' }} >
                                    <GoogleSearchConsoleSiteSelect
                                        name="google_search_console_site_id"
                                        id="google_search_console_site_id"
                                        value={this.state.google_search_console_site_id}
                                        onChangeCallback={(event) => { this.setState({ google_search_console_site_id: event.target.value }); this.searchConsoleFetchStatistics(event.target.value); }} placeholder="Select Site"
                                        components={{ IndicatorSeparator: () => null }}
                                        autoSelectFirst
                                    />
                                </div>
                                <div style={{ maxWidth: '30%', width: '30%' }} >
                                    <GoogleAnalyticsPropertySelect
                                        name="ga_property_id"
                                        id="ga_property_id"
                                        value={this.state.ga_property_id}
                                        onChangeCallback={(event) => { this.setState({ ga_property_id: event.target.value }); this.analyticsFetchStatistics(event.target.value); }} placeholder="Select GA Properties"
                                        components={{ IndicatorSeparator: () => null }}
                                        autoSelectFirst
                                    />
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
                                                            this.searchConsoleFetchStatistics(this.state.google_search_console_site_id);
                                                            this.analyticsFetchStatistics(this.state.ga_property_id);
                                                        }
                                                    });
                                                }}
                                            />
                                            :
                                            null
                                    }
                                </div>
                            </div>

                            {
                                this.state.clicksImpressionsDaysStatistics.length ?
                                    <React.Fragment>
                                        <ClicksImpressionsDaysGraph statistics={this.state.clicksImpressionsDaysStatistics} />
                                        <SearchConsoleAnnotationsTable user={this.props.user} annotations={this.state.searchConsoleAnnotations} satisticsPaddingDaysCallback={this.changeStatisticsPaddingDays} statisticsPaddingDays={this.state.statisticsPaddingDays} />
                                        <div className="row ml-0 mr-0 mt-4">
                                            <div className="col-6 p-0 scrollable border">
                                                <QueriesTable queriesStatistics={this.state.queriesStatistics} />
                                            </div>
                                            <div className="col-6 p-0 scrollable border-bottom">
                                                <PagesTable pagesStatistics={this.state.pagesStatistics} />
                                            </div>
                                        </div>
                                        <div className="row ml-0 mr-0 mt-4 border-top border-bottom border-left">
                                            <div className="col-6 p-0">
                                                <MapChart countriesStatistics={this.state.countriesStatistics} />
                                            </div>
                                            <div className="col-6 p-0 scrollable">
                                                <CountriesTable countriesStatistics={this.state.countriesStatistics} />
                                            </div>
                                        </div>
                                        <div className="row ml-0 mr-0 mt-4">
                                            <div className="col-6 border">
                                                <DeviceClicksImpressionsGraph devicesStatistics={this.state.devicesStatistics} />
                                            </div>
                                        </div>
                                        {/* <div className="row ml-0 mr-0 mt-4">
                                        <div className="col-6">
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
            </div >
            <AnalyticsTopStatistics topStatistics={this.state.analyticsTopStatistics} />
            <div className="container-xl bg-white anno-container  d-flex flex-column justify-content-center component-wrapper" >
                <section className="ftco-section" id="inputs">
                    <div className="container-xl p-0">
                        <div className="row ml-0 mr-0 mb-1">
                            <div className="col-md-6 pl-0">
                                <h2 className="heading-section gaa-title">Analytics</h2>
                            </div>
                        </div>
                        <div id="dashboard-index-container">
                            <div className="row ml-0 mr-0">
                                <div className="col-md-12">
                                    <ErrorAlert errors={this.state.errors} />
                                </div>
                            </div>
                            {
                                this.state.usersDaysStatistics.length ?
                                    <React.Fragment>
                                        {/* <UsersDaysGraph statistics={this.state.usersDaysStatistics} /> */}
                                        <UsersDaysWithAnnotationsGraph statistics={this.state.usersDaysStatistics} />
                                        <AnalyticsAnnotationsTable user={this.props.user} annotations={this.state.analyticsAnnotations} satisticsPaddingDaysCallback={this.changeStatisticsPaddingDays} statisticsPaddingDays={this.state.statisticsPaddingDays} />
                                        <MediaGraph statistics={this.state.mediaStatistics} />
                                        <div className="row ml-0 mr-0 mt-4">
                                            <div className="col-6 scrollable">
                                                <table className="table table-bordered table-hover gaa-hover">
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
                                            <div className="col-6">
                                                <DeviceUsersGraph deviceCategoriesStatistics={this.state.deviceCategoriesStatistics} />
                                            </div>
                                        </div>
                                    </React.Fragment>
                                    :
                                    <NoDataFoundPage googleAccount={this.state.googleAccount} />
                            }
                        </div>
                    </div>
                </section>
            </div >
        </React.Fragment>;
    }

    searchConsoleFetchStatistics(gSCSiteId) {
        if (!this.state.isBusy) {
            this.setState({ isBusy: true });
            HttpClient.get(`/dashboard/search-console/top-statistics?start_date=${this.state.startDate}&end_date=${this.state.endDate}&google_search_console_site_id=${gSCSiteId}`)
                .then(response => {
                    this.setState({ isBusy: false, searchConsoleTopStatistics: response.data.statistics });
                }, (err) => {
                    this.setState({ isBusy: false, errors: (err.response).data });
                }).catch(err => {
                    this.setState({ isBusy: false, errors: err });
                });
            HttpClient.get(`/dashboard/search-console/clicks-impressions-days-annotations?start_date=${this.state.startDate}&end_date=${this.state.endDate}&google_search_console_site_id=${gSCSiteId}&statistics_padding_days=${this.state.statisticsPaddingDays}`)
                .then(response => {
                    this.setState({ isBusy: false, clicksImpressionsDaysStatistics: response.data.statistics });
                }, (err) => {
                    this.setState({ isBusy: false, errors: (err.response).data });
                }).catch(err => {
                    this.setState({ isBusy: false, errors: err });
                });
            HttpClient.get(`/dashboard/search-console/annotations-dates?start_date=${this.state.startDate}&end_date=${this.state.endDate}&google_search_console_site_id=${gSCSiteId}&statistics_padding_days=${this.state.statisticsPaddingDays}`)
                .then(response => {
                    this.setState({ isBusy: false, searchConsoleAnnotations: response.data.annotations });
                }, (err) => {
                    this.setState({ isBusy: false, errors: (err.response).data });
                }).catch(err => {
                    this.setState({ isBusy: false, errors: err });
                });
            HttpClient.get(`/dashboard/search-console/queries?start_date=${this.state.startDate}&end_date=${this.state.endDate}&google_search_console_site_id=${gSCSiteId}`)
                .then(response => {
                    this.setState({ isBusy: false, queriesStatistics: response.data.statistics, googleAccount: response.data.google_account });
                }, (err) => {
                    this.setState({ isBusy: false, errors: (err.response).data });
                }).catch(err => {
                    this.setState({ isBusy: false, errors: err });
                });
            HttpClient.get(`/dashboard/search-console/pages?start_date=${this.state.startDate}&end_date=${this.state.endDate}&google_search_console_site_id=${gSCSiteId}`)
                .then(response => {
                    this.setState({ isBusy: false, pagesStatistics: response.data.statistics });
                }, (err) => {
                    this.setState({ isBusy: false, errors: (err.response).data });
                }).catch(err => {
                    this.setState({ isBusy: false, errors: err });
                });
            HttpClient.get(`/dashboard/search-console/countries?start_date=${this.state.startDate}&end_date=${this.state.endDate}&google_search_console_site_id=${gSCSiteId}`)
                .then(response => {
                    this.setState({ isBusy: false, countriesStatistics: response.data.statistics });
                }, (err) => {
                    this.setState({ isBusy: false, errors: (err.response).data });
                }).catch(err => {
                    this.setState({ isBusy: false, errors: err });
                });
            HttpClient.get(`/dashboard/search-console/devices?start_date=${this.state.startDate}&end_date=${this.state.endDate}&google_search_console_site_id=${gSCSiteId}`)
                .then(response => {
                    this.setState({ isBusy: false, devicesStatistics: response.data.statistics });
                }, (err) => {
                    this.setState({ isBusy: false, errors: (err.response).data });
                }).catch(err => {
                    this.setState({ isBusy: false, errors: err });
                });
            HttpClient.get(`/dashboard/search-console/search-appearances?start_date=${this.state.startDate}&end_date=${this.state.endDate}&google_search_console_site_id=${gSCSiteId}`)
                .then(response => {
                    this.setState({ isBusy: false, searchApearancesStatistics: response.data.statistics });
                }, (err) => {
                    this.setState({ isBusy: false, errors: (err.response).data });
                }).catch(err => {
                    this.setState({ isBusy: false, errors: err });
                });
        }
    }

    searchConsoleChangeStatisticsPaddingDays(statisticsPaddingDays) {
        this.setState(
            { statisticsPaddingDays: statisticsPaddingDays },
            () => {
                this.searchConsoleFetchStatistics(this.state.google_search_console_site_id);
            }
        );
    }

    analyticsFetchStatistics(gaPropertyId) {
        if (!this.state.isBusy) {
            this.setState({ isBusy: true });
            this.analyticsFetchUsersDaysAnnotations(gaPropertyId);
            this.analyticsFetchAnnotationsMetricsDimensions(gaPropertyId);
            HttpClient.get(`/dashboard/analytics/top-statistics?start_date=${this.state.startDate}&end_date=${this.state.endDate}&ga_property_id=${gaPropertyId}`)
                .then(response => {
                    this.setState({ isBusy: false, analyticsTopStatistics: response.data.statistics });
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

    analyticsFetchUsersDaysAnnotations(gaPropertyId) {
        HttpClient.get(`/dashboard/analytics/users-days-annotations?start_date=${this.state.startDate}&end_date=${this.state.endDate}&ga_property_id=${gaPropertyId}&statistics_padding_days=${this.state.statisticsPaddingDays}`)
            .then(response => {
                this.setState({ isBusy: false, usersDaysStatistics: response.data.statistics, googleAccount: response.data.google_account });
            }, (err) => {
                this.setState({ isBusy: false, errors: (err.response).data });
            }).catch(err => {
                this.setState({ isBusy: false, errors: err });
            });
    }

    analyticsFetchAnnotationsMetricsDimensions(gaPropertyId) {
        HttpClient.get(`/dashboard/analytics/annotations-metrics-dimensions?start_date=${this.state.startDate}&end_date=${this.state.endDate}&ga_property_id=${gaPropertyId}&statistics_padding_days=${this.state.statisticsPaddingDays}`)
            .then(response => {
                this.setState({ isBusy: false, analyticsAnnotations: response.data.annotations });
            }, (err) => {
                this.setState({ isBusy: false, errors: (err.response).data });
            }).catch(err => {
                this.setState({ isBusy: false, errors: err });
            });
    }

    analyticsChangeStatisticsPaddingDays(statisticsPaddingDays) {
        this.setState(
            { statisticsPaddingDays: statisticsPaddingDays },
            () => {
                this.fetchUsersDaysAnnotations(this.state.ga_property_id);
                this.fetchAnnotationsMetricsDimensions(this.state.ga_property_id);
            }
        );
    }
}
