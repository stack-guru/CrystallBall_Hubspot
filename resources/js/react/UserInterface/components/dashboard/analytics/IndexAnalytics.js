import React, { Component } from 'react';
import { DateRangePicker,DateRange } from 'react-date-range';


import HttpClient from '../../../utils/HttpClient';
import { newStaticRanges } from '../../../utils/CustomDateRange';
import { timezoneToDateFormat } from '../../../utils/TimezoneTodateFormat';
import ErrorAlert from '../../../utils/ErrorAlert';
import Toast from "../../../utils/Toast";
import DashboardSelect from './utils/DashboardSelect';
import GoogleAnalyticsPropertySelect from './utils/GoogleAnalyticsPropertySelect';
import { Redirect } from 'react-router';

import AnnotationsTable from './tables/annotationsTable';

import MediaGraph from './graphs/mediaGraph';
import DeviceUsersGraph from './graphs/deviceUsersGraph';
import UsersDaysWithAnnotationsGraph from './graphs/usersDaysWithAnnotationsGraph';
import UsersDaysGraph from './graphs/usersDaysGraph';

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
import DeviceByConversationTable from './tables/deviceByConversationTable';
// import {
//     LineChart,
//     Line,
//     XAxis,
//     YAxis,
//     CartesianGrid,
//     Tooltip,
//     Legend,
//     Pie,
//     PieChart,
//     Cell,
//     BarChart,
//     Bar,
//     AreaChart,
//     Area,
// } from "recharts";
import { FormGroup, Label } from "reactstrap";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter,UncontrolledPopover,PopoverHeader,PopoverBody } from "reactstrap";

import { CircularProgressbar } from "react-circular-progressbar";
import SharePopups from '../../ReportingDashboard/SharePopups';
import ActiveRecurrence from '../../ReportingDashboard/ActiveRecurrence';


import AppsModal from "../../AppsMarket/AppsModal";
import ShareAnalytics from "./ShareAnalytics";
import { DefinedRange } from 'react-date-range';
import ShareReportIndex from "./ShareReportIndex";


export default class IndexAnalytics extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isBusy: false,
            redirectTo: null,
            showDateRangeSelect: false,
            shareAnalyticsPopup: false,
            shareReportIndexPopup: false,
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
            dashboard_activities: [],
            dashboard_activities_for_popup: [],
            startDate: moment().subtract(14, 'days').format('YYYY-MM-DD'),
            endDate: moment().subtract(1, 'days').format('YYYY-MM-DD'),
            ga_property_id: '*',
            statisticsPaddingDays: 7,
            errors: undefined,
            dateRange:[
                {
                  startDate: new Date(),
                  endDate: null,
                //   key: 'selection'
                }],

            // dummydata

            user: this.props.user,
            graph: null,
            annotationTable: null,
            attributionSourceTable: null,
            deviceByImpression: null,
            deviceByConversion: null,
            countries: null,
            isLoading: true,
            selectedCharts: [],
            userAnnotationColors: {},
            percentage:67,
            percentage1:46,
            percentage2:15,
            cardIsSelected:false,
            isSharePopup:false,
            isPopupActive:false,
            isActiveRecurrenecePopup:false,
            dsKey: "",
             dsKeySkip: "",
            userClassName:" ",
            conversationData: [
                { name: "Desktop", users: "65434", conversionRate: "4.5%" },
                { name: "Mobile", users: "65434", conversionRate: "4.5%" },
                { name: "Tablet", users: "65434", conversionRate: "4.5%" },
            ],
            attributionSourceData: [
                {
                    name: "Gannotations",
                    users: "65434",
                    conversation: "521",
                    conversionRate: "4.5%",
                },
                {
                    name: "wowsite.co",
                    users: "65434",
                    conversation: "12",
                    conversionRate: "4.5%",
                },
                {
                    name: "youtube.com/videos",
                    users: "65434",
                    conversation: "0",
                    conversionRate: "4.5%",
                },
                {
                    name: "news.yahoo.com",
                    users: "65434",
                    conversation: "56",
                    conversionRate: "4.5%",
                },
                {
                    name: "newwebsite.com",
                    users: "65434",
                    conversation: "0",
                    conversionRate: "4.5%",
                },
                {
                    name: "instagram.com",
                    users: "65434",
                    conversation: "4",
                    conversionRate: "4.5%",
                },
            ],
            data: [
                { name: "Jan", uv: 1000, pv: 2400, amt: 2400 },
                { name: "Feb", uv: 3000, pv: 1398, amt: 2210 },
                { name: "Mar", uv: 2000, pv: 9800, amt: 2290 },
                { name: "Apr", uv: 2780, pv: 3908, amt: 2000 },
                { name: "May", uv: 1890, pv: 4800, amt: 2181 },
            ],
            youtubeData: [
                { name: "Jan", Views: 1000, Likes: 2400, Subscribers: 2400 },
                { name: "Feb", Views: 3000, Likes: 1398, Subscribers: 2210 },
                { name: "Mar", Views: 2000, Likes: 9800, Subscribers: 2290 },
                { name: "Apr", Views: 2780, Likes: 3908, Subscribers: 2000 },
                { name: "May", Views: 1890, Likes: 4800, Subscribers: 2181 },
            ],
            data02: [
                { name: "A1", value: 100 },
                { name: "A2", value: 300 },
                { name: "B1", value: 100 },
                { name: "B2", value: 80 },
            ],
            COLORS: ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"],

            dashboard: null,
        };

        this.fetchStatistics = this.fetchStatistics.bind(this);
        this.fetchUsersDaysAnnotations = this.fetchUsersDaysAnnotations.bind(this);
        this.changeStatisticsPaddingDays = this.changeStatisticsPaddingDays.bind(this);
        this.exportExcel = this.exportExcel.bind(this);
        // this.updateUserAnnotationColors = this.updateUserAnnotationColors.bind(this);
        this.shareHandler = this.shareHandler.bind(this);
        this.activeReccurenceHandler = this.activeReccurenceHandler.bind(this);
        this.generateDateRange = this.generateDateRange.bind(this);
        this.getDashboardActivity = this.getDashboardActivity.bind(this);
        this.createDashboard = this.createDashboard.bind(this);
    }
    componentDidMount() {
        document.title = 'Analytic Dashboard';
        this.getDashboardActivity();
    }
    getDashboardActivity() {
        
        HttpClient.get(`/dashboard/analytics/get-dashboard-activity`)
        .then(response => {
                this.setState({ isBusy: false, dashboard_activities_for_popup: response.data.dashboard_activities, dashboard_activities: response.data.dashboard_activities.map(c => { return { label: c.name, value: c.name } }) });
                // this.setState({ isBusy: false, ga_property_id: response.data.dashboard_activity.property_id, startDate: response.data.dashboard_activity.start_date, endDate: response.data.dashboard_activity.end_date });
                // this.fetchStatistics(response.data.dashboard_activity.property_id);
        }, (err) => {
            this.setState({ isBusy: false, errors: (err.response).data });
        }).catch(err => {
            this.setState({ isBusy: false, errors: err });
        });
    }
    createDashboard() {        
        
        HttpClient.get(`/dashboard/analytics/create-dashboard-activity?dashboard=${this.state.dashboard}&start_date=${this.state.startDate}&end_date=${this.state.endDate}&ga_property_id=${this.state.ga_property_id}`)
        .then(response => {
            Toast.fire({
                icon: 'success',
                title: "Dashboard Saved Successfully!",
            });
            this.setState({ isBusy: false });
            this.getDashboardActivity();
        }, (err) => {
            this.setState({ isBusy: false, errors: (err.response).data });
        }).catch(err => {
            this.setState({ isBusy: false, errors: err });
        });
    }

    shareHandler(){
        this.setState({ isSharePopup: true });
    }
    activeReccurenceHandler(){
        // this.setState({isActiveRecurrenecePopup :true});
        this.setState((prevState) => ({
            isActiveRecurrenecePopup: !prevState.isActiveRecurrenecePopup,
          }));
        console.log('sdkzfn  djdk ===== ',this.state.isActiveRecurrenecePopup)
    }

     generateDateRange(selectedValue) {
        let startDate, endDate;
    
        switch (selectedValue) {
            case 'today':
              startDate = moment().format('YYYY-MM-DD');
              endDate = moment().format('YYYY-MM-DD');
              break;
            case '1 week':
              startDate = moment().subtract(1, 'week').format('YYYY-MM-DD');
              endDate = moment().format('YYYY-MM-DD');
              break;
            case '2 weeks':
              startDate = moment().subtract(2, 'weeks').format('YYYY-MM-DD');
              endDate = moment().format('YYYY-MM-DD');
              break;
            case '1 month':
              startDate = moment().subtract(1, 'month').format('YYYY-MM-DD');
              endDate = moment().format('YYYY-MM-DD');
              break;
            case '6 months':
              startDate = moment().subtract(6, 'months').format('YYYY-MM-DD');
              endDate = moment().format('YYYY-MM-DD');
              break;
            case '1 year':
              startDate = moment().subtract(1, 'year').format('YYYY-MM-DD');
              endDate = moment().format('YYYY-MM-DD');
              break;
            case 'all':
                startDate = moment().subtract(5, 'years').format('YYYY-MM-DD');
                endDate = moment().format('YYYY-MM-DD');
              break;
            default:
              // Default case (e.g., handle if no value is selected)
              startDate = '';
              endDate = '';
              break;
          }
    
        // Send the range to the backend or perform any other action with the generated dates
        console.log('Start Date:===========  ===  ', startDate);
        console.log('End Date: ================    ', endDate);
        this.setState({
            startDate: moment(startDate).format("YYYY-MM-DD"),
            endDate: moment(endDate).format("YYYY-MM-DD"),
             showDateRangeSelect: moment(startDate).format("YYYY-MM-DD") == moment(endDate).format("YYYY-MM-DD")
        }, () => {
            if (moment(startDate).format("YYYY-MM-DD") !== moment(endDate).format("YYYY-MM-DD")) {
                this.fetchStatistics(this.state.ga_property_id);
            }
        });

    }


    render() {

        if (!this.props.user.google_accounts_count) return <NoGoogleAccountConnectedPage />
        return <React.Fragment>
            {/* here me start */}
            <>
            <div className="container reporting-block">
                <div className="row">
                    <div className={"col-12"}>
                        <div className="d-flex align-items-center justify-content-between mb-5">
                            {/*wellcome div*/}
                            <div className="d-flex align-items-end">
                                <h2 className="welcome-color mb-0 p-0">
                                    Wellcome {this.props.user.name} 👋
                                </h2>

                                <h4 className=" ml-4 discription-color mb-0 p-0">
                                    Let's do some productive today...
                                </h4>
                            </div>
                            <div className="d-flex align-items-center">

                                {/* <button className="active-recerrences mb-0 p-0 bg-white mr-4" data-toggle="modal" data-target="#exampleModalCenter1" onClick={this.activeReccurenceHandler}>
                                    <img src="/images/svg/active-recurrence.svg" alt="active icon" className="mr-2" />
                                    Active recurrence
                                </button> */}
                                {
                                    this.state.isActiveRecurrenecePopup && <ActiveRecurrence />
                                }
                                <button className="`btn btn-outline btn-sm btnCornerRounded share-btn " data-toggle="modal" data-target="#exampleModalCenter" onClick={() => this.setState({shareAnalyticsPopup: true})}>
                                    <span className="align-center">
                                        <img className='mr-2'
                                            src="/images/svg/share.svg"
                                            alt="share icon"
                                        />
                                    </span>
                                    Share
                                </button>


                                <AppsModal isOpen={this.state.shareAnalyticsPopup} popupSize={'lg'} toggle={() => {
                                            this.setState({shareAnalyticsPopup: false,});
                                        }}>
                                        <div className="popupContent modal-createUser">
                                            <div className="apps-modalHead">
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <div className="d-flex justify-content-start align-items-center"><h2>Share Analytics</h2>
                                                    </div>
                                                    <div className='d-flex align-items-center'>                                                    
                                                            <button className="download-pdf-btn" onClick={() => {
                                                                html2pdf(document.getElementById("dashboard-index-container"), {
                                                                    margin: 0.5,
                                                                    filename: 'dashboard_analytics.pdf',
                                                                    image: { type: 'jpeg', quality: 1.0 },
                                                                    html2canvas: { scale: 1 },
                                                                    jsPDF: { unit: 'in', format: 'A4', orientation: 'landscape' }
                                                                });
                                                                }}>
                                                                <img className="float-left d-inline" src="/images/svg/download.svg" alt="download-icon" />                                        
                                                                    Download pdf
                                                            </button>
                                                            <button className="download-pdf-btn" 
                                                                onClick={() => this.exportExcel(this.props.redirectTo)}>
                                                                <img className="float-left d-inline" src="/images/svg/download.svg" alt="download-icon" />                                        
                                                                    Download Excel
                                                            </button>
                                                            <span onClick={() => this.setState({shareAnalyticsPopup: false,})} className="btn-close">
                                                                <img className="inject-me" src="/close-icon.svg" width="26" height="26"
                                                                        alt="menu icon"/>
                                                            </span>
                                                    </div>
                                                    
                                                    
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





                                {/* {
                                    this.state.isSharePopup && 
                                    <SharePopups toggle={() => {
                                        this.setState({shareAnalyticsPopup: false,});
                                    }}  user={this.props.user}
                                        props={this.props}
                                        ga_property_id={this.state.ga_property_id}
                                        statisticsPaddingDays={this.state.statisticsPaddingDays}
                                        start_date={this.state.startDate}
                                        end_date={this.state.endDate}
                                        upgradePopup={this.props.upgradePopup}
                                      exportExcel={this.exportExcel} redirectTo={this.redirectTo} />
                                } */}
                            </div>

                        </div>
                        {/* <div className="more-conversation">
                                <h4>dfsdf sdf fs fs</h4>
                        </div> */}
                        {/*filter div*/}
                        <div className="filtersHolder d-flex justify-content-between align-items-center">
                            <div className="d-flex">
                                <div className="filter-sort position-relative">
                                    <GoogleAnalyticsPropertySelect
                                        name="ga_property_id"
                                        id="ga_property_id"
                                        value={this.state.ga_property_id}
                                        onChangeCallback={(event) => { this.setState({ ga_property_id: event.target.value }); this.fetchStatistics(event.target.value); }} placeholder="Select GA Properties"
                                        components={{ IndicatorSeparator: () => null }}
                                        autoSelectFirst
                                    />

                                    <ErrorAlert errors={this.state.errors} />                                </div>

                                {/* <FormGroup className="filter-sort position-relative">
                                    <Label
                                        className="sr-only"
                                        for="dropdownFilters"
                                    >
                                         <GoogleAnalyticsPropertySelect
                                            name="ga_property_id"
                                            id="ga_property_id"
                                            value={this.state.ga_property_id}
                                            onChangeCallback={(event) => { this.setState({ ga_property_id: event.target.value }); this.fetchStatistics(event.target.value); }} placeholder="Select GA Properties"
                                            components={{ IndicatorSeparator: () => null }}
                                            autoSelectFirst
                                        />
                                        <span
                                            className={`dot`}
                                            style={{ color: "2D9CDB" }}
                                        ></span>
                                        Crystal Ball
                                    </Label>
                                    <i className="btn-dot left-0 ">

                                    </i>
                                    <i className="btn-searchIcon right-0 fa fa-angle-down"></i>
                                    <select
                                        name="sortBy"
                                        id="sort-by"
                                        value={this.state.sortBy}
                                        className="form-control"
                                        onChange={this.sort}
                                    >
                                        <option value="">
                                            Crystal Ball
                                        </option>
                                        <option value="added">Added</option>
                                        <option value="user">By User</option>
                                        <option value="today">By Today</option>
                                        <option value="date">By Date</option>
                                        <option value="category">By Category</option>
                                         <option value="ga-property">By GA Property</option>
                                    </select>
                                </FormGroup> */}
                                {/* <FormGroup className="filter-sort position-relative">
                                    <Label
                                        className="sr-only"
                                        for="dropdownFilters"
                                    >
                                        My First Dashboard
                                    </Label>
                                    <i className="btn-searchIcon left-0">
                                        <svg
                                            width="12"
                                            height="10"
                                            viewBox="0 0 12 10"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M0 10V8.33333H4V10H0ZM0 5.83333V4.16667H8V5.83333H0ZM0 1.66667V0H12V1.66667H0Z"
                                                fill="#666666"
                                            />
                                        </svg>
                                    </i>
                                    <i className="btn-searchIcon right-0 fa fa-angle-down"></i>
                                    <select
                                        name="sortBy"
                                        id="sort-by"
                                        value={this.state.sortBy}
                                        className="form-control"
                                        onChange={this.sort}
                                    >
                                        <option value="">
                                            My First Dashboard
                                        </option>
                                        <option value="added">Added</option>
                                        <option value="user">By User</option>
                                        <option value="today">By Today</option>
                                        <option value="date">By Date</option>
                                        <option value="category">By Category</option>
                                        <option value="ga-property">By GA Property</option>
                                    </select>
                                </FormGroup> */}
                            </div>
                            <div className="filterBtnGroup d-flex align-items-center">
                               
                                {/* <div className='d-flex'>
                                <DefinedRange
                                    moveRangeOnFirstSelection={false}
                                    editableDateInputs={true}
                                    inp
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
                                                this.fetchStatistics(this.state.ga_property_id)
                                            }
                                        });
                                    }}
                                />
                                </div> */}

                                <button className="filter-btn" onClick={() => this.generateDateRange('today')}>Today</button>
                                <button className="filter-btn" onClick={() => this.generateDateRange('1 week')}>1w </button>
                                <button className="filter-btn" onClick={() => this.generateDateRange('2 weeks')}>2w</button>
                                <button className="filter-btn" onClick={() => this.generateDateRange('1 month')}>1m</button>
                                <button className="filter-btn" onClick={() => this.generateDateRange('6 months')}>6m</button>
                                <button className="filter-btn" onClick={() => this.generateDateRange('1 year')}>Year</button>
                                <button className="filter-btn" onClick={() => this.generateDateRange('all')}>All</button>

                                {/* <button className="filter-btn">All</button> */}

                                <Button id="PopoverClick" type="button" className="custom-btn">Custom
                                    <img className="pl-2" src="/images/svg/custom-date.svg"
                                    alt="custom-date icon" />
                                </Button>
                                    <UncontrolledPopover
                                        placement="bottom"
                                        target="PopoverClick"
                                        trigger="click"
                                        className='calendar'
                                    >
                                        {/* <PopoverHeader>
                                        {/* <PopoverBody> */}
                                            <DateRange
                                                editableDateInputs={true}
                                                // onChange={item => setState({ dateRange:[item.selection]})}
                                                // style={{ 'position': 'absolute', backgroundColor: '#F7F7F7', zIndex: 9999999999999 }}
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
                                        {/* </PopoverBody> */}
                                    </UncontrolledPopover>
                            </div>
                        </div>
                    </div>


                        <div className={"col-8"}>

                        {/*left side div*/}


                            {/*user's div*/}

                            <UsersDaysWithAnnotationsGraph statistics={this.state.usersDaysStatistics} />


                            {/*Attribution source*/}
                            <AnnotationsTable user={this.props.user} annotations={this.state.annotations} satisticsPaddingDaysCallback={this.changeStatisticsPaddingDays} statisticsPaddingDays={this.state.statisticsPaddingDays} />


                            {/* media graphs */}
                            <MediaGraph statistics={this.state.mediaStatistics} />


                            {/* Click Impressions Graph */}
                            <ClicksImpressionsDaysGraph statistics={this.state.clicksImpressionsDaysStatistics} />

                            {/* Console Annotation Tabel */}
                            <ConsoleAnnotationsTable user={this.props.user} annotations={this.state.console_annotations} satisticsPaddingDaysCallback={this.changeStatisticsPaddingDays} statisticsPaddingDays={this.state.statisticsPaddingDays} />

                            {/* Queries Tabel */}
                            <QueriesTable queriesStatistics={this.state.queriesStatistics} />

                            {/* Page Table */}
                            <PagesTable pagesStatistics={this.state.pagesStatistics} />


                            <div className="d-flex flex-column">
                                <div className="fourGridBoxesHolder">

                                    {/*Todays Expence div*/}

                                    {/* Top Statistics  */}
                                    <TopStatistics topStatistics={this.state.topStatistics} />

                                    {/* Console Top Statistics */}
                                    {/* <ConsoleTopStatistics topStatistics={this.state.consoleTopStatistics} /> */}
                                    

                                    {/* <div className="">
                                        <div className={"w-100 report-box"}>
                                            <div className="d-flex justify-content-between">
                                                <div>
                                                    <h4 className="card-heading">
                                                        Today's Expence
                                                    </h4>
                                                    <h6>sales summery</h6>
                                                </div>
                                                <div className="icons">
                                                    <span>
                                                        <img
                                                            src="/images/svg/visitor-country.svg"
                                                            alt="visit icon"
                                                        />
                                                    </span>
                                                    <span>
                                                        <img
                                                            src="/images/svg/dashboard-list-option.svg"
                                                            alt="list icon"
                                                        />
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="fourGridBoxesHolder" style={{gap: '15px'}}>
                                                <div className=" d-flex flex-column  w-100 box-color1">
                                                    <span className="box-icon">
                                                        <img
                                                            src="/images/svg/todays-expence-icon1.svg"
                                                            alt="list icon"
                                                        />
                                                    </span>
                                                    <h2
                                                        className="box-headings"
                                                    >
                                                        $1K
                                                    </h2>
                                                    <h5
                                                        className="box-headings"
                                                        style={{
                                                            color: "#425166",
                                                            fontWeight: "400",
                                                            fontSize: "16px",
                                                        }}
                                                    >
                                                        Total sales
                                                    </h5>
                                                    <h5
                                                        className="box-headings"
                                                        style={{
                                                            color: "#4079ED",
                                                            fontWeight: "400",
                                                            fontSize: "13px",
                                                        }}
                                                    >
                                                        +8% from yesterday
                                                    </h5>
                                                </div>
                                                <div className="d-flex flex-column  w-100 box-color2">
                                                    <span className="box-icon">
                                                        <img
                                                            src="/images/svg/todays-expence-icon2.svg"
                                                            alt="list icon"
                                                        />
                                                    </span>
                                                    <h2
                                                        className="box-headings"
                                                    >
                                                        300
                                                    </h2>
                                                    <h5
                                                        className="box-headings"
                                                        style={{
                                                            color: "#425166",
                                                            fontWeight: "400",
                                                            fontSize: "16px",
                                                        }}
                                                    >
                                                        Total orders
                                                    </h5>
                                                    <h5
                                                        className="box-headings"
                                                        style={{
                                                            color: "#4079ED",
                                                            fontWeight: "400",
                                                            fontSize: "13px",
                                                        }}
                                                    >
                                                        +8% from yesterd
                                                    </h5>
                                                </div>
                                                <div className="d-flex flex-column w-100 box-color3">
                                                    <span className="box-icon">
                                                        <img
                                                            src="/images/svg/todays-expence-icon3.svg"
                                                            alt="list icon"
                                                        />
                                                    </span>

                                                    <h2
                                                        className="box-headings"
                                                    >
                                                        5
                                                    </h2>
                                                    <h5
                                                        className="box-headings"
                                                        style={{
                                                            color: "#425166",
                                                            fontWeight: "400",
                                                            fontSize: "16px",
                                                        }}
                                                    >
                                                        Total sales
                                                    </h5>
                                                    <h5
                                                        className="box-headings"
                                                        style={{
                                                            color: "#4079ED",
                                                            fontWeight: "400",
                                                            fontSize: "13px",
                                                        }}
                                                    >
                                                        +8% from yesterd
                                                    </h5>
                                                </div>
                                                <div className="d-flex flex-column w-100 box-color4">
                                                    <span className="box-icon">
                                                        <img
                                                            src="/images/svg/todays-expence-icon4.svg"
                                                            alt="list icon"
                                                        />
                                                    </span>

                                                    <h2
                                                        className="box-headings"
                                                    >
                                                        300
                                                    </h2>
                                                    <h5 className="box-headings"
                                                    style={{
                                                        color: "#425166",
                                                        fontWeight: "400",
                                                        fontSize: "16px",
                                                    }}
                                                    >
                                                        Total orders
                                                    </h5>
                                                    <h5
                                                        className="box-headings"
                                                        style={{
                                                            color: "#4079ED",
                                                            fontWeight: "400",
                                                            fontSize: "13px",
                                                        }}
                                                    >
                                                        +8% from yesterd
                                                    </h5>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="w-100 report-box">
                                            <div>
                                                <p>
                                                    Create your own moodboard <br />
                                                    and find them all at one place
                                                </p>
                                            </div>
                                            <div>
                                                <form>
                                                    <span>
                                                        <img
                                                            src="/images/svg/image.svg"
                                                            alt="image icon"
                                                        />
                                                    </span>
                                                    <input
                                                        className="add-  "
                                                        type="file"
                                                        placeholder="Add image"
                                                        id="img"
                                                        name="img"
                                                        accept="image/*"
                                                    />
                                                </form>
                                            </div>
                                        </div>

                                    </div> */}

                                    <div>
                                        {/*Linkedin taffic cpc div*/}
                                        {/* <div className="w-100 report-box">
                                            <div className="d-flex justify-content-between mb-5">
                                                <div><h4 className="card-heading">LinkedIn traffic CPC</h4></div>
                                                <div>
                                                    <span>
                                                        <img
                                                            src="/images/svg/linkedin.svg"
                                                            alt="linkedin icon"
                                                        />
                                                    </span>
                                                    <span>
                                                        <img
                                                            src="/images/svg/dashboard-list-option.svg"
                                                            alt="list icon"
                                                        />
                                                    </span>
                                                </div>
                                            </div>
                                            <div>
                                                <LineChart
                                                    width={300}
                                                    height={150}
                                                    data={this.state.data}
                                                >
                                                    <XAxis dataKey="name" />
                                                    <YAxis />
                                                    <CartesianGrid stroke="#ccc" />
                                                    <Tooltip />
                                                    <Legend />
                                                    <Line
                                                        type="monotone"
                                                        dataKey="pv"
                                                        stroke="#8884d8"
                                                    />
                                                    <Line
                                                        type="monotone"
                                                        dataKey="uv"
                                                        stroke="#82ca9d"
                                                    />
                                                </LineChart>
                                            </div>
                                            <div className="d-flex flex-column todayData linkedintrafic" style={{borderTop: '1px solid #E0E0E0'}}>
                                                <div className="d-flex align-items-center justify-content-center">
                                                    <div className="d-flex flex-column pr-4">
                                                        <h4 className="mb-0 d-flex justify-content-center align-items-center">
                                                            <span className='pr-1'><img className='d-block' src="/images/svg/blue-dot.svg" alt="blue-dot icon" /></span>
                                                            Last month
                                                        </h4>
                                                        <h4 className='mb-0 text-center'>1234</h4>
                                                    </div>
                                                    <div className='divider'></div>
                                                    <div className="d-flex flex-column pl-4">
                                                        <h4 className="mb-0 d-flex justify-content-center align-items-center">
                                                            <span className='pr-1'><img className='d-block' src="/images/svg/green-dot.svg" alt="green-dot icon"/></span>
                                                            This month
                                                        </h4>
                                                        <h4 className='mb-0 text-center'>1234</h4>
                                                    </div>
                                                </div>
                                            </div>
                                        </div> */}


                                        {/*Media graph div*/}
                                        {/* <MediaGraph statistics={this.state.mediaStatistics} /> */}

                                        {/* <div className="w-100 report-box">
                                            <div className="justify-content-between d-flex mb-3">
                                                <div>
                                                    <h3 className="card-heading">
                                                        Media
                                                    </h3>
                                                </div>
                                                <div>
                                                    <span>
                                                        <img
                                                            src="/images/svg/dashboard-list-option.svg"
                                                            alt="list icon"
                                                        />
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="d-flex flex-column">
                                                <div className="d-flex flex-column">
                                                    <h5 style={{color: "#333333", fontSize:"16px",fontWeight:"400"}}>Twitter</h5>
                                                    <div className="progressbar d-flex align-items-center">
                                                        <div className="progress flex-grow-1">
                                                            <div
                                                                className="progress-bar"
                                                                role="progressbar"
                                                                style={{
                                                                    width: `${Math.min(
                                                                        (132645 /
                                                                            150000) *
                                                                            100,
                                                                        100
                                                                    )}%`,
                                                                }}
                                                                aria-valuenow={`${Math.min(
                                                                    (132645 / 150000) *
                                                                        100,
                                                                    100
                                                                )}`}
                                                                aria-valuemin="0"
                                                                aria-valuemax="100"
                                                            ></div>
                                                        </div>
                                                        <span className="ml-2">
                                                            {Math.min(
                                                                (132645 / 150000) * 100,
                                                                100
                                                            )}
                                                            %
                                                        </span>
                                                    </div>
                                                </div>

                                                <h5 style={{color: "#333333", fontSize:"16px",fontWeight:"400"}}>Instagram</h5>
                                                <div className="progressbar d-flex align-items-center">
                                                    <div className="progress flex-grow-1">
                                                        <div
                                                            className="progress-bar"
                                                            role="progressbar"
                                                            style={{
                                                                width: `${Math.min(
                                                                    (132645 / 150000) *
                                                                        100,
                                                                    100
                                                                )}%`,
                                                            }}
                                                            aria-valuenow={`${Math.min(
                                                                (132645 / 150000) * 100,
                                                                100
                                                            )}`}
                                                            aria-valuemin="0"
                                                            aria-valuemax="100"
                                                        ></div>
                                                    </div>
                                                    <span className="ml-2">
                                                        {Math.min(
                                                            (132645 / 150000) * 100,
                                                            100
                                                        )}
                                                        %
                                                    </span>
                                                </div>
                                                <h5 style={{color: "#333333", fontSize:"16px",fontWeight:"400"}}>TikTok</h5>
                                                <div className="progressbar d-flex align-items-center">
                                                    <div className="progress flex-grow-1">
                                                        <div
                                                            className="progress-bar"
                                                            role="progressbar"
                                                            style={{
                                                                width: `${Math.min(
                                                                    (132645 / 150000) *
                                                                        100,
                                                                    100
                                                                )}%`,
                                                            }}
                                                            aria-valuenow={`${Math.min(
                                                                (132645 / 150000) * 100,
                                                                100
                                                            )}`}
                                                            aria-valuemin="0"
                                                            aria-valuemax="100"
                                                        ></div>
                                                    </div>
                                                    <span className="ml-2">
                                                        {Math.min(
                                                            (132645 / 150000) * 100,
                                                            100
                                                        )}
                                                        %
                                                    </span>
                                                </div>
                                                <h5 style={{color: "#333333", fontSize:"16px",fontWeight:"400"}}>Facebook</h5>
                                                <div className="progressbar d-flex align-items-center">
                                                    <div className="d-flex flex-column">
                                                    <span className="ml-2">
                                                        {Math.min(
                                                            (132645 / 150000) * 100,
                                                            100
                                                        )}
                                                        %
                                                    </span>
                                                    <div className="progress flex-grow-1">
                                                        <div
                                                            className="progress-bar" role="progressbar"
                                                            style={{
                                                                width: `${Math.min(
                                                                    (132645 / 150000) *
                                                                        100,
                                                                    100
                                                                )}%`,color:"#004F9D"
                                                            }}
                                                            aria-valuenow={`${Math.min(
                                                                (132645 / 150000) * 100,
                                                                100
                                                            )}`}
                                                            aria-valuemin="0"
                                                            aria-valuemax="100"
                                                        ></div>
                                                    </div>

                                                    </div>

                                                </div>
                                            </div>
                                            <p>Source:BestGenNewtonSite</p>
                                        </div> */}
                                    </div>
                                </div>
                            </div>

                            {/*youtube engagement div*/}
                            {/* <div className="report-box">
                                <div className="d-flex justify-content-between mb-5">
                                    <div>
                                        <p className="card-heading">
                                            Youtube Engagement
                                        </p>
                                    </div>
                                    <div>
                                        <span>
                                            <img
                                                src="/images/svg/youtube.svg"
                                                alt="youtube icon"
                                            />
                                        </span>
                                        <span>
                                            <img
                                                src="/images/svg/dashboard-list-option.svg"
                                                alt="list icon"
                                            />
                                        </span>
                                    </div>
                                </div>

                                <BarChart
                                    width={500}
                                    height={300}
                                    data={this.state.youtubeData}
                                    margin={{
                                        top: 5,
                                        right: 30,
                                        left: 20,
                                        bottom: 5,
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="Views" fill="#1EA8FD" barSize={10} />
                                    <Bar dataKey="Likes" fill="#00F3A3" barSize={10} />
                                    <Bar dataKey="Subscribers" fill="#FFC514" barSize={10} />
                                </BarChart>
                            </div> */}


                            <div>
                                <div className='row'>
                                    {/*Another important data div*/}
                                    {/* <div className='col-6'>
                                        <div className="report-box">
                                            <div className="justify-content-between d-flex mb-3">
                                                <div>
                                                    <p className="card-heading">
                                                        Another Data
                                                    </p>
                                                </div>
                                                <div>
                                                    <span>
                                                        <img
                                                            src="/images/svg/dashboard-list-option.svg"
                                                            alt="list icon"
                                                        />
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="">
                                                <BarChart
                                                    width={350}
                                                    height={300}
                                                    data={this.state.data}
                                                    margin={{top: 20,right: 30,left: 20,bottom: 5,}}
                                                >
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey="name" />
                                                    <YAxis />
                                                    <Tooltip />
                                                    <Legend />
                                                    <Bar
                                                        dataKey="pv"
                                                        stackId="a"
                                                        fill="#0095FF"
                                                        barSize={12}
                                                    />
                                                    <Bar
                                                        dataKey="uv"
                                                        stackId="a"
                                                        fill="#00E096"
                                                        barSize={12}
                                                    />
                                                </BarChart>
                                            </div>
                                            <div className='divider'></div>
                                            <div className="pt-4 d-flex flex-column todayData">
                                                <h3 className="text-center">Today</h3>
                                                <div className="d-flex align-items-center justify-content-center">
                                                    <div className="d-flex flex-column pr-4">
                                                        <h4 className="mb-0 d-flex justify-content-center align-items-center">
                                                            <span className='pr-1'><img className='d-block' src="/images/svg/blue-dot.svg" alt="blue-dot icon" /></span>
                                                            Volume
                                                        </h4>
                                                        <h4 className='mb-0 text-center'>1234</h4>
                                                    </div>
                                                    <div className='divider'></div>
                                                    <div className="d-flex flex-column pl-4">
                                                        <h4 className="mb-0 d-flex justify-content-center align-items-center">
                                                            <span className='pr-1'><img className='d-block' src="/images/svg/green-dot.svg" alt="green-dot icon"/></span>
                                                            Services
                                                        </h4>
                                                        <h4 className='mb-0 text-center'>1234</h4>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div> */}

                                    {/*stores status div*/}
                                    {/* <div className='col-6'>
                                        <div className="d-flex flex-column report-box">
                                            <div className="d-flex justify-content-between mb-5">
                                                <div>
                                                    <p className="card-heading">
                                                        Store status
                                                    </p>
                                                </div>
                                                <div>
                                                    <span>
                                                        <img
                                                            src="/images/svg/dashboard-list-option.svg"
                                                            alt="list icon"
                                                        />
                                                    </span>
                                                    <span>
                                                        <img
                                                            src="/images/svg/store.svg"
                                                            alt="list icon"
                                                        />
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="d-flex justify-content-between">
                                                <div className="d-flex flex-column">
                                                    <h4>Newton' store</h4>
                                                    <h4 className="box-headings">$10.21k</h4>
                                                    <h5 style={{color:"#0BD25F"}}>+5% then prev day</h5>
                                                    <LineChart
                                                        width={100}
                                                        height={50}
                                                        data={this.state.data}
                                                    >
                                                        <Line
                                                            type="monotone"
                                                            dataKey="pv"
                                                            stroke="#0BD25F"
                                                            strokeWidth={2}
                                                        />
                                                    </LineChart>
                                                </div>
                                                <div className="d-flex flex-column">
                                                    <h5 style={{color:"#666666",fontSize:"14px"}}>Orders</h5>
                                                    <span className="box-headings">231</span>
                                                    <h5 style={{color:"#666666",fontSize:"14px"}}>Average data</h5>
                                                    <span className="box-headings">231</span>
                                                    <h5 style={{color:"#666666",fontSize:"14px"}}>Total profit</h5>
                                                    <span className="box-headings">231</span>
                                                </div>
                                            </div>
                                            <hr className="divider" />
                                            <div className="d-flex justify-content-between">
                                                <div className="d-flex flex-column">
                                                    <h6 style={{color:"#333333",fontSize:"14px"}}>Store name that's lo...</h6>
                                                    <h4 className="box-headings">$650.43</h4>
                                                    <h5 style={{color:"#F44C3D"}}>+5% then prev day</h5>
                                                    <LineChart
                                                        width={100}
                                                        height={50}
                                                        data={this.state.data}
                                                    >
                                                        <Line
                                                            type="monotone"
                                                            dataKey="pv"
                                                            stroke="#F44C3D"
                                                            strokeWidth={2}
                                                        />
                                                    </LineChart>
                                                </div>
                                                <div className="d-flex flex-column">
                                                    <h5 style={{color:"#666666",fontSize:"14px"}}>Orders</h5>
                                                    <span className="box-headings">231</span>
                                                    <h5 style={{color:"#666666",fontSize:"14px"}}>Average data</h5>
                                                    <span className="box-headings">231</span>
                                                    <h5 style={{color:"#666666",fontSize:"14px"}}>Total profit</h5>
                                                    <span className="box-headings">231</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div> */}

                                    {/*Another data div*/}
                                    {/* <div className='col-6'>
                                        <div className="report-box">
                                            <div className="d-flex justify-content-between mb-5">
                                                <div>
                                                    <p className="card-heading">
                                                        Another data *********
                                                    </p>
                                                </div>
                                                <div>
                                                    <span>
                                                        <img
                                                            src="/images/svg/dashboard-list-option.svg"
                                                            alt="list icon"
                                                        />
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="d-flex justify-content-between">
                                                <PieChart width={184} height={184}>
                                                    <Pie
                                                        data={this.state.data02}
                                                        cx="50%"
                                                        cy="50%"
                                                        outerRadius={50}
                                                        fill="#8884d8"
                                                        dataKey="value"
                                                    >{this.state.data02.map(
                                                        (entry, index) => (
                                                            <Cell
                                                                key={`cell-${index}`}
                                                                fill={
                                                                    this.state.COLORS[
                                                                        index %
                                                                            this.state
                                                                                .COLORS
                                                                                .length
                                                                    ]
                                                                }
                                                            />
                                                        ))}
                                                    </Pie>
                                                </PieChart>
                                                <div className="d-flex flex-column dotList">
                                                    <span className="d-flex align-items-center pb-4">
                                                        <span className="mr-1"><img className='d-block' src="/images/svg/green-dot.svg" alt="green-dot icon"/></span>
                                                        <h5 className='mb-0'>Desktop</h5>
                                                    </span>
                                                    <span className="d-flex align-items-center pb-4">
                                                        <span className="mr-1"><img className='d-block' src="/images/svg/yellow-dot.svg" alt="yellow-dot icon"/></span>
                                                        <h5 className='mb-0'>Mobile</h5>
                                                    </span>
                                                    <span className="d-flex align-items-center pb-4">
                                                        <span className="mr-1"><img className='d-block' src="/images/svg/red-dot.svg" alt="red-dot icon"/></span>
                                                        <h5 className='mb-0'>Tablet</h5>
                                                    </span>
                                                    <span className="d-flex align-items-center pb-4">
                                                        <span className="mr-1"><img className='d-block' src="/images/svg/unknown-dot.svg" alt="red-dot icon" /></span>
                                                        <h5 className='mb-0'>Unknown</h5>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div> */}

                                    {/*Another data dive */}
                                    {/* <div className='col-6'>
                                        <div className="report-box">
                                            <div className="d-flex justify-content-between mb-5">
                                                <div>
                                                    <p className="card-heading">
                                                        Another data *********
                                                    </p>
                                                </div>
                                                <div>
                                                    <span>
                                                        <img
                                                            src="/images/svg/dashboard-list-option.svg"
                                                            alt="list icon"
                                                        />
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <PieChart width={184} height={184}>
                                                    <Pie
                                                        data={this.state.data02}
                                                        cx="50%"
                                                        cy="50%"
                                                        outerRadius={50}
                                                        fill="#8884d8"
                                                        dataKey="value"
                                                    >
                                                        {this.state.data02.map(
                                                            (entry, index) => (
                                                                <Cell
                                                                    key={`cell-${index}`}
                                                                    fill={
                                                                        this.state.COLORS[
                                                                            index %
                                                                                this.state
                                                                                    .COLORS
                                                                                    .length
                                                                        ]
                                                                    }
                                                                />
                                                            )
                                                        )}
                                                    </Pie>
                                                </PieChart>
                                                <div className="d-flex flex-column dotList">
                                                    <span className="d-flex align-items-center pb-4">
                                                        <span className="mr-1"><img className='d-block' src="/images/svg/green-dot.svg" alt="green-dot icon"/></span>
                                                        <h5 className='mb-0'>Desktop</h5>
                                                    </span>
                                                    <span className="d-flex align-items-center pb-4">
                                                        <span className="mr-1"><img className='d-block' src="/images/svg/yellow-dot.svg" alt="yellow-dot icon"/></span>
                                                        <h5 className='mb-0'>Mobile</h5>
                                                    </span>
                                                    <span className="d-flex align-items-center pb-4">
                                                        <span className="mr-1"><img className='d-block' src="/images/svg/red-dot.svg" alt="red-dot icon"/></span>
                                                        <h5 className='mb-0'>Tablet</h5>
                                                    </span>
                                                    <span className="d-flex align-items-center pb-4">
                                                        <span className="mr-1"><img className='d-block' src="/images/svg/unknown-dot.svg" alt="red-dot icon" /></span>
                                                        <h5 className='mb-0'>Unknown</h5>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div> */}
                                </div>
                            </div>
                        </div>
                        <div className={"col-4"}>

                        {/*right side div*/}

                        {/*Annotations Table div*/}

                        {/* <AnnotationsTable user={this.props.user} annotations={this.state.annotations} satisticsPaddingDaysCallback={this.changeStatisticsPaddingDays} statisticsPaddingDays={this.state.statisticsPaddingDays} /> */}
                        {/* <div className=" report-box ">
                            <div className="d-flex justify-content-between mb-5">
                                <div>
                                    <h4 className="card-heading">
                                        Annotations
                                    </h4>
                                </div>
                                <div>

                                    <span>
                                        <img
                                            src="/images/svg/dashboard-list-option.svg"
                                            alt="list icon"
                                        />
                                    </span>
                                </div>
                            </div>

                            <table className="table border">
                                <thead>
                                    <tr>
                                        <th>NAME</th>
                                        <th>UV</th>
                                        <th>PV</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.data.map((itm, index) => (
                                        <tr key={index}>
                                            <td>{itm.name}</td>
                                            <td>{itm.uv}</td>
                                            <td>{itm.pv}</td>
                                        </tr>
                                    ))}
                                </tbody>

                            </table>
                        </div> */}

                        {/*Device by impression div*/}
                        <DeviceClicksImpressionsGraph devicesStatistics={this.state.devicesStatistics} />


                        {/*Device by Conversation div*/}
                        {/* <DeviceByConversationTable devicesStatistics={this.state.devicesStatistics} /> */}
                        <div className=" report-box">
                            <div>
                                <div className="d-flex justify-content-between mb-5">
                                    <div>
                                        <h4 className="card-heading">
                                            Devivce By Conversation
                                        </h4>
                                    </div>
                                    <div>
                                        <span>
                                            <img src="/images/svg/dashboard-list-option.svg" alt="list icon" />
                                        </span>
                                    </div>
                                </div>
                                <table className="table border">
                                    <thead>
                                        <tr>
                                            <td>Source</td>
                                            <td>User</td>
                                            <td>Conv.Rate</td>
                                        </tr>
                                    </thead>
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
                            

                        </div>

                        {/* <div className="report-box"> */}



                                {/* <DeviceUsersGraph deviceCategoriesStatistics={this.state.deviceCategoriesStatistics} /> */}
                        {/* </div> */}



                        {/* <UsersDaysWithAnnotationsGraph statistics={this.state.usersDaysStatistics} /> */}
                        {/* <AnnotationsTable user={this.props.user} annotations={this.state.annotations} satisticsPaddingDaysCallback={this.changeStatisticsPaddingDays} statisticsPaddingDays={this.state.statisticsPaddingDays} /> */}
                        {/* <MediaGraph statistics={this.state.mediaStatistics} /> */}
                        {/* <div className="row ml-0 mr-0 mt-4">

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
                        </div> */}


                        {/*Visitor by Country */}

                        <MapChart countriesStatistics={this.state.countriesStatistics} />
                        {/* <div className="report-box">
                            <div className="justify-content-between d-flex">
                                <div className="d-flex flex-column">
                                    <h3 className="card-heading">
                                        Visitors by country
                                    </h3>
                                    <h6>Traffic analyze</h6>
                                </div>

                                <div className="flex">
                                    <span>
                                        <img
                                            src="/images/svg/visitor-country.svg"
                                            alt="option icon"
                                        />
                                    </span>
                                    <span>
                                        <img
                                            src="/images/svg/dashboard-list-option.svg"
                                            alt="list icon"
                                        />
                                    </span>
                                </div>
                            </div>
                            <div className="mb-3">
                                 <img
                                        src="/images/svg/map.svg"
                                        alt="map Image"
                                    />
                                </div>
                            <h4 className="card-heading">Top countries</h4>

                            <div className="d-flex flex-row">
                                <span className="pr-2 d-flex align-items-center">
                                        <span style={{'width': '1rem', 'display':'block', 'marginRight':'8px'}}>
                                        <img
                                            style={{'width': '100%', 'height':'auto',}}
                                            src="/images/svg/usa.svg"
                                            alt="usa icon"
                                        />
                                        </span>
                                        <h5 className="country-name">United states</h5>
                                </span>
                                <h5 className="ml-5">123456</h5>
                            </div>
                            <div className="d-flex flex-row">
                            <span className="pr-2 d-flex align-items-center">
                                        <span style={{'width': '1rem', 'display':'block', 'marginRight':'8px'}}>
                                        <img
                                            style={{'width': '100%', 'height':'auto',}}
                                            src="/images/svg/germany.svg"
                                            alt="usa icon"
                                        />
                                        </span>
                                        <h5 className="country-name">Germany</h5>
                                </span>
                                <h5 className="ml-5">123456</h5>
                            </div>
                            <div className="d-flex flex-row">
                            <span className="pr-2 d-flex align-items-center">
                                        <span style={{'width': '1rem', 'display':'block', 'marginRight':'8px'}}>
                                        <img
                                            style={{'width': '100%', 'height':'auto',}}
                                            src="/images/svg/canada.svg"
                                            alt="usa icon"
                                        />
                                        </span>
                                        <h5 className="country-name">Canada</h5>
                                </span>
                                <h5 className="ml-5">123456</h5>
                            </div>
                        </div> */}

                        {/* Country Table */}
                        <CountriesTable countriesStatistics={this.state.countriesStatistics} />

                        {/*Facebook Ad's div*/}
                        {/* <div className="report-box">
                            <h6 className='mb-0'>Connect Facebook Ads and get valuable insights on rate, retention, cpc etc</h6>
                            <div className='holder position-relative'>
                                <img className='position-relative z-index-1' src="/images/svg/fb-bg.svg" alt="option icon" />
                                <div className="fb-ads">
                                    <span className='mb-3'><img src="/images/svg/fb-ads.svg" alt="fb-ads icon"/></span>
                                    <span><img src="/images/svg/premium-btn.svg" alt="premium icon"/></span>
                                </div>
                            </div>
                        </div> */}

                        {/*Another data div */}
                        {/* <div className="report-box">
                            <div className="d-flex justify-content-between mb-5">
                                <div>
                                    <h4 className="card-heading">
                                        Another data *********
                                    </h4>
                                </div>
                                <div>
                                    <span>
                                        <img
                                            src="/images/svg/dashboard-list-option.svg"
                                            alt="list icon"
                                        />
                                    </span>
                                </div>
                            </div>
                            <div className="d-flex justify-content-between">
                                <div  style={{ width: 80, height: 80 }}>
                                    <CircularProgressbar value={this.state.percentage} text={`${this.state.percentage}%`} />
                                </div>
                                <div style={{ width: 80, height: 80 }}>
                                    <CircularProgressbar value={this.state.percentage1} text={`${this.state.percentage1}%`} />
                                </div>
                                <div style={{ width: 80, height: 80 }}>
                                    <CircularProgressbar value={this.state.percentage2} text={`${this.state.percentage2}%`} />
                                </div>

                            </div>
                            <div></div>
                        </div> */}
                    </div>
                    </div>
            </div>
            </>







            {/* <>
                //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


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
                                <div className="col-md-12 text-right">
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
                            </div>
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
                                            <UsersDaysGraph statistics={this.state.usersDaysStatistics} />
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
                        dashboard_activities={this.state.dashboard_activities_for_popup}
                        statisticsPaddingDays={this.state.statisticsPaddingDays}
                        upgradePopup={this.props.upgradePopup}
                    />
                </div>
            </AppsModal>
            <AppsModal isOpen={this.state.shareReportIndexPopup} popupSize={'md'} toggle={() => {
                    this.setState({shareReportIndexPopup: false,});
                }}>
                <div className="popupContent modal-createUser">
                    <div className="apps-modalHead">
                        <div className="d-flex justify-content-between align-items-center">
                            <div className="d-flex justify-content-start align-items-center"><h2>Share Analytics</h2>
                            </div>
                            <span onClick={() => this.setState({shareReportIndexPopup: false,})} className="btn-close">
                                <img className="inject-me" src="/close-icon.svg" width="26" height="26"
                                        alt="menu icon"/>
                            </span>
                        </div>
                    </div>

                    <ShareReportIndex toggle={() => {
                        this.setState({shareReportIndexPopup: false,});
                    }}  user={this.props.user}
                        ga_property_id={this.state.ga_property_id}
                        upgradePopup={this.props.upgradePopup}
                    />
                </div>
            </AppsModal>
            </> */}
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
            this.getDashboardActivity();
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
