import React from "react";
import HttpClient from "../../utils/HttpClient";
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
import ModalHeader from "../AppsMarket/common/ModalHeader";
import SharePopups from "./SharePopups";
import ActiveRecurrence from "./ActiveRecurrence";
import { CircularProgressbar } from "react-circular-progressbar";



class ReportingDashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
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
        };
        this.shareHandler = this.shareHandler.bind(this);
        this.updateUserAnnotationColors = this.updateUserAnnotationColors.bind(this);
        this.activeReccurenceHandler = this.activeReccurenceHandler.bind(this);
    }

    async componentDidMount() {
        {
            const startDate = "2006-01-01";
            const endDate = new Date().toISOString().split("T")[0];
            const gaPropertyId = 344;
            const statisticsPaddingDays = 7;

            const graphResponse = await HttpClient.get(
                `/dashboard/analytics/annotations-metrics-dimensions`,
                {
                    params: {
                        start_date: startDate,
                        end_date: endDate,
                        ga_property_id: gaPropertyId,
                        statistics_padding_days: statisticsPaddingDays,
                    },
                }
            )
                .then(
                    (resp) => {
                        console.log("res for grapg api is ====== ", resp);
                        this.setState({ isLoading: false, graph: resp.data });
                    },
                    (err) => {
                        this.setState({
                            isLoading: false,
                            errors: err.response.data,
                        });
                    }
                )
                .catch((err) => {
                    this.setState({ isLoading: false, errors: err });
                });
            console.log("  ======    ", graphResponse, "  ====   ");
            const annotationTableResponse = HttpClient.get(
                `/dashboard/analytics/users-days-annotations`,
                {
                    params: {
                        start_date: startDate,
                        end_date: endDate,
                        ga_property_id: gaPropertyId,
                        statistics_padding_days: statisticsPaddingDays,
                    },
                }
            )
                .then(
                    (resp) => {
                        this.setState({
                            isLoading: false,
                            annotationTable: resp.data,
                        });
                    },
                    (err) => {
                        this.setState({
                            isLoading: false,
                            errors: err.response.data,
                        });
                    }
                )
                .catch((err) => {
                    this.setState({ isLoading: false, errors: err });
                });

            const attributionSourceTableResponse = HttpClient.get(
                `/dashboard/analytics/sources`,
                {
                    params: {
                        start_date: startDate,
                        end_date: endDate,
                        ga_property_id: gaPropertyId,
                        statistics_padding_days: statisticsPaddingDays,
                    },
                }
            )
                .then(
                    (resp) => {
                        this.setState({
                            isLoading: false,
                            attributionSourceTable: resp.data,
                        });
                    },
                    (err) => {
                        this.setState({
                            isLoading: false,
                            errors: err.response.data,
                        });
                    }
                )
                .catch((err) => {
                    this.setState({ isLoading: false, errors: err });
                });

            const deviceByImpressionResponse = HttpClient.get(
                `/dashboard/analytics/device-by-impression`,
                {
                    params: {
                        start_date: startDate,
                        end_date: endDate,
                        ga_property_id: gaPropertyId,
                        statistics_padding_days: statisticsPaddingDays,
                    },
                }
            )
                .then(
                    (resp) => {
                        this.setState({
                            isLoading: false,
                            deviceByImpression: resp.data,
                        });
                    },
                    (err) => {
                        this.setState({
                            isLoading: false,
                            errors: err.response.data,
                        });
                    }
                )
                .catch((err) => {
                    this.setState({ isLoading: false, errors: err });
                });
            const deviceByConversionResponse = HttpClient.get(
                `/dashboard/analytics/device-categories`,
                {
                    params: {
                        start_date: startDate,
                        end_date: endDate,
                        ga_property_id: gaPropertyId,
                        statistics_padding_days: statisticsPaddingDays,
                    },
                }
            )
                .then(
                    (resp) => {
                        this.setState({
                            isLoading: false,
                            deviceByConversion: resp.data,
                        });
                    },
                    (err) => {
                        this.setState({
                            isLoading: false,
                            errors: err.response.data,
                        });
                    }
                )
                .catch((err) => {
                    this.setState({ isLoading: false, errors: err });
                });

            const countriesResponse = HttpClient.get(
                `/dashboard/analytics/countries`,
                {
                    params: {
                        start_date: startDate,
                        end_date: endDate,
                        ga_property_id: gaPropertyId,
                        statistics_padding_days: statisticsPaddingDays,
                    },
                }
            )
                .then(
                    (resp) => {
                        this.setState({
                            isLoading: false,
                            countries: resp.data,
                        });
                    },
                    (err) => {
                        this.setState({
                            isLoading: false,
                            errors: err.response.data,
                        });
                    }
                )
                .catch((err) => {
                    this.setState({ isLoading: false, errors: err });
                });
        }

        {
            // const startDate = '2006-01-01';
            // const endDate = new Date().toISOString().split('T')[0];
            // const gaPropertyId = 344;
            // const statisticsPaddingDays = 7;
            //
            //
            //     Promise.all([
            //         HttpClient.get(`/dashboard/analytics/annotations-metrics-dimensions`, {
            //             params: {
            {
                /*                start_date: startDate,*/
            }
            //                 end_date: endDate,
            //                 ga_property_id: gaPropertyId,
            {
                /*                statistics_padding_days: statisticsPaddingDays*/
            }
            {
                /*            }*/
            }
            {
                /*        }),*/
            }
            {
                /*        HttpClient.get(`/dashboard/analytics/users-days-annotations`, {*/
            }
            {
                /*            params: {*/
            }
            {
                /*                start_date: startDate,*/
            }
            {
                /*                end_date: endDate,*/
            }
            {
                /*                ga_property_id: gaPropertyId,*/
            }
            {
                /*                statistics_padding_days: statisticsPaddingDays*/
            }
            {
                /*            }*/
            }
            {
                /*        }),*/
            }
            {
                /*        HttpClient.get(`/dashboard/analytics/sources`, {*/
            }
            {
                /*            params: {*/
            }
            {
                /*                start_date: startDate,*/
            }
            {
                /*                end_date: endDate,*/
            }
            //                 ga_property_id: gaPropertyId,
            //                 statistics_padding_days: statisticsPaddingDays
            //             }
            {
                /*        }),*/
            }
            {
                /*        HttpClient.get(`/dashboard/analytics/device-by-impression`, {*/
            }
            {
                /*            params: {*/
            }
            {
                /*                start_date: startDate,*/
            }
            {
                /*                end_date: endDate,*/
            }
            {
                /*                ga_property_id: gaPropertyId,*/
            }
            {
                /*                statistics_padding_days: statisticsPaddingDays*/
            }
            {
                /*            }*/
            }
            //         }),
            //         HttpClient.get(`/dashboard/analytics/device-categories`, {
            {
                /*            params: {*/
            }
            {
                /*                start_date: startDate,*/
            }
            {
                /*                end_date: endDate,*/
            }
            {
                /*                ga_property_id: gaPropertyId,*/
            }
            {
                /*                statistics_padding_days: statisticsPaddingDays*/
            }
            //             }
            //         }),
            //         HttpClient.get(`/dashboard/analytics/countries`, {
            //             params: {
            //                 start_date: startDate,
            //                 end_date: endDate,
            //                 ga_property_id: gaPropertyId,
            //                 statistics_padding_days: statisticsPaddingDays
            //             }
            //         })
            //     ])
            //         .then(responses => {
            //             const graphResponse = responses[0];
            //             console.log(graphResponse, "??????????????????======= ==== ");
            //             const annotationTableResponse = responses[1];
            //             const attributionSourceTableResponse = responses[2];
            //             const deviceByImpressionResponse = responses[3];
            //             const deviceByConversionResponse = responses[4];
            //             const countriesResponse = responses[5];
            //
            //             this.setState({
            //                 isLoading: false,
            //                 graph: graphResponse.data,
            //                 annotationTable: annotationTableResponse.data,
            //                 attributionSourceTable: attributionSourceTableResponse.data,
            //                 deviceByImpression: deviceByImpressionResponse.data,
            //                 deviceByConversion: deviceByConversionResponse.data,
            //                 countries: countriesResponse.data
            //             });
            //         })
            //         .catch(err => {
            //             this.setState({isLoading: false, errors: err});
            //         });
            //
        }
        // console.log('countries is ==== ',graph);
    }
    updateUserAnnotationColors(userAnnotationColors) {
        this.setState({userAnnotationColors: userAnnotationColors});
    }
    shareHandler(){
        console.log("share handler button function call");
        this.setState({ isSharePopup: true });
        console.log('sdkzfn  djdk ===== ',this.state.isSharePopup)

    }
    activeReccurenceHandler(){
        console.log("activeReccurenceHandler  button function call");
        this.setState({isActiveRecurrenecePopup :true});
        console.log('sdkzfn  djdk ===== ',this.state.isActiveRecurrenecePopup)
    }

    
   

    render() {
        const {isSharePopup,isActiveRecurrenecePopup}=this.state;
        return (
            <div className="container reporting-block">
                <div className="row">
                    <div className={"col-12"}>
                        <div className="d-flex align-items-center justify-content-between mb-5">
                            {/*wellcome div*/}
                            <div className="d-flex align-items-end">
                                <h2 className="welcome-color mb-0 p-0">
                                    Wel come Newt 👋
                                </h2>

                                <h4 className=" ml-4 discription-color mb-0 p-0">
                                    Let's do some productive today...
                                </h4>
                            </div>
                            <div className="d-flex align-items-center">
                            
                                <button className="active-recerrences mb-0 p-0 bg-white mr-4" data-toggle="modal" data-target="#exampleModalCenter1" onClick={this.activeReccurenceHandler}>
                                    <img src="/images/svg/active-recurrence.svg" alt="active icon" className="mr-2" />
                                    Active recurrence
                                </button>
                                {
                                    isActiveRecurrenecePopup && <ActiveRecurrence />
                                }
                                <button className="`btn btn-outline btn-sm btnCornerRounded share-btn " data-toggle="modal" data-target="#exampleModalCenter" onClick={this.shareHandler}>
                                    <span className="align-center">
                                        <img
                                            src="/images/svg/share.svg"
                                            alt="share icon"
                                        />
                                    </span>
                                    Share
                                </button>
                                
                                {
                                    isSharePopup && <SharePopups />
                                }
                            </div>
                            
                        </div>
                        <div className="more-conversation">
                                <h4>dfsdf sdf fs fs</h4>
                        </div>
                        {/*filter div*/}
                        <div className="filtersHolder d-flex justify-content-between align-items-center">
                            <div className="d-flex">
                                <FormGroup className="filter-sort position-relative">
                                    <Label
                                        className="sr-only"
                                        for="dropdownFilters"
                                    >
                                        <span
                                            className={`dot`}
                                            style={{ color: "2D9CDB" }}
                                        ></span>
                                        Crystal Ball
                                    </Label>
                                    <i className="btn-dot left-0 ">
                                        {/*<svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">*/}
                                        {/*    <path d="M0 10V8.33333H4V10H0ZM0 5.83333V4.16667H8V5.83333H0ZM0 1.66667V0H12V1.66667H0Z" fill="#666666" />*/}
                                        {/*</svg>*/}
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
                                        {/*<option value="added">Added</option>*/}
                                        {/*<option value="user">By User</option>*/}
                                        {/*<option value="today">By Today</option>*/}
                                        {/*<option value="date">By Date</option>*/}
                                        {/*<option value="category">By Category</option>*/}
                                        {/*<option value="ga-property">By GA Property</option>*/}
                                    </select>
                                </FormGroup>
                                <FormGroup className="filter-sort position-relative">
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
                                        {/*<option value="added">Added</option>*/}
                                        {/*<option value="user">By User</option>*/}
                                        {/*<option value="today">By Today</option>*/}
                                        {/*<option value="date">By Date</option>*/}
                                        {/*<option value="category">By Category</option>*/}
                                        {/*<option value="ga-property">By GA Property</option>*/}
                                    </select>
                                </FormGroup>
                            </div>
                            <div className="filterBtnGroup d-flex">
                                <button className="filter-btn">Today</button>
                                <button className="filter-btn">1w</button>
                                <button className="filter-btn">2w</button>
                                <button className="filter-btn">1m</button>
                                <button className="filter-btn">6m</button>
                                <button className="filter-btn">All</button>
                                <button className="custom-btn">Custom
                                <img className="pl-2" src="/images/svg/custom-date.svg"
                                 alt="custom-date icon" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className={"col-8"}>
                        {/*left side div*/}
                        {/*user's div*/}
                        {/* {
                            this.state.cardIsSelected ?
                            this.state.userClassName=="report-box-selected"                        
                        : 
                        this.state.userClassName=="report-box"                         
                        }
                         */}
                        <div className="report-box">
                            {
                                this.state.cardIsSelected ?
                                <span className="tickicongreen">
                                <img  src="/images/svg/green-tick.svg"
                                 alt="green-tick icon" />
                            </span>
                            : null
                            }
                            
                            <div className="d-flex justify-content-between">
                                <div>
                                    <h4 className="card-heading">Users</h4>
                                </div>
                                <div>
                                    <span>
                                    <img
                                            src="/images/svg/dashboard-goto-link.svg"
                                            alt="link icon"
                                        />                                    
                                        
                                    </span>
                                    <span>
                                        <div class="btn-group gaa-annotation">
                                            {/* <button class="btn btn-secondary btn-sm" type="button">
                                                Small split button
                                            </button> */}
                                            <button class="border-0 p-0 bg-white" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            <img
                                                src="/images/svg/dashboard-list-option.svg"
                                                alt="list icon"
                                            />
                                            </button>
                                            <div class="dropdown-menu">
                                                a
                                                ball
                                            </div>
                                        </div>
                                        
                                    </span>
                                </div>
                            </div>
                            <div className="mt-4">
                                {/* <LineChart
                                    width={600}
                                    height={200}
                                    data={this.state.data}
                                >
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <CartesianGrid stroke="#ccc" />
                                    <Tooltip />
                                    <Legend />
                                    <Line
                                        type="monotone"
                                        dataKey="uv"
                                        stroke="#82ca9d"
                                        strokeWidth={2}
                                    />
                                </LineChart> */}
                            </div>
                        </div>
                        
                        {/*Attribution source*/}
                        <div className="report-box">
                            <div className="d-flex justify-content-between">
                                <div>
                                    <h4 className="card-heading">
                                        Attribution source
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
                            <table className="table border mb-0">
                                <thead>
                                    <tr>
                                        <td>Impression</td>
                                        <td>User</td>
                                        <td>Conversation</td>
                                        <td>Conversation Rate</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.attributionSourceData.map(
                                        (itm, index) => (
                                            <tr key={index}>
                                                <td>
                                                    {itm.name ===
                                                    "Gannotations" ? (
                                                        <span className="pr-2 d-flex align-items-center">
                                                            <span style={{'width': '1rem', 'display':'block', 'marginRight':'8px'}}>
                                                            <img
                                                                style={{'width': '100%', 'height':'auto',}}
                                                                src="/images/svg/google.svg"
                                                                alt="list icon"
                                                            />
                                                            </span>
                                                            {itm.name}
                                                        </span>
                                                    ) : itm.name ===
                                                      "wowsite.co" ? (
                                                        <span>{itm.name}</span>
                                                    ) : itm.name ===
                                                      "youtube.com/videos" ? (
                                                        <span className="pr-2 d-flex align-items-center">
                                                            <span style={{'width': '1rem', 'display':'block', 'marginRight':'8px'}}>
                                                                <img
                                                                    style={{'width': '100%', 'height':'auto',}}
                                                                    src="/images/svg/youtube.svg"
                                                                    alt="list icon"
                                                                />
                                                            </span>
                                                            {itm.name}
                                                        </span>
                                                    ) : itm.name ===
                                                      "news.yahoo.com" ? (
                                                        <span className="pr-2 d-flex align-items-center">
                                                            <span style={{'width': '1rem', 'display':'block', 'marginRight':'8px'}}>
                                                                <img
                                                                    style={{'width': '100%', 'height':'auto',}}
                                                                    src="/images/svg/yahoo.svg"
                                                                    alt="list icon"
                                                                />
                                                            </span>
                                                            {itm.name}
                                                        </span>
                                                    ) : itm.name ===
                                                      "newwebsite.com" ? (
                                                        <span>{itm.name}</span>
                                                    ) : itm.name ===
                                                      "instagram.com" ? (
                                                        <span className="pr-2 d-flex align-items-center">
                                                            <span style={{'width': '1rem', 'display':'block', 'marginRight':'8px'}}>
                                                                <img
                                                                    style={{'width': '100%', 'height':'auto',}}
                                                                    src="/images/svg/instagram.svg"
                                                                    alt="list icon"
                                                                />
                                                            </span>
                                                            {itm.name}
                                                        </span>
                                                    ) : null}
                                                </td>
                                                <td>{itm.users}</td>
                                                <td>{itm.conversation}</td>
                                                <td>{itm.conversionRate}</td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="d-flex flex-column">
                            <div className="fourGridBoxesHolder">
                                {/*<p className="card-heading">Todays expence</p>*/}
                                {/*Todays Expence div*/}
                                <div className="">
                                    <div className={"w-100 mb-3 report-box"}>
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
                                        <div className="fourGridBoxesHolder">
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

                                    {/*Create your own moodboard div*/}
                                    <div className="w-100 report-box">
                                        <div>
                                            <p>
                                                Create your own moodboard <br />
                                                and find them all at one place
                                            </p>
                                        </div>
                                        <div>
                                            <form>
                                                {/* <label htmlFor="img">Add Images:</label> */}
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
                                    
                                </div>

                                <div >
                                    {/*Linkin taffic cpc div*/}
                                    <div className="w-100 mb-3 report-box">
                                        <div className="d-flex justify-content-between mb-5">
                                            <div>
                                                <h4 className="card-heading">
                                                    LinkedIn traffic CPC
                                                </h4>
                                            </div>
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
                                            {/* <LineChart
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
                                            </LineChart> */}
                                        </div>
                                    </div>
                                    {/*Another data div*/}
                                    <div className="w-100 report-box">
                                        <div className="justify-content-between d-flex mb-3">
                                            <div>
                                                <h3 className="card-heading">
                                                    Another Data
                                                    *********
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
                                    </div>
                                    
                                </div>

                                

                                
                            </div>
                        </div>

                        {/*youtube engagement div*/}
                        <div className="report-box">
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

                            {/* <BarChart
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
                            </BarChart> */}
                        </div>
                        <div>
                            <div className="fourGridBoxesHolder">
                                {/*Another important data div*/}
                                <div className="report-box w-100">
                                    <div className="justify-content-between d-flex mb-3">
                                        <div>
                                            <p className="card-heading">
                                                Another Data *********
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
                                    {/* <div className="d-flex justify-content-between mb-5">
                                        <div>
                                            <p className="card-heading">
                                                Another important data
                                            </p>
                                        </div>
                                        <div>
                                            <span><img src="/images/svg/dashboard-list-option.svg" alt="list icon"/></span>                              
                                        </div>
                                    </div>
                                     */}
                                    <div className="">
                                        {/* <BarChart
                                            width={350}
                                            height={300}
                                            data={this.state.data}
                                            margin={{
                                                top: 20,
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
                                        </BarChart> */}
                                    </div>
                                    <div className="pt-4 justify-content-center ml-5">
                                        <h3 className="align-center">Today</h3>
                                        <div className="d-flex flex-row">
                                            <div className="d-flex flex-column">
                                            <h4>
                                            <span>
                                                <img
                                                    src="/images/svg/blue-dot.svg"
                                                    alt="blue-dot icon"
                                                />
                                            </span>
                                                Volume
                                            </h4>
                                              <h4>1234</h4> 
                                            </div>
                                             <div className="d-flex flex-column">
                                             <h4 className="ml-4">
                                                <span>
                                                    <img
                                                        src="/images/svg/green-dot.svg"
                                                        alt="green-dot icon"
                                                    />
                                                </span>
                                                Services
                                            </h4>
                                            <h4>
                                                 1234
                                            </h4>
                                             </div>
                                            
                                           
                                        </div>
                                    </div>
                                </div>
                                {/*stores status div*/}
                                <div className="d-flex flex-column report-box w-100">
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
                                            {/* <LineChart
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
                                            </LineChart> */}
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
                                            {/* <LineChart
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
                                            </LineChart> */}
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
                                {/*Another data div*/}
                                <div className="report-box w-100">
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
                                        <div>
                                            {/* <PieChart width={184} height={184}>
                                                <Pie
                                                    data={this.state.data02}
                                                    cx="50%"
                                                    cy="50%"
                                                    // labelLine={false}
                                                    // label={renderCustomizedLabel}
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
                                            </PieChart> */}
                                        </div>
                                        
                                            <div className="d-flex flex-column justify-content-center">
                                                <span className="d-flex">
                                                    <span className="">
                                                        <img
                                                            src="/images/svg/green-dot.svg"
                                                            alt="green-dot icon"
                                                        />
                                                    </span>
                                                    <h5>Desktop</h5>
                                                </span>
                                                <span className="d-flex">
                                                    <span>
                                                        <img
                                                            src="/images/svg/yellow-dot.svg"
                                                            alt="yellow-dot icon"
                                                        />
                                                    </span>

                                                    <h5>Mobile</h5>
                                                </span>
                                                <span className="d-flex">
                                                    <span>
                                                        <img
                                                            src="/images/svg/red-dot.svg"
                                                            alt="red-dot icon"
                                                        />
                                                    </span>
                                                    <h5>Tablet</h5>
                                                </span>
                                                <span className="d-flex">
                                                    <span>
                                                        <img
                                                            src="/images/svg/unknown-dot.svg"
                                                            alt="red-dot icon"
                                                        />
                                                    </span>
                                                    <h5>Unknown</h5>
                                                </span>
                                                
                                            </div>
                                    </div>       
                                    
                                </div>
                                {/*Another data dive */}
                                <div className="report-box w-100">
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
                                    <div className="d-flex justify-content-between justify-content-center">
                                        <div>
                                            {/* <PieChart width={184} height={184}>
                                                <Pie
                                                    data={this.state.data02}
                                                    cx="50%"
                                                    cy="50%"
                                                    // labelLine={false}
                                                    // label={renderCustomizedLabel}
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
                                            </PieChart> */}
                                        </div>
                                        
                                            <div className="d-flex flex-column ">
                                                        <span className="d-flex">
                                                            <span className="">
                                                                <img
                                                                    src="/images/svg/green-dot.svg"
                                                                    alt="green-dot icon"
                                                                />
                                                            </span>
                                                            <h5>Desktop</h5>
                                                        </span>
                                                        <span className="d-flex">
                                                            <span>
                                                                <img
                                                                    src="/images/svg/yellow-dot.svg"
                                                                    alt="yellow-dot icon"
                                                                />
                                                            </span>

                                                            <h5>Mobile</h5>
                                                        </span>
                                                        <span className="d-flex">
                                                            <span>
                                                                <img
                                                                    src="/images/svg/red-dot.svg"
                                                                    alt="red-dot icon"
                                                                />
                                                            </span>
                                                            <h5>Tablet</h5>
                                                        </span>
                                                        <span className="d-flex">
                                                            <span>
                                                                <img
                                                                    src="/images/svg/unknown-dot.svg"
                                                                    alt="red-dot icon"
                                                                />
                                                            </span>
                                                            <h5>Unknown</h5>
                                                        </span>
                                                        
                                            </div>
                                    </div>
                                   
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={"col-4"}>
                        {/*right side div*/}
                        {/*Annotations div*/}
                        <div className=" report-box ">
                            <div className="d-flex justify-content-between mb-5">
                                <div>
                                    <h4 className="card-heading">
                                        Annotations
                                    </h4>
                                </div>
                                <div>
                                    <div className="btn-group dropright">
                                        <button type="button" className="btn btn-secondary">
                                            Split dropright
                                        </button>
                                        <button type="button" className="btn btn-secondary dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            <span className="sr-only">Toggle Dropright</span>
                                        </button>
                                        <div className="dropdown-menu">
                                        </div>
                                    </div>
                                    {/* <span>
                                        <img
                                            src="/images/svg/dashboard-list-option.svg"
                                            alt="list icon"
                                        />
                                    </span> */}
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
                                {/*<tbody>*/}
                                {/*<tr>*/}
                                {/*    <td>alif</td>*/}
                                {/*</tr>*/}
                                {/*<tr>*/}
                                {/*    <td>alif</td>*/}
                                {/*</tr>*/}
                                {/*<tr>*/}
                                {/*    <td>alif</td>*/}
                                {/*</tr>*/}
                                {/*</tbody>*/}
                            </table>
                        </div>
                        {/*Device by impression div*/}
                        <div className=" report-box">
                            <div className="d-flex justify-content-between mb-5">
                                <div>
                                    <h4 className="card-heading">
                                        Devivce By Impression
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
                            <div>
                                <table className="table border">
                                    <thead>
                                        <tr>
                                            <td>Source</td>
                                            <td>Click</td>
                                            <td>Impr.</td>
                                            <td>unknown</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.data.map((itm, index) => (
                                            <tr key={index}>
                                                <td>{itm.name}</td>
                                                <td>{itm.pv}</td>
                                                <td>{itm.uv}</td>
                                                <td>{itm.uv}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="d-flex justify-content-between">
                                <div className="d-flex flex-row">
                                    {/*<ResponsiveContainer width="100%" height="100%">*/}
                                    {/* <PieChart width={150} height={150}>
                                        <Pie
                                            data={this.state.data02}
                                            dataKey="value"
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={30}
                                            outerRadius={40}
                                            fill="#82ca9d"
                                            label
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
                                    </PieChart> */}
                                    {/*</ResponsiveContainer>*/}
                                    <div className="d-flex flex-column pl-3 justify-content-center">
                                        <span className="d-flex">
                                            <span className="">
                                                <img
                                                    src="/images/svg/green-dot.svg"
                                                    alt="green-dot icon"
                                                />
                                            </span>
                                            <h5>Desktop</h5>
                                        </span>
                                        <span className="d-flex">
                                            <span>
                                                <img
                                                    src="/images/svg/yellow-dot.svg"
                                                    alt="yellow-dot icon"
                                                />
                                            </span>

                                            <h5>Mobile</h5>
                                        </span>
                                        <span className="d-flex">
                                            <span>
                                                <img
                                                    src="/images/svg/red-dot.svg"
                                                    alt="red-dot icon"
                                                />
                                            </span>
                                            <h5>Tablet</h5>
                                        </span>
                                        {/* <span>Desktop</span>
                                            <span>Mobile</span>
                                            <span>Tablet</span> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/*Device by Conversation div*/}
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
                                            <td>Source</td>
                                            <td>User</td>
                                            <td>Conv.Rate</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.conversationData.map(
                                            (itm, index) => (
                                                <tr key={index}>
                                                    {/* <span className="d-flex"> */}
                                                    <td>
                                                        {itm.name ===
                                                        "Desktop" ? (
                                                            <span className="pr-1">
                                                                <img
                                                                    src="/images/svg/desktop.svg"
                                                                    alt="list icon"
                                                                />
                                                                {itm.name}
                                                            </span>
                                                        ) : itm.name ===
                                                          "Mobile" ? (
                                                            <span className="pr-1">
                                                                <img
                                                                    src="/images/svg/mobile.svg"
                                                                    alt="list icon"
                                                                />
                                                                {itm.name}
                                                            </span>
                                                        ) : itm.name ===
                                                          "Tablet" ? (
                                                            <span className="pr-1">
                                                                <img
                                                                    src="/images/svg/tablet.svg"
                                                                    alt="list icon"
                                                                />
                                                                {itm.name}
                                                            </span>
                                                        ) : null}
                                                    </td>
                                                    {/* <td>{itm.name}</td> */}
                                                    {/* </span> */}
                                                    <td>{itm.users}</td>
                                                    <td>
                                                        {itm.conversionRate}
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            <div className="d-flex justify-content-between ">
                                <div className="">
                                    {/*<ResponsiveContainer width="100%" height="100%">*/}
                                    {/* <PieChart width={150} height={150}>
                                        <Pie
                                            data={this.state.data02}
                                            dataKey="value"
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={30}
                                            outerRadius={40}
                                            fill="#82ca9d"
                                            label
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
                                    </PieChart> */}
                                    {/*</ResponsiveContainer>*/}
                                </div>
                                <div className="d-flex flex-column">
                                    <span className="d-flex">
                                        <span className="">
                                            <img
                                                src="/images/svg/green-dot.svg"
                                                alt="green-dot icon"
                                            />
                                        </span>
                                        <h5>Desktop</h5>
                                    </span>
                                    <span className="d-flex">
                                        <span>
                                            <img
                                                src="/images/svg/yellow-dot.svg"
                                                alt="yellow-dot icon"
                                            />
                                        </span>

                                        <h5>Mobile</h5>
                                    </span>
                                    <span className="d-flex">
                                        <span>
                                            <img
                                                src="/images/svg/red-dot.svg"
                                                alt="red-dot icon"
                                            />
                                        </span>
                                        <h5>Tablet</h5>
                                    </span>
                                </div>
                            </div>
                        </div>
                        {/*Visitor by Country */}
                        <div className="report-box">
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
                        </div>
                        {/*Facebook Ad's div*/}
                        <div className="report-box">
                            <h6>
                                Connect Facebook Ads and get valuable                            
                                insights on rate, retention, cpc etc
                                *********
                            </h6>
                                <img
                                    src="/images/svg/fb-bg.svg"
                                    alt="option icon"
                                />
                                <div className="fb-ads">
                                <span>
                                <img
                                    src="/images/svg/fb-ads.svg"
                                    alt="fb-ads icon"
                                />
                                </span>
                                <span>
                                <img 
                                    src="/images/svg/premium-btn.svg"
                                    alt="premium icon"
                                />
                                </span>
                                </div>
                               
                                

                        </div>
                        {/*Another data div */}
                        <div className="report-box">
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
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ReportingDashboard;
