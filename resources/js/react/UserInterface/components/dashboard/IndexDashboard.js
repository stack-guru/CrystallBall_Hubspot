import React, {Component} from 'react';
import Toast from "../../utils/Toast";
import {DateRangePicker} from 'react-date-range';

import HttpClient from '../../utils/HttpClient';
import ErrorAlert from '../../utils/ErrorAlert';
import {newStaticRanges} from '../../utils/CustomDateRange';
import {timezoneToDateFormat} from '../../utils/TimezoneTodateFormat';
import GoogleSearchConsoleSiteSelect from '../../utils/GoogleSearchConsoleSiteSelect';
import GoogleAnalyticsPropertySelect from '../../utils/GoogleAnalyticsPropertySelect';

import NoGoogleAccountConnectedPage from './subPages/NoGoogleAccountConnectedPage';
import NoDataFoundPage from './subPages/NoDataFoundPage';

import SearchConsoleTopStatistics from './searchConsole/utils/TopStatistics';
import PagesTable from './searchConsole/tables/pagesTable'
import QueriesTable from './searchConsole/tables/queriesTable'
import CountriesTable from './searchConsole/tables/countriesTable'
import ClicksImpressionsDaysGraph from './searchConsole/graphs/clicksImpressionsDaysGraph';
import DeviceClicksImpressionsGraph from './searchConsole/graphs/deviceClicksImpressionsGraph';
import MapChart from './searchConsole/graphs/WorldMap';

import AnalyticsTopStatistics from './analytics/utils/TopStatistics';
import MediaGraph from './analytics/graphs/mediaGraph';
import DeviceUsersGraph from './analytics/graphs/deviceUsersGraph';
import UsersDaysWithAnnotationsGraph from './analytics/graphs/usersDaysWithAnnotationsGraph';
import AnnotationsTable from './annotationsTable';
import {Container, FormGroup, Input, Label} from 'reactstrap';

const SimpleMasonry = (props) => {
    return <div className={"simple-masonary " + (props.className ?? "")}>
        <p>{props.label} <span className="badge badge-pill">{props.value}</span></p>
    </div>
}

export default class IndexDashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isBusy: false,
            googleAnalyticsProperties: [],
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
            googleSearchConsoleSites: [],
            // Analytics
            usersDaysStatistics: [],
            mediaStatistics: [],
            sourcesStatistics: [],
            deviceCategoriesStatistics: [],
            analyticsAnnotations: [],
            ga_property_id: '*',

            startDate: moment().subtract(14, 'days').format('YYYY-MM-DD'),
            endDate: moment().subtract(2, 'days').format('YYYY-MM-DD'),

            statisticsPaddingDays: 3,
            errors: undefined,
            sortBy: "",
            searchText: ""
        };

        this.searchConsoleFetchStatistics = this.searchConsoleFetchStatistics.bind(this);
        this.changeStatisticsPaddingDays = this.changeStatisticsPaddingDays.bind(this);

        this.analyticsFetchStatistics = this.analyticsFetchStatistics.bind(this);
        this.analyticsFetchUsersDaysAnnotations = this.analyticsFetchUsersDaysAnnotations.bind(this);
        this.changeStatisticsPaddingDays = this.changeStatisticsPaddingDays.bind(this);


        this.getGoogleAccounts = this.getGoogleAccounts.bind(this);
        this.getGAAccounts = this.getGAAccounts.bind(this);
        this.getGAProperties = this.getGAProperties.bind(this);
        this.getGSCSites = this.getGSCSites.bind(this);
        this.sort = this.sort.bind(this);
        this.handleGAPDelete = this.handleGAPDelete.bind(this);
    }

    componentDidMount() {
        document.title = 'Ga Accounts';
        this.getGoogleAccounts();
        this.getGAAccounts();
        this.getGAProperties();
        this.getGSCSites();
    }

    render() {

        // if (!this.props.user.google_accounts_count) return <NoGoogleAccountConnectedPage />

        let searchConsoleData = {};
        this.state.searchConsoleAnnotations.forEach(a => {
            searchConsoleData[a.show_at] = a;
        });

        let analyticsData = {};
        this.state.analyticsAnnotations.forEach(a => {
            analyticsData[a.show_at] = a;
        });

        const allDates = [...new Set(Object.keys(searchConsoleData).concat(Object.keys(analyticsData)))];

        return <React.Fragment>
            <div id="analaticsAccountPage" className="analaticsAccountPage pageWrapper">
                <Container>
                    <div className="pageHeader analaticsAccountPageHead">
                        <h2 className="pageTitle">Analytics Accounts</h2>
                        <form className="pageFilters d-flex justify-content-between align-items-center">
                            <FormGroup className="filter-sort position-relative">
                                <Label className="sr-only" for="dropdownFilters">sort by filter</Label>
                                <i className="btn-searchIcon left-0">
                                    <svg width="12" height="10" viewBox="0 0 12 10" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M0 10V8.33333H4V10H0ZM0 5.83333V4.16667H8V5.83333H0ZM0 1.66667V0H12V1.66667H0Z"
                                            fill="#666666"/>
                                    </svg>
                                </i>
                                <i className="btn-searchIcon right-0 fa fa-angle-down"></i>
                                <select name="sortBy" id="sort-by" value={this.state.sortBy} className="form-control"
                                        onChange={this.sort}>
                                    <option value="">Sort By</option>
                                    <option value="google_search_console_site_id">Connected</option>
                                    <option value="is_in_use">In Use</option>
                                </select>
                             </FormGroup>

                            <FormGroup className="filter-search position-relative">
                                <Label className="sr-only" for="search">search</Label>
                                <Input name="searchText" value={this.state.searchText} onChange={(ev) => {
                                    this.setState({
                                        searchText: ev.target.value
                                    })}} placeholder="Search..." />
                                    <button className="btn-searchIcon"><img className="d-block" src="/search-new.svg" width="16" height="16" alt="Search" /></button>
                            </FormGroup>
                        </form>
                    </div>

                    <div className="dataTable dataTableAnalyticsAccount d-flex flex-column">
                        <div className="dataTableHolder">
                            <div className="tableHead singleRow justify-content-between align-items-center">
                                <div className="singleCol text-left">ID for API-Zapier</div>
                                <div className="singleCol text-left">Analytics Accounts</div>
                                <div className="singleCol text-left">Properties &amp; Apps</div>
                                <div className="singleCol text-left">Search Console <i className='fa fa-exclamation-circle ml-2' data-toggle="tooltip" data-placement="top" title="Please remove and reconnect account"></i></div>
                                <div className="singleCol text-left">Google Account</div>
                                <div className="singleCol text-right">&nbsp;</div>
                            </div>
                            <div className="tableBody">

                                {this.state.googleAnalyticsProperties.map(gAP => {
                                    if(this.state.searchText && (gAP.google_analytics_account || "").name.toLowerCase().indexOf(this.state.searchText.toLowerCase()) === -1 && (gAP.name || "").toLowerCase().indexOf(this.state.searchText.toLowerCase()) === -1) {
                                        return true;
                                    }
                                    return (
                                    <div className="singleRow justify-content-between align-items-center" key={gAP.id}>
                                        <div className="singleCol text-left"><span>{gAP.id}</span></div>
                                        <div className="singleCol text-left">
                                                    <span className='w-100 d-flex justify-content-start'>
                                                        <span className={"text-truncate"}>{
                                                            (gAP.google_analytics_account) ?
                                                                gAP.google_analytics_account.name :
                                                                ''
                                                        }</span>
                                                        {
                                                            gAP.is_in_use ?
                                                                <em className='tag-inuse'><i className='fa fa-check'></i><i>In
                                                                    use</i></em> :
                                                                null
                                                        }
                                                    </span>
                                        </div>
                                        <div className="singleCol text-left">
                                            <span className='d-flex justify-content-between w-100'>
                                                <span>{gAP.name}</span>
                                                {gAP.google_search_console_site_id ? <i><img src={'/icon-link-green.svg'} /></i> : null}
                                            </span>
                                        </div>
                                        <div className="singleCol text-left d-flex flex-column">
                                            <div className="themeNewInputStyle position-relative w-100">
                                                <i className="btn-searchIcon right-0 fa fa-angle-down"></i>
                                                <select name="" value={gAP.google_search_console_site_id} className={`form-control ${gAP.google_search_console_site_id ? 'selected' : null}`} onChange={(event) => this.handleGAPUpdate(gAP, { google_search_console_site_id: event.target.value })}>
                                                    <option value="">Select website</option>
                                                    {
                                                        this.state.googleSearchConsoleSites.map(gSCS => <option value={gSCS.id} key={gSCS.id}>{gSCS.site_url} from {gSCS.google_account.name}</option>)
                                                    }
                                                </select>
                                                <i className="btn-searchIcon left-0 fa fa-check-circle"></i>
                                            </div>
                                        </div>
                                        <div className="singleCol text-left"><span>{
                                                gAP.google_account ?
                                                    gAP.google_account.name :
                                                    null
                                            }</span></div>
                                        <div className="singleCol text-right">
                                            <a href="javascript:void(0);" onClick={() => this.handleGAPDelete(gAP.id)} >
                                                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M6.70312 18.2188C6.23047 18.2188 5.82599 18.0506 5.48969 17.7143C5.15281 17.3774 4.98438 16.9727 4.98438 16.5V5.32812H4.125V3.60938H8.42188V2.75H13.5781V3.60938H17.875V5.32812H17.0156V16.5C17.0156 16.9727 16.8475 17.3774 16.5112 17.7143C16.1743 18.0506 15.7695 18.2188 15.2969 18.2188H6.70312ZM15.2969 5.32812H6.70312V16.5H15.2969V5.32812ZM8.42188 14.7812H10.1406V7.04688H8.42188V14.7812ZM11.8594 14.7812H13.5781V7.04688H11.8594V14.7812ZM6.70312 5.32812V16.5V5.32812Z" fill="#F44C3D"/>
                                                </svg>
                                            </a>
                                            {/* <span><img src={`/icon-trash.svg`} onClick={() => this.handleGAPDelete(gAP.id)} /></span> */}
                                            </div>
                                    </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </Container>
            </div>
    {/* <div className="container-xl bg-white anno-container  d-flex flex-column justify-content-center component-wrapper" >
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
                    </div>
                </section>
                <div className="row ml-0 mr-0 mt-3">
                    <div className="col-1 pt-1 text-black">Website:</div>
                    <div className="col-4" >
                        <GoogleSearchConsoleSiteSelect
                            name="google_search_console_site_id"
                            id="google_search_console_site_id"
                            value={this.state.google_search_console_site_id}
                            onChangeCallback={(event) => {
                                this.setState({ google_search_console_site_id: event.target.value });
                                this.searchConsoleFetchStatistics(event.target.value);
                                if (!event.target.wasLastDataFetchingSuccessful) {
                                    swal.fire('Oops...', "There was an error when fetching data from Google. ", 'info');
                                }
                            }} placeholder="Select Site"
                            components={{ IndicatorSeparator: () => null }}
                            autoSelectFirst
                        />
                    </div>
                    <div className="col-3">
                        <SimpleMasonry label="Clicks" value={this.state.searchConsoleTopStatistics.sum_clicks_count} className="simple-masonary-green" />
                    </div>
                    <div className="col-3">
                        <SimpleMasonry label="Impressions" value={this.state.searchConsoleTopStatistics.sum_impressions_count} className="simple-masonary-purple" />
                    </div>
                </div>
                <div className="row ml-0 mr-0 mt-2">
                    <div className="col-1 pt-1 text-black">Property:</div>
                    <div className="col-4" >
                        <GoogleAnalyticsPropertySelect
                            name="ga_property_id"
                            id="ga_property_id"
                            value={this.state.ga_property_id}
                            onChangeCallback={(event) => {
                                this.setState({ ga_property_id: event.target.value });
                                this.analyticsFetchStatistics(event.target.value);
                                if (!event.target.wasLastDataFetchingSuccessful) {
                                    swal.fire('Oops...', "There was an error when fetching data from Google. ", 'info');
                                }
                            }} placeholder="Select GA Properties"
                            components={{ IndicatorSeparator: () => null }}
                            autoSelectFirst
                        />
                    </div>
                    <div className="col-3">
                        <SimpleMasonry label="Users" value={this.state.analyticsTopStatistics.sum_users_count} className="simple-masonary-pink" />
                    </div>
                    <div className="col-3">
                        <SimpleMasonry label="Conversions" value={this.state.analyticsTopStatistics.sum_conversions_count} className="simple-masonary-blue" />
                    </div>
                </div>
                <div className="row ml-0 mr-0 mt-2 mb-4">
                    <div className="col-1 pt-1 text-black" >Date:</div>
                    <div className="col-4" >
                        <button className="btn thin-light-gray-border w-100 text-left date-range-dropdown-arrow-container"
                            onClick={() => { this.setState({ showDateRangeSelect: !this.state.showDateRangeSelect }); }}>
                            From: {moment(this.state.startDate).format(timezoneToDateFormat(this.props.user.timezone))}
                            &nbsp;&nbsp;&nbsp;
                            To: {moment(this.state.endDate).format(timezoneToDateFormat(this.props.user.timezone))}
                            &nbsp;
                            <svg height="20" width="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false" className="date-range-dropdown-arrow float-right">
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
                <section className="ftco-section" id="inputs">
                    <div className="container-xl p-0">
                        <div id="dashboard-index-container">
                            <div className="row ml-0 mr-0">
                                <div className="col-md-12">
                                    <ErrorAlert errors={this.state.errors} />
                                </div>
                            </div>
                            {
                                this.state.clicksImpressionsDaysStatistics.length ?
                                    <React.Fragment>
                                        <UsersDaysWithAnnotationsGraph statistics={this.state.usersDaysStatistics} />
                                        <ClicksImpressionsDaysGraph statistics={this.state.clicksImpressionsDaysStatistics} />
                                        <AnnotationsTable
                                            allDates={allDates}
                                            analyticsData={analyticsData}
                                            searchConsoleData={searchConsoleData}
                                            user={this.props.user}
                                            statisticsPaddingDays={this.state.statisticsPaddingDays}
                                            satisticsPaddingDaysCallback={this.changeStatisticsPaddingDays}
                                        />
                                        <div className="row ml-0 mr-0 mt-4">
                                            <div className="col-5">
                                                <MediaGraph statistics={this.state.mediaStatistics} />
                                            </div>
                                            <div className="col-7 scrollable p-0">
                                                <table className="table table-bordered table-hover gaa-hover">
                                                    <thead><tr><th></th><th>Source</th><th>Users</th><th>Conversions</th><th>Conversion Rate</th></tr></thead>
                                                    <tbody>
                                                        {
                                                            this.state.sourcesStatistics.map(sS => {
                                                                const conversionRate = sS.sum_conversions_count && sS.sum_users_count ? ((sS.sum_conversions_count / sS.sum_users_count) * 100).toFixed(2) : 0;
                                                                return <tr key={sS.source_name}>
                                                                    <td><img height="25px" width="25px" src={`https://${sS.source_name}/favicon.ico`} onError={(e) => { e.target.remove(); }} /></td>
                                                                    <td>{sS.source_name}</td>
                                                                    <td>{sS.sum_users_count}</td>
                                                                    <td>{sS.sum_conversions_count}</td>
                                                                    <td>{conversionRate}%</td>
                                                                </tr>
                                                            })
                                                        }
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <div className="row ml-0 mr-0 mt-4">
                                            <div className="col-6 p-0 scrollable border">
                                                <QueriesTable queriesStatistics={this.state.queriesStatistics} />
                                            </div>
                                            <div className="col-6 p-0 scrollable border-bottom">
                                                <PagesTable pagesStatistics={this.state.pagesStatistics} />
                                            </div>
                                        </div>
                                        <div className="row ml-0 mr-0 mt-4">
                                            <div className="col-6 border">
                                                <DeviceUsersGraph deviceCategoriesStatistics={this.state.deviceCategoriesStatistics} />
                                            </div>
                                            <div className="col-6 border">
                                                <DeviceClicksImpressionsGraph devicesStatistics={this.state.devicesStatistics} />
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
                                    </React.Fragment>
                                    :
                                    <NoDataFoundPage googleAccount={this.state.googleAccount} />
                            }
                        </div>
                    </div>
                </section>
            </div > */
    }
    </React.Fragment>
        ;
    }

    sort(e) {
        this.setState({
            sortBy: e.target.value,
        }, this.getGAProperties);
    }

    searchConsoleFetchStatistics(gSCSiteId) {
        if (!this.state.isBusy) {
            this.setState({isBusy: true});
            HttpClient.get(`/dashboard/search-console/top-statistics?start_date=${this.state.startDate}&end_date=${this.state.endDate}&google_search_console_site_id=${gSCSiteId}`)
                .then(response => {
                    this.setState({isBusy: false, searchConsoleTopStatistics: response.data.statistics});
                }, (err) => {
                    this.setState({isBusy: false, errors: (err.response).data});
                }).catch(err => {
                this.setState({isBusy: false, errors: err});
            });
            HttpClient.get(`/dashboard/search-console/clicks-impressions-days-annotations?start_date=${this.state.startDate}&end_date=${this.state.endDate}&google_search_console_site_id=${gSCSiteId}&statistics_padding_days=${this.state.statisticsPaddingDays}`)
                .then(response => {
                    this.setState({isBusy: false, clicksImpressionsDaysStatistics: response.data.statistics});
                }, (err) => {
                    this.setState({isBusy: false, errors: (err.response).data});
                }).catch(err => {
                this.setState({isBusy: false, errors: err});
            });
            HttpClient.get(`/dashboard/search-console/annotations-dates?start_date=${this.state.startDate}&end_date=${this.state.endDate}&google_search_console_site_id=${gSCSiteId}&statistics_padding_days=${this.state.statisticsPaddingDays}`)
                .then(response => {
                    this.setState({isBusy: false, searchConsoleAnnotations: response.data.annotations});
                }, (err) => {
                    this.setState({isBusy: false, errors: (err.response).data});
                }).catch(err => {
                this.setState({isBusy: false, errors: err});
            });
            HttpClient.get(`/dashboard/search-console/queries?start_date=${this.state.startDate}&end_date=${this.state.endDate}&google_search_console_site_id=${gSCSiteId}`)
                .then(response => {
                    this.setState({
                        isBusy: false,
                        queriesStatistics: response.data.statistics,
                        googleAccount: response.data.google_account
                    });
                }, (err) => {
                    this.setState({isBusy: false, errors: (err.response).data});
                }).catch(err => {
                this.setState({isBusy: false, errors: err});
            });
            HttpClient.get(`/dashboard/search-console/pages?start_date=${this.state.startDate}&end_date=${this.state.endDate}&google_search_console_site_id=${gSCSiteId}`)
                .then(response => {
                    this.setState({isBusy: false, pagesStatistics: response.data.statistics});
                }, (err) => {
                    this.setState({isBusy: false, errors: (err.response).data});
                }).catch(err => {
                this.setState({isBusy: false, errors: err});
            });
            HttpClient.get(`/dashboard/search-console/countries?start_date=${this.state.startDate}&end_date=${this.state.endDate}&google_search_console_site_id=${gSCSiteId}`)
                .then(response => {
                    this.setState({isBusy: false, countriesStatistics: response.data.statistics});
                }, (err) => {
                    this.setState({isBusy: false, errors: (err.response).data});
                }).catch(err => {
                this.setState({isBusy: false, errors: err});
            });
            HttpClient.get(`/dashboard/search-console/devices?start_date=${this.state.startDate}&end_date=${this.state.endDate}&google_search_console_site_id=${gSCSiteId}`)
                .then(response => {
                    this.setState({isBusy: false, devicesStatistics: response.data.statistics});
                }, (err) => {
                    this.setState({isBusy: false, errors: (err.response).data});
                }).catch(err => {
                this.setState({isBusy: false, errors: err});
            });
            HttpClient.get(`/dashboard/search-console/search-appearances?start_date=${this.state.startDate}&end_date=${this.state.endDate}&google_search_console_site_id=${gSCSiteId}`)
                .then(response => {
                    this.setState({isBusy: false, searchApearancesStatistics: response.data.statistics});
                }, (err) => {
                    this.setState({isBusy: false, errors: (err.response).data});
                }).catch(err => {
                this.setState({isBusy: false, errors: err});
            });
        }
    }

    changeStatisticsPaddingDays(statisticsPaddingDays) {
        this.setState(
            {statisticsPaddingDays: statisticsPaddingDays},
            () => {
                this.searchConsoleFetchStatistics(this.state.google_search_console_site_id);
                this.analyticsFetchUsersDaysAnnotations(this.state.ga_property_id);
                this.analyticsFetchAnnotationsMetricsDimensions(this.state.ga_property_id);
            }
        );
    }

    analyticsFetchStatistics(gaPropertyId) {
        if (!this.state.isBusy) {
            this.setState({isBusy: true});
            this.analyticsFetchUsersDaysAnnotations(gaPropertyId);
            this.analyticsFetchAnnotationsMetricsDimensions(gaPropertyId);
            HttpClient.get(`/dashboard/analytics/top-statistics?start_date=${this.state.startDate}&end_date=${this.state.endDate}&ga_property_id=${gaPropertyId}`)
                .then(response => {
                    this.setState({isBusy: false, analyticsTopStatistics: response.data.statistics});
                }, (err) => {
                    this.setState({isBusy: false, errors: (err.response).data});
                }).catch(err => {
                this.setState({isBusy: false, errors: err});
            });
            HttpClient.get(`/dashboard/analytics/media?start_date=${this.state.startDate}&end_date=${this.state.endDate}&ga_property_id=${gaPropertyId}`)
                .then(response => {
                    this.setState({isBusy: false, mediaStatistics: response.data.statistics});
                }, (err) => {
                    this.setState({isBusy: false, errors: (err.response).data});
                }).catch(err => {
                this.setState({isBusy: false, errors: err});
            });
            HttpClient.get(`/dashboard/analytics/sources?start_date=${this.state.startDate}&end_date=${this.state.endDate}&ga_property_id=${gaPropertyId}`)
                .then(response => {
                    this.setState({isBusy: false, sourcesStatistics: response.data.statistics});
                }, (err) => {
                    this.setState({isBusy: false, errors: (err.response).data});
                }).catch(err => {
                this.setState({isBusy: false, errors: err});
            });
            HttpClient.get(`/dashboard/analytics/device-categories?start_date=${this.state.startDate}&end_date=${this.state.endDate}&ga_property_id=${gaPropertyId}`)
                .then(response => {
                    this.setState({isBusy: false, deviceCategoriesStatistics: response.data.statistics});
                }, (err) => {
                    this.setState({isBusy: false, errors: (err.response).data});
                }).catch(err => {
                this.setState({isBusy: false, errors: err});
            });
        }
    }

    analyticsFetchUsersDaysAnnotations(gaPropertyId) {
        HttpClient.get(`/dashboard/analytics/users-days-annotations?start_date=${this.state.startDate}&end_date=${this.state.endDate}&ga_property_id=${gaPropertyId}&statistics_padding_days=${this.state.statisticsPaddingDays}`)
            .then(response => {
                this.setState({
                    isBusy: false,
                    usersDaysStatistics: response.data.statistics,
                    googleAccount: response.data.google_account
                });
            }, (err) => {
                this.setState({isBusy: false, errors: (err.response).data});
            }).catch(err => {
            this.setState({isBusy: false, errors: err});
        });
    }

    handleGAPDelete(gaPropertyId) {
        const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener("mouseenter", Swal.stopTimer);
                toast.addEventListener("mouseleave", Swal.resumeTimer);
            },
        });
        if (gaPropertyId) {
            let params = {
                property_id: gaPropertyId,
            };
            HttpClient.post(
                "/settings/google-analytics-property/destroy",
                params
            )
                .then(
                    (resp) => {
                        this.componentDidMount();
                        Toast.fire({
                            icon: "success",
                            title: "Deleted successfully!",
                        });
                    },
                    (err) => {
                        this.setState({
                            isBusy: false,
                            errors: err.response.data,
                        });
                    }
                )
                .catch((err) => {
                    this.setState({isBusy: false, errors: err});
                });

        }
    }

    analyticsFetchAnnotationsMetricsDimensions(gaPropertyId) {
        HttpClient.get(`/dashboard/analytics/annotations-metrics-dimensions?start_date=${this.state.startDate}&end_date=${this.state.endDate}&ga_property_id=${gaPropertyId}&statistics_padding_days=${this.state.statisticsPaddingDays}`)
            .then(response => {
                this.setState({isBusy: false, analyticsAnnotations: response.data.annotations});
            }, (err) => {
                this.setState({isBusy: false, errors: (err.response).data});
            }).catch(err => {
            this.setState({isBusy: false, errors: err});
        });
    }

    fetchGAAccounts(id) {
        this.setState({isBusy: true});
        return HttpClient.post(`/settings/google-analytics-account/google-account/${id}`).then(resp => {
            Toast.fire({
                icon: 'success',
                title: "Accounts fetched."
            });
            this.setState({isBusy: false})
            return this.getGAAccounts() && this.getGAProperties();
        }, (err) => {
            this.setState({isBusy: false, errors: (err.response).data});
            return false;
        }).catch(err => {
            this.setState({isBusy: false, errors: err});
            return false;
        });
    }

    getGAProperties() {
        this.setState({isBusy: true});
        return HttpClient.get(`/settings/google-analytics-property?sortBy=${this.state.sortBy}`).then(response => {
            this.setState({isBusy: false, googleAnalyticsProperties: response.data.google_analytics_properties})
            return true;
        }, (err) => {
            this.setState({isBusy: false, errors: (err.response).data});
            return false;
        }).catch(err => {
            this.setState({isBusy: false, errors: err});
            return false;
        });
    }

    getGoogleAccounts() {
        this.setState({isBusy: true})
        HttpClient.get('/settings/google-account').then(resp => {
            this.setState({googleAccounts: resp.data.google_accounts, isBusy: false});
        }, (err) => {

            this.setState({isBusy: false, errors: (err.response).data});
        }).catch(err => {

            this.setState({isBusy: false, errors: err});
        });
    }

    getGAAccounts() {
        this.setState({isBusy: true});
        return HttpClient.get(`/settings/google-analytics-account`).then(response => {
            this.setState({isBusy: false, googleAnalyticsAccounts: response.data.google_analytics_accounts})
            return true;
        }, (err) => {
            this.setState({isBusy: false, errors: (err.response).data});
            return false;
        }).catch(err => {
            this.setState({isBusy: false, errors: err});
            return false;
        });
    }

    getGSCSites() {
        this.setState({isBusy: true});
        return HttpClient.get(`/settings/google-search-console-site`).then(response => {
            this.setState({isBusy: false, googleSearchConsoleSites: response.data.google_search_console_sites})
            return true;
        }, (err) => {
            this.setState({isBusy: false, errors: (err.response).data});
            return false;
        }).catch(err => {
            this.setState({isBusy: false, errors: err});
            return false;
        });
    }

    handleGAPUpdate(gAP, data) {
        this.setState({isBusy: true});
        HttpClient.put(`/settings/google-analytics-property/${gAP.id}`, data).then(resp => {
            const updatedGAP = resp.data.google_analytics_property;
            Toast.fire({
                icon: 'success',
                title: "Google Analytics Property updated."
            });
            this.setState({
                isBusy: false,
                googleAnalyticsProperties: this.state.googleAnalyticsProperties.map(g => g.id == updatedGAP.id ? updatedGAP : g)
            });
        }, (err) => {
            this.setState({isBusy: false, errors: (err.response).data});
        }).catch(err => {
            this.setState({isBusy: false, errors: err});
        });
    }
}
