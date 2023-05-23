import React, { Component } from 'react';
import { DateRangePicker } from 'react-date-range';

import HttpClient from '../../../utils/HttpClient';
import { newStaticRanges } from '../../../utils/CustomDateRange';
import { timezoneToDateFormat } from '../../../utils/TimezoneTodateFormat';
import ErrorAlert from '../../../utils/ErrorAlert';
import GoogleAnalyticsPropertySelect from './utils/GoogleAnalyticsPropertySelect';
import { Redirect } from 'react-router';

import AnnotationsTable from './tables/annotationsTable';

import MediaGraph from './graphs/mediaGraph';
import DeviceUsersGraph from './graphs/deviceUsersGraph';
import UsersDaysWithAnnotationsGraph from './graphs/usersDaysWithAnnotationsGraph';

import NoGoogleAccountConnectedPage from '../subPages/NoGoogleAccountConnectedPage';
import NoDataFoundPage from '../subPages/NoDataFoundPage';
import TopStatistics from './utils/TopStatistics';
import ConsoleTopStatistics from './utils/ConsoleTopStatistics';
import DeviceClicksImpressionsGraph from './graphs/deviceClicksImpressionsGraph';
import MapChart from './graphs/WorldMap';
import CountriesTable from './tables/countriesTable';
import ConsoleAnnotationsTable from './tables/consoleAnnotationsTable';
import ClicksImpressionsDaysGraph from './graphs/clicksImpressionsDaysGraph';
import QueriesTable from './tables/queriesTable';
import PagesTable from './tables/pagesTable';
import AppsModal from "../../AppsMarket/AppsModal";
import ShareAnalytics from "./ShareAnalytics";


export default class IndexAnalytics extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isBusy: false,
            redirectTo: null,
            showDateRangeSelect: false,
            shareAnalyticsPopup: false,
            googleAccount: undefined,
            consoleGoogleAccount: undefined,
            topStatistics: {
                "sum_users_count": "∞",
                "sum_sessions_count": "∞",
                "sum_events_count": "∞",
                "sum_conversions_count": "∞",
            },
            consoleTopStatistics: {
                "sum_clicks_count": "∞",
                "sum_impressions_count": "∞",
                "max_ctr_count": "∞",
                "min_position_rank": "∞"
            },
            usersDaysStatistics: [],
            annotations: [],
            console_annotations: [],
            clicksImpressionsDaysStatistics: [],
            pagesStatistics: [],
            queriesStatistics: [],
            mediaStatistics: [],
            sourcesStatistics: [],
            devicesStatistics: [],
            countriesStatistics: [],
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
        this.exportExcel = this.exportExcel.bind(this);
    }
    componentDidMount() {
        document.title = 'Analytic Dashboard';
    }
    render() {

        if (!this.props.user.google_accounts_count) return <NoGoogleAccountConnectedPage />
        return <React.Fragment>
            <TopStatistics topStatistics={this.state.topStatistics} />
            <ConsoleTopStatistics topStatistics={this.state.consoleTopStatistics} />
            <div className="container-xl bg-white anno-container  d-flex flex-column justify-content-center component-wrapper" >
                <section className="ftco-section" id="inputs">
                    <div className="container-xl p-0">
                        <div className="row ml-0 mr-0 mb-1">
                            <div className="col-md-6 pl-0">
                                <h2 className="heading-section gaa-title">Analytics</h2>
                            </div>
                            <div className="col-md-6 text-right">
                                <h6 className="gaa-text-color">This page is on Beta</h6>
                            </div>
                        </div>
                        <div className="row ml-0 mr-0 mb-2">
                            {/* <div className="col-md-12 text-right">
                            <button className="btn gaa-btn-primary btn-sm" onClick={() => {
                                html2canvas(document.getElementById("dashboard-index-container")).then(function (canvas) {
                                    const link = document.createElement("a");
                                    link.download = "dashboard_analytics.png";
                                    canvas.toBlob(function (blob) {
                                        link.href = URL.createObjectURL(blob);
                                        link.click();
                                    });
                                });
                            }}><i className="fa fa-file-picture-o"></i> Download</button>
                        </div> */}
                            <div className="col-md-12 text-right">
                                <button className="btn gaa-btn-primary btn-sm" onClick={() => {
                                    html2pdf(document.getElementById("dashboard-index-container"), {
                                        margin: 0.5,
                                        filename: 'dashboard_analytics.pdf',
                                        image: { type: 'jpeg', quality: 1.0 },
                                        html2canvas: { scale: 1 },
                                        jsPDF: { unit: 'in', format: 'A4', orientation: 'landscape' }
                                    });
                                }}><i className="fa fa-file-pdf-o"></i> Download</button>

                            </div>
                        </div>
                        <div className="row ml-0 mr-0 mb-2">
                            <div className="col-md-12 text-right">
                                <button className="btn gaa-btn-primary btn-sm" onClick={() => this.exportExcel(this.state.redirectTo)}><i className="fa fa-file-excel-o"></i> Download Excel</button>
                            </div>
                        </div>
                        <div className="row ml-0 mr-0 mb-2">
                            <div className="col-md-12 text-right">
                                <button className="btn gaa-btn-primary btn-sm" onClick={() => this.setState({shareAnalyticsPopup: true})}><i className="fa fa-file-excel-o"></i> Share Report</button>
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
                            <div className="row ml-0 mr-0 mt-3">
                                <div style={{ maxWidth: '10%', width: '10%' }} >
                                    Property:
                                </div>
                                <div style={{ maxWidth: '30%', width: '30%' }} >
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
                            {
                                this.state.clicksImpressionsDaysStatistics.length ?
                                    <React.Fragment>
                                        <ClicksImpressionsDaysGraph statistics={this.state.clicksImpressionsDaysStatistics} />
                                        <ConsoleAnnotationsTable user={this.props.user} annotations={this.state.console_annotations} satisticsPaddingDaysCallback={this.changeStatisticsPaddingDays} statisticsPaddingDays={this.state.statisticsPaddingDays} />
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
                                    </React.Fragment>
                                    :
                                    <NoDataFoundPage googleAccount={this.state.consoleGoogleAccount} />
                            }
                        </div>
                    </div>
                </section>
            </div >
            
            <AppsModal isOpen={this.state.shareAnalyticsPopup} popupSize={'md'} toggle={() => {
                    this.setState({shareAnalyticsPopup: false,});
                }}>
                <div className="popupContent modal-createUser">
                    <div className="apps-modalHead">
                        <div className="d-flex justify-content-between align-items-center">
                            <div className="d-flex justify-content-start align-items-center"><h2>Share Analytics</h2>
                            </div>
                            <span onClick={() => this.setState({shareAnalyticsPopup: false,})} className="btn-close">
                                <img className="inject-me" src="/close-icon.svg" width="26" height="26"
                                        alt="menu icon"/>
                            </span>
                        </div>
                    </div>

                    <ShareAnalytics toggle={() => {
                        this.setState({shareAnalyticsPopup: false,});
                    }}  user={this.props.user}
                        ga_property_id={this.state.ga_property_id}
                        statisticsPaddingDays={this.state.statisticsPaddingDays}
                        start_date={this.state.startDate}
                        end_date={this.state.endDate}
                        upgradePopup={this.props.upgradePopup}
                    />
                </div>
            </AppsModal>
        </React.Fragment>;
    }

    fetchStatistics(gaPropertyId) {
        if (!this.state.isBusy) {
            this.setState({ isBusy: true });
            this.fetchUsersDaysAnnotations(gaPropertyId);
            this.fetchAnnotationsMetricsDimensions(gaPropertyId);
            HttpClient.get(`/dashboard/analytics/top-statistics?start_date=${this.state.startDate}&end_date=${this.state.endDate}&ga_property_id=${gaPropertyId}`)
                .then(response => {
                    this.setState({ isBusy: false, topStatistics: response.data.statistics });
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
            HttpClient.get(`/dashboard/analytics/device-by-impression?start_date=${this.state.startDate}&end_date=${this.state.endDate}&ga_property_id=${gaPropertyId}`)
            .then(response => {
                if(response.upgradePopup)
                {
                    // this.props.upgradePopup('console-modal');
                }
                this.setState({ isBusy: false, devicesStatistics: response.data.statistics });
            }, (err) => {
                this.setState({ isBusy: false, errors: (err.response).data });
            }).catch(err => {
                this.setState({ isBusy: false, errors: err });
            });
            HttpClient.get(`/dashboard/analytics/countries?start_date=${this.state.startDate}&end_date=${this.state.endDate}&ga_property_id=${gaPropertyId}`)
            .then(response => {
                this.setState({ isBusy: false, countriesStatistics: response.data.statistics });
            }, (err) => {
                this.setState({ isBusy: false, errors: (err.response).data });
            }).catch(err => {
                this.setState({ isBusy: false, errors: err });
            });
            HttpClient.get(`/dashboard/search-console/top-statistics?start_date=${this.state.startDate}&end_date=${this.state.endDate}&ga_property_id=${gaPropertyId}`)
                .then(response => {
                    this.setState({ isBusy: false, consoleTopStatistics: response.data.statistics });
                }, (err) => {
                    this.setState({ isBusy: false, errors: (err.response).data });
                }).catch(err => {
                    this.setState({ isBusy: false, errors: err });
                });
            HttpClient.get(`/dashboard/search-console/clicks-impressions-days-annotations?start_date=${this.state.startDate}&end_date=${this.state.endDate}&ga_property_id=${gaPropertyId}&statistics_padding_days=${this.state.statisticsPaddingDays}`)
                .then(response => {
                    this.setState({ isBusy: false, clicksImpressionsDaysStatistics: response.data.statistics });
                }, (err) => {
                    this.setState({ isBusy: false, errors: (err.response).data });
                }).catch(err => {
                    this.setState({ isBusy: false, errors: err });
                });
            HttpClient.get(`/dashboard/search-console/annotations-dates?start_date=${this.state.startDate}&end_date=${this.state.endDate}&ga_property_id=${gaPropertyId}&statistics_padding_days=${this.state.statisticsPaddingDays}`)
                .then(response => {
                    this.setState({ isBusy: false, console_annotations: response.data.annotations });
                }, (err) => {
                    this.setState({ isBusy: false, errors: (err.response).data });
                }).catch(err => {
                    this.setState({ isBusy: false, errors: err });
                });
            HttpClient.get(`/dashboard/search-console/queries?start_date=${this.state.startDate}&end_date=${this.state.endDate}&ga_property_id=${gaPropertyId}`)
                .then(response => {
                    this.setState({ isBusy: false, queriesStatistics: response.data.statistics, consoleGoogleAccount: response.data.google_account });
                }, (err) => {
                    this.setState({ isBusy: false, errors: (err.response).data });
                }).catch(err => {
                    this.setState({ isBusy: false, errors: err });
                });
            HttpClient.get(`/dashboard/search-console/pages?start_date=${this.state.startDate}&end_date=${this.state.endDate}&ga_property_id=${gaPropertyId}`)
                .then(response => {
                    this.setState({ isBusy: false, pagesStatistics: response.data.statistics });
                }, (err) => {
                    this.setState({ isBusy: false, errors: (err.response).data });
                }).catch(err => {
                    this.setState({ isBusy: false, errors: err });
                });
            this.setState({redirectTo:`/export-statistics?start_date=${this.state.startDate}&end_date=${this.state.endDate}&ga_property_id=${gaPropertyId}&statistics_padding_days=${this.state.statisticsPaddingDays}`});
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

    fetchAnnotationsMetricsDimensions(gaPropertyId) {
        HttpClient.get(`/dashboard/analytics/annotations-metrics-dimensions?start_date=${this.state.startDate}&end_date=${this.state.endDate}&ga_property_id=${gaPropertyId}&statistics_padding_days=${this.state.statisticsPaddingDays}`)
            .then(response => {
                this.setState({ isBusy: false, annotations: response.data.annotations });
            }, (err) => {
                this.setState({ isBusy: false, errors: (err.response).data });
            }).catch(err => {
                this.setState({ isBusy: false, errors: err });
            });
    }

    changeStatisticsPaddingDays(statisticsPaddingDays) {
        this.setState(
            { statisticsPaddingDays: statisticsPaddingDays },
            () => {
                this.fetchUsersDaysAnnotations(this.state.ga_property_id);
                this.fetchAnnotationsMetricsDimensions(this.state.ga_property_id);
            }
        );
    }
    
    exportExcel(redirectTo) {
        window.location.replace(redirectTo);
    }
}