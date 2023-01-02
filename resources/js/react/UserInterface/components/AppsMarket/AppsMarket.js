import React from "react";
import { toast } from "react-toastify";
import { Redirect } from "react-router-dom";
import { UncontrolledPopover, PopoverHeader, PopoverBody } from "reactstrap";
import LoaderAnimation from "../../utils/LoaderAnimation";
import Countries from "../../utils/Countries";
import HttpClient from "../../utils/HttpClient";
import DSRMDatesSelect from "../../utils/DSRMDatesSelect";
import DSOWMCitiesSelect from "../../utils/DSOWMCitiesSelect";
import DSOWMEventsSelect from "../../utils/DSOWMEventsSelect";
import DSGAUDatesSelect from "../../utils/DSGAUDatesSelect";
import DSGoogleAlertsSelect from "../../utils/DSGoogleAlertsSelect";
import DSWebMonitorsSelect from "../../utils/DSWebMonitorsSelect";
import GoogleAnalyticsPropertySelect from "../../utils/GoogleAnalyticsPropertySelect";
import AddKeyword from "../../utils/AddKeyword";
import ManageKeywords from "../../utils/ManageKeywords";
import UserAnnotationColorPicker from "../../helpers/UserAnnotationColorPickerComponent";
import ErrorAlert from "../../utils/ErrorAlert";
import DataSourceInterfaceTour from "../../helpers/DataSourceInterfaceTour";
import { getCompanyName } from "../../helpers/CommonFunctions";
import EditKeyword from "../../utils/EditKeyword";
import GoogleAdChanges from "../../utils/GoogleAdChanges";
import FacebookTracking from "../../utils/FacebookTracking";
import TwitterTracking from "../../utils/TwitterTracking";
import InstagramTracking from "../../utils/InstagramTracking";
import BitbucketTracking from "../../utils/BitbucketTracking";
import GithubTracking from "../../utils/GithubTracking";
import ApplePodcast, { ApplePodcastConfig } from "../../utils/ApplePodcast";

import { Container, Row, Col, FormGroup, Input, Label } from "reactstrap";
import AppsModal from "./AppsModal";
import WebsiteMonitoring from "./WebsiteMonitoring";
import NewsAlerts from "./NewsAlerts";
import GoogleUpdates from "./GoogleUpdates";
import RetailMarketingDates from "./RetailMarketingDates";
import Holidays from "./Holidays";

class AppsMarket extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sectionName: null,
            userDataSources: {},
            userAnnotationColors: {},
            userServices: this.props.user,
            isBusy: false,
            isLoading: false,
            errors: "",
            redirectTo: null,
            showHintFor: null,
            ga_property_id: "",
            webMonitors: [],
            manage_keyword_show: false,
            dfsKeywords: [],
            totalDfsKeywordCreditsUsed: 0,
            editKeyword: false,
            editKeyword_keyword_id: "",
            editKeyword_keyword_configuration_id: "",
            userFacebookAccountsExists: false,
            userInstagramAccountsExists: false,
            userBitbucketAccountsExists: false,
            userGithubAccountsExists: false,
            dsKey: "",
        };
        this.userDataSourceAddHandler =
            this.userDataSourceAddHandler.bind(this);
        this.userDataSourceDeleteHandler =
            this.userDataSourceDeleteHandler.bind(this);
        this.serviceStatusHandler = this.serviceStatusHandler.bind(this);

        this.loadUserDataSources = this.loadUserDataSources.bind(this);

        this.updateUserAnnotationColors =
            this.updateUserAnnotationColors.bind(this);
        this.loadUserAnnotationColors =
            this.loadUserAnnotationColors.bind(this);

        this.sectionToggler = this.sectionToggler.bind(this);

        this.reloadWebMonitors = this.reloadWebMonitors.bind(this);

        this.manage_keyword_popup_handler =
            this.manage_keyword_popup_handler.bind(this);

        this.keywordAddHandler = this.keywordAddHandler.bind(this);
        this.loadKeywordTrackingKeywords =
            this.loadKeywordTrackingKeywords.bind(this);

        this.editKeywordToggler = this.editKeywordToggler.bind(this);
        this.checkUserFacebookAccount =
            this.checkUserFacebookAccount.bind(this);
        this.checkUserBitbucketAccount =
            this.checkUserBitbucketAccount.bind(this);
        this.checkUserGithubAccount = this.checkUserGithubAccount.bind(this);
        this.updateUserService = this.updateUserService.bind(this);
    }

    componentDidMount() {
        document.title = "Automation";
        this.loadUserDataSources("");
        this.loadUserAnnotationColors();
        this.reloadWebMonitors("");

        this.loadKeywordTrackingKeywords();

        this.checkUserFacebookAccount();
        this.checkUserBitbucketAccount();
        this.checkUserGithubAccount();

        let alertMessage = new URLSearchParams(window.location.search).get(
            "alertMessage"
        );
        if (alertMessage) {
            swal.fire({
                iconHtml: '<img src="/images/svg/twitter.svg">',
                title: "Connected",
                html: alertMessage,
            });
        }
    }

    loadUserDataSources(gaPropertyId) {
        if (!this.state.isLoading) {
            this.setState({ isLoading: true });
            HttpClient.get(
                `/data-source/user-data-source?ga_property_id=${gaPropertyId}`
            )
                .then(
                    (resp) => {
                        this.setState({
                            isLoading: false,
                            userDataSources: resp.data.user_data_sources,
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
    }

    loadKeywordTrackingKeywords() {
        this.setState({ isBusy: true, errors: "" });
        HttpClient.get(`/data-source/get-keyword-tracking-keywords`)
            .then(
                (resp) => {
                    this.setState({
                        isLoading: false,
                        dfsKeywords: resp.data.keywords
                            ? resp.data.keywords
                            : [],
                    });
                    let total = 0;
                    this.state.dfsKeywords.map(function (
                        keyword_instance,
                        index
                    ) {
                        keyword_instance.configurations.map(function (
                            configuration_instance
                        ) {
                            total++;
                        });
                    });
                    this.setState({
                        totalDfsKeywordCreditsUsed: total,
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

    loadUserAnnotationColors() {
        if (!this.state.isLoading) {
            this.setState({ isLoading: true });
            HttpClient.get(`/data-source/user-annotation-color`)
                .then(
                    (resp) => {
                        this.setState({
                            isLoading: false,
                            userAnnotationColors:
                                resp.data.user_annotation_color,
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
    }

    updateUserAnnotationColors(userAnnotationColors) {
        this.setState({ userAnnotationColors: userAnnotationColors });
    }

    reloadWebMonitors(gaPropertyId) {
        HttpClient.get(
            `/data-source/web-monitor?ga_property_id=${gaPropertyId}`
        )
            .then(
                (resp) => {
                    this.setState({
                        webMonitors: resp.data.web_monitors,
                        isBusy: false,
                    });
                },
                (err) => {
                    this.setState({ isBusy: false });
                }
            )
            .catch((err) => {
                this.setState({ isBusy: false });
            });
    }

    manage_keyword_popup_handler() {
        this.setState({
            manage_keyword_show: false,
        });
    }

    keywordAddHandler() {
        // reload the component
        this.sectionToggler("keyword_tracking");
        this.loadKeywordTrackingKeywords();
    }

    editKeywordToggler(keyword_id, keyword_configuration_id) {
        // close popup
        this.manage_keyword_popup_handler();

        // show edit form
        this.setState({
            editKeyword_keyword_id: keyword_id,
            editKeyword_keyword_configuration_id: keyword_configuration_id,
        });

        this.setState({
            editKeyword: true,
        });

        this.sectionToggler("edit_keyword");
    }

    render() {
        if (this.state.redirectTo)
            return <Redirect to={this.state.redirectTo} />;

        return (
            <div id="appMarket" className="appMarket">
                <Container>
                    <div className="pageHeader">
                        <h2 className="pageTitle">Apps Market</h2>

                        <div className="pageNote d-flex justify-content-center align-items-center position-relative">
                            <div className="d-flex align-items-center justify-content-center">
                                <span className="githubIcon">
                                    <i className="fa fa-github"></i>
                                </span>
                                <p className="noteText m-0">
                                    See the changes your <strong>R&D</strong>{" "}
                                    makes and how they affect your{" "}
                                    <strong>sales</strong>
                                </p>
                                <a href="/" className="btn btn-sm btn-primary">
                                    Add
                                </a>
                            </div>
                            <a href="/" className="btn-learnmore">
                                Learn more
                            </a>
                        </div>

                        <form className="pageFilters d-flex justify-content-between align-items-center">
                            <FormGroup className="filter-sort position-relative">
                                <Label
                                    className="sr-only"
                                    for="dropdownFilters"
                                >
                                    sort by filter
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
                                <Input
                                    type="select"
                                    name="select"
                                    id="dropdownFilters"
                                >
                                    <option>Sort by</option>
                                    <option>Asending</option>
                                    <option>Desending</option>
                                    <option>Name</option>
                                    <option>Date</option>
                                </Input>
                            </FormGroup>
                            <FormGroup className="filter-search position-relative">
                                <Label className="sr-only" for="search">
                                    search
                                </Label>
                                <Input
                                    type="search"
                                    name="search"
                                    id="search"
                                    placeholder="with a placeholder"
                                />
                                <button className="btn-searchIcon">
                                    <img
                                        className="d-block"
                                        src="/search-new.svg"
                                        width="16"
                                        height="16"
                                        alt="Search"
                                    />
                                </button>
                            </FormGroup>
                        </form>

                        <h3 className="h3-title">Recommended For You</h3>
                    </div>
                    <Row className="items">
                        {[
                            {
                                id: "01",
                                background: "null",
                                dsKey: "is_ds_google_alerts_enabled",
                                enabled:
                                    this.state.userServices
                                        .is_ds_google_alerts_enabled,
                                premium: false,
                                brandName: "News Alerts",
                                brandLogo: "/newsAlerts.svg",
                            },
                            {
                                id: "02",
                                background: "#00749a",
                                dsKey: "is_ds_wordpress_updates_enabled",
                                enabled:
                                    this.state.userServices
                                        .is_ds_wordpress_updates_enabled,
                                premium: false,
                                brandName: "Wordpress",
                                brandLogo: "/wordpress.svg",
                            },
                            {
                                id: "03",
                                background: "null",
                                dsKey: "is_ds_keyword_tracking_enabled",
                                enabled:
                                    this.state.userServices
                                        .is_ds_keyword_tracking_enabled,
                                premium: false,
                                brandName: "Rank Tracking SERP",
                                brandLogo: "/serp.svg",
                            },
                            {
                                id: "04",
                                background: "null",
                                dsKey: "is_ds_weather_alerts_enabled",
                                enabled:
                                    this.state.userServices
                                        .is_ds_weather_alerts_enabled,
                                premium: false,
                                brandName: "Weather Alerts",
                                brandLogo: "/weatherAlerts.svg",
                            },
                            {
                                id: "05",
                                background: "null",
                                dsKey: "is_ds_google_algorithm_updates_enabled",
                                enabled:
                                    this.state.userServices
                                        .is_ds_google_algorithm_updates_enabled,
                                premium: false,
                                brandName: "Google Updates",
                                brandLogo: "/googleUpdates.svg",
                            },
                            {
                                id: "06",
                                background: "null",
                                dsKey: "",
                                enabled: false,
                                premium: false,
                                brandName: "Google Ads",
                                brandLogo: "/googleAds.svg",
                            },
                            {
                                id: "07",
                                background: "#004F9D",
                                dsKey: "",
                                enabled: false,
                                premium: false,
                                brandName: "Facebook Ads",
                                brandLogo: "/facebookAds.svg",
                            },
                            {
                                id: "08",
                                background:
                                    "radial-gradient(126.96% 126.96% at 6.47% 97.81%, #FA8F21 9%, #D82D7E 78%)",
                                dsKey: "",
                                enabled: false,
                                premium: false,
                                brandName: "Instagram",
                                brandLogo: "/instagram.svg",
                            },
                            {
                                id: "09",
                                background: "#1DA1F2",
                                dsKey: "is_ds_twitter_tracking_enabled",
                                enabled:
                                    this.state.userServices
                                        .is_ds_twitter_tracking_enabled,
                                premium: false,
                                brandName: "Twitter",
                                brandLogo: "/twitter.svg",
                            },
                            {
                                id: "10",
                                background: "#411442",
                                dsKey: "",
                                enabled: false,
                                premium: false,
                                brandName: "slack",
                                brandLogo: "/slack.svg",
                            },
                            {
                                id: "11",
                                background: "#F8761F",
                                dsKey: "",
                                enabled: false,
                                premium: false,
                                brandName: "Hubspot",
                                brandLogo: "/hubspot.svg",
                            },
                            {
                                id: "12",
                                background: "#FF4A00",
                                dsKey: "",
                                enabled: false,
                                premium: false,
                                brandName: "Zapier",
                                brandLogo: "/zapier.svg",
                            },
                            {
                                id: "13",
                                background: "#006192",
                                dsKey: "",
                                enabled: false,
                                premium: false,
                                brandName: "Linkedin",
                                brandLogo: "/linkedin.svg",
                            },
                            {
                                id: "14",
                                background: "#03363D",
                                dsKey: "",
                                enabled: false,
                                premium: false,
                                brandName: "Zendesk",
                                brandLogo: "/zendesk.svg",
                            },
                            {
                                id: "15",
                                background: "#00A1E0",
                                dsKey: "",
                                enabled: false,
                                premium: false,
                                brandName: "Salesforce",
                                brandLogo: "/salesforce.svg",
                            },
                            {
                                id: "16",
                                background: "#2EBD59",
                                dsKey: "",
                                enabled: false,
                                premium: false,
                                brandName: "Sportfy Podcast",
                                brandLogo: "/sportfyPodcast.svg",
                            },
                            {
                                id: "17",
                                background: "null",
                                dsKey: "",
                                enabled: false,
                                premium: false,
                                brandName: "Apple Podcast",
                                brandLogo: "/applePodcast.svg",
                            },
                            {
                                id: "18",
                                background: "#FF9900",
                                dsKey: "",
                                enabled: false,
                                premium: false,
                                brandName: "amazoon Podcast",
                                brandLogo: "/amazonPodcast.svg",
                            },
                            {
                                id: "19",
                                background: "#24292F",
                                dsKey: "is_ds_github_tracking_enabled",
                                enabled:
                                    this.state.userServices
                                        .is_ds_github_tracking_enabled,
                                premium: false,
                                brandName: "GitHub",
                                brandLogo: "/github.svg",
                            },
                            {
                                id: "20",
                                background: "null",
                                dsKey: "",
                                enabled: false,
                                premium: false,
                                brandName: "Shopify",
                                brandLogo: "/shopify.svg",
                            },
                            {
                                id: "21",
                                background: "#2E3133",
                                dsKey: "",
                                enabled: false,
                                premium: false,
                                brandName: "WIX.com",
                                brandLogo: "/wixCom.svg",
                            },
                            {
                                id: "22",
                                background: "null",
                                dsKey: "",
                                enabled: false,
                                premium: false,
                                brandName: "ZOHO",
                                brandLogo: "/zoho.svg",
                            },
                            {
                                id: "23",
                                background: "null",
                                dsKey: "",
                                enabled: false,
                                premium: false,
                                brandName: "YouTube",
                                brandLogo: "/youtube.svg",
                            },
                            {
                                id: "24",
                                background: "null",
                                dsKey: "is_ds_retail_marketing_enabled",
                                enabled:
                                    this.state.userServices
                                        .is_ds_retail_marketing_enabled,
                                premium: false,
                                brandName: "Retail Marketing Dates",
                                brandLogo: "/retailMarketingDates.svg",
                            },
                            {
                                id: "25",
                                background: "#253858",
                                dsKey: "is_ds_bitbucket_tracking_enabled",
                                enabled:
                                    this.state.userServices
                                        .is_ds_bitbucket_tracking_enabled,
                                premium: false,
                                brandName: "Bitbucket",
                                brandLogo: "/bitbucket.svg",
                            },
                            {
                                id: "26",
                                background: "null",
                                dsKey: "",
                                enabled: false,
                                premium: false,
                                brandName: "Google Tag Manager",
                                brandLogo: "/googleTagManager.svg",
                            },
                            {
                                id: "27",
                                background: "null",
                                dsKey: "is_ds_holidays_enabled",
                                enabled:
                                    this.state.userServices
                                        .is_ds_holidays_enabled,
                                premium: false,
                                brandName: "Holidays",
                                brandLogo: "/holidays.svg",
                            },
                            {
                                id: "28",
                                background: "null",
                                dsKey: "is_ds_web_monitors_enabled",
                                enabled:
                                    this.state.userServices
                                        .is_ds_web_monitors_enabled,
                                premium: false,
                                brandName: "Website Monitoring",
                                brandLogo: "/websiteMonitoring.svg",
                            },
                            {
                                id: "29",
                                background: "#0A0A0A",
                                dsKey: "",
                                enabled: false,
                                premium: false,
                                brandName: "TikTok",
                                brandLogo: "/tiktok.svg",
                            },
                        ].map((item, itemKey) => (
                            <Col xs="3">
                                <div
                                    onClick={() => {
                                        this.setState({ dsKey: item.dsKey });
                                    }}
                                    className="item"
                                    key={itemKey}
                                    style={{
                                        background: item.background || "#fff",
                                        "border-color":
                                            item.background || "#e0e0e0",
                                    }}
                                >
                                    {item.enabled ? (
                                        <i class="active fa fa-check-circle"></i>
                                    ) : null}
                                    <img
                                        src={item.brandLogo}
                                        alt={item.brandName}
                                        className="svg-inject"
                                    />
                                    {item.premium ? (
                                        <span className="btn-premium">
                                            <i className="fa fa-diamond"></i>
                                            <span>Premium</span>
                                        </span>
                                    ) : null}
                                </div>
                            </Col>
                        ))}
                        {/* <Col xs='3'>
            <div className='item'>
              <i class="active fa fa-check-circle"></i>
              <h3 className='mb-0'>Item Box</h3>
            </div>
          </Col>
          <Col xs='3'>
            <div className='item'>
              <i class="active fa fa-check-circle"></i>
              <h3 className='mb-0'>Item Box</h3>
            </div>
          </Col>
          <Col xs='3'>
            <div className='item'>
              <i class="active fa fa-check-circle"></i>
              <h3 className='mb-0'>Item Box</h3>
            </div>
          </Col>
          <Col xs='3'>
            <div className='item'>
              <i class="active fa fa-check-circle"></i>
              <h3 className='mb-0'>Item Box</h3>
            </div>
          </Col>
          <Col xs='3'>
            <div className='item'>
              <i class="active fa fa-check-circle"></i>
              <h3 className='mb-0'>Item Box</h3>
            </div>
          </Col>
          <Col xs='3'>
            <div className='item'>
              <i class="active fa fa-check-circle"></i>
              <h3 className='mb-0'>Item Box</h3>
            </div>
          </Col>
          <Col xs='3'>
            <div className='item'>
              <i class="active fa fa-check-circle"></i>
              <h3 className='mb-0'>Item Box</h3>
            </div>
          </Col>
          <Col xs='3'>
            <div className='item'>
              <i class="active fa fa-check-circle"></i>
              <h3 className='mb-0'>Item Box</h3>
            </div>
          </Col>
          <Col xs='3'>
            <div className='item'>
              <i class="active fa fa-check-circle"></i>
              <h3 className='mb-0'>Item Box</h3>
            </div>
          </Col>
          <Col xs='3'>
            <div className='item'>
              <i class="active fa fa-check-circle"></i>
              <h3 className='mb-0'>Item Box</h3>
            </div>
          </Col>
          <Col xs='3'>
            <div className='item'>
              <i class="active fa fa-check-circle"></i>
              <h3 className='mb-0'>Item Box</h3>
            </div>
          </Col> */}
                    </Row>
                    <AppsModal
                        isOpen={this.state.dsKey}
                        toggle={() => {
                            this.setState({
                                dsKey: "",
                            });
                        }}
                    >
                        {this.state.dsKey === "is_ds_web_monitors_enabled" ? (
                            <WebsiteMonitoring
                                {...this.state}
                                {...this.props}
                                updateUserAnnotationColors={
                                    this.updateUserAnnotationColors
                                }
                                serviceStatusHandler={this.serviceStatusHandler}
                                changeShownHint={this.changeShownHint}
                                sectionToggler={this.sectionToggler}
                                userDataSourceAddHandler={
                                    this.userDataSourceAddHandler
                                }
                                userDataSourceDeleteHandler={
                                    this.userDataSourceDeleteHandler
                                }
                                reloadWebMonitors={this.reloadWebMonitors}
                                loadUserDataSources={this.loadUserDataSources}
                                updateGAPropertyId={(value) => {
                                    this.setState({
                                        ga_property_id: value,
                                    });
                                }}
                            />
                        ) : this.state.dsKey ===
                          "is_ds_google_alerts_enabled" ? (
                            <NewsAlerts
                                {...this.state}
                                {...this.props}
                                updateUserAnnotationColors={
                                    this.updateUserAnnotationColors
                                }
                                serviceStatusHandler={this.serviceStatusHandler}
                                changeShownHint={this.changeShownHint}
                                sectionToggler={this.sectionToggler}
                                userDataSourceAddHandler={
                                    this.userDataSourceAddHandler
                                }
                                userDataSourceDeleteHandler={
                                    this.userDataSourceDeleteHandler
                                }
                                reloadWebMonitors={this.reloadWebMonitors}
                                loadUserDataSources={this.loadUserDataSources}
                                updateGAPropertyId={(value) => {
                                    this.setState({
                                        ga_property_id: value,
                                    });
                                }}
                            />
                        ) : this.state.dsKey ===
                          "is_ds_google_algorithm_updates_enabled" ? (
                            <GoogleUpdates
                                {...this.state}
                                {...this.props}
                                updateUserAnnotationColors={
                                    this.updateUserAnnotationColors
                                }
                                serviceStatusHandler={this.serviceStatusHandler}
                                changeShownHint={this.changeShownHint}
                                sectionToggler={this.sectionToggler}
                                userDataSourceAddHandler={
                                    this.userDataSourceAddHandler
                                }
                                userDataSourceDeleteHandler={
                                    this.userDataSourceDeleteHandler
                                }
                                reloadWebMonitors={this.reloadWebMonitors}
                                loadUserDataSources={this.loadUserDataSources}
                                updateGAPropertyId={(value) => {
                                    this.setState({
                                        ga_property_id: value,
                                    });
                                }}
                            />
                        ) : this.state.dsKey ===
                          "is_ds_retail_marketing_enabled" ? (
                            <RetailMarketingDates
                                {...this.state}
                                {...this.props}
                                updateUserAnnotationColors={
                                    this.updateUserAnnotationColors
                                }
                                serviceStatusHandler={this.serviceStatusHandler}
                                changeShownHint={this.changeShownHint}
                                sectionToggler={this.sectionToggler}
                                userDataSourceAddHandler={
                                    this.userDataSourceAddHandler
                                }
                                userDataSourceDeleteHandler={
                                    this.userDataSourceDeleteHandler
                                }
                                reloadWebMonitors={this.reloadWebMonitors}
                                loadUserDataSources={this.loadUserDataSources}
                                updateGAPropertyId={(value) => {
                                    this.setState({
                                        ga_property_id: value,
                                    });
                                }}
                            />
                        ) : this.state.dsKey === "is_ds_holidays_enabled" ? (
                            <Holidays
                                {...this.state}
                                {...this.props}
                                updateUserAnnotationColors={
                                    this.updateUserAnnotationColors
                                }
                                serviceStatusHandler={this.serviceStatusHandler}
                                changeShownHint={this.changeShownHint}
                                sectionToggler={this.sectionToggler}
                                userDataSourceAddHandler={
                                    this.userDataSourceAddHandler
                                }
                                userDataSourceDeleteHandler={
                                    this.userDataSourceDeleteHandler
                                }
                                reloadWebMonitors={this.reloadWebMonitors}
                                loadUserDataSources={this.loadUserDataSources}
                                updateGAPropertyId={(value) => {
                                    this.setState({
                                        ga_property_id: value,
                                    });
                                }}
                            />
                        ) : null}
                    </AppsModal>
                </Container>
            </div>
        );
    }

    checkUserFacebookAccount() {
        // userFacebookAccountsExists
        this.setState({ isBusy: true });
        HttpClient.get("/data-source/user-facebook-accounts-exists", {})
            .then(
                (resp) => {
                    if (resp.data.exists) {
                        this.setState({
                            isBusy: false,
                            errors: undefined,
                            userFacebookAccountsExists: true,
                        });
                    }
                },
                (err) => {
                    this.setState({ isBusy: false, errors: err.response.data });
                    status = false;
                },
                this
            )
            .catch((err) => {
                this.setState({ isBusy: false, errors: err });
                status = false;
            });

        // userInstagramAccountsExists
        this.setState({ isBusy: true });
        HttpClient.get("/data-source/user-instagram-accounts-exists", {})
            .then(
                (resp) => {
                    if (resp.data.exists) {
                        this.setState({
                            isBusy: false,
                            errors: undefined,
                            userInstagramAccountsExists: true,
                        });
                    }
                },
                (err) => {
                    this.setState({ isBusy: false, errors: err.response.data });
                    status = false;
                },
                this
            )
            .catch((err) => {
                this.setState({ isBusy: false, errors: err });
                status = false;
            });
    }

    checkUserBitbucketAccount() {
        // userBitbucketAccountsExists
        this.setState({ isBusy: true });
        HttpClient.get("/data-source/user-bitbucket-accounts-exists", {})
            .then(
                (resp) => {
                    if (resp.data.exists) {
                        this.setState({
                            isBusy: false,
                            errors: undefined,
                            userBitbucketAccountsExists: true,
                        });
                    } else if (resp.data.error) {
                        toast.error("BitBucket Error: " + resp.data.error);
                        this.sectionToggler(null);
                        this.updateUserService({
                            target: {
                                name: "is_ds_bitbucket_tracking_enabled",
                                checked: 0,
                            },
                        });
                    }
                },
                (err) => {
                    this.setState({ isBusy: false, errors: err.response.data });
                    status = false;
                },
                this
            )
            .catch((err) => {
                this.setState({ isBusy: false, errors: err });
                status = false;
            });
    }

    checkUserGithubAccount() {
        // userGithubAccountsExists
        this.setState({ isBusy: true });
        HttpClient.get("/data-source/user-github-accounts-exists", {})
            .then(
                (resp) => {
                    if (resp.data.exists) {
                        this.setState({
                            isBusy: false,
                            errors: undefined,
                            userGithubAccountsExists: true,
                        });
                    } else if (resp.data.error) {
                        toast.error("Github Error: " + resp.data.error);
                        this.sectionToggler(null);
                        this.updateUserService({
                            target: {
                                name: "is_ds_github_tracking_enabled",
                                checked: 0,
                            },
                        });
                    }
                },
                (err) => {
                    this.setState({ isBusy: false, errors: err.response.data });
                    status = false;
                },
                this
            )
            .catch((err) => {
                this.setState({ isBusy: false, errors: err });
                status = false;
            });
    }

    updateUserService(e) {
        HttpClient.post("/userService", {
            [e.target.name]: e.target.checked ? 1 : 0,
        })
            .then(
                (resp) => {
                    switch (e.target.name) {
                        case "is_ds_twitter_tracking_enabled":
                            if (resp.data.twitter_accounts > 0) {
                                this.setState({
                                    userServices: resp.data.user_services,
                                });
                                if (
                                    resp.data.user_services[e.target.name] == 1
                                ) {
                                    toast.success(
                                        "Service activated successfully."
                                    );
                                }
                                if (
                                    resp.data.user_services[e.target.name] == 0
                                ) {
                                    toast.info(
                                        "Service deactivated successfully."
                                    );
                                }
                            } else {
                                swal.fire({
                                    iconHtml:
                                        '<img src="/images/svg/twitter.svg">',
                                    showCloseButton: true,
                                    title: "Connect with Twitter",
                                    text: "Connect your Twitter account to create automatic annotations",
                                    confirmButtonClass:
                                        "rounded-pill btn btn-primary bg-primary px-4 font-weight-bold",
                                    confirmButtonText:
                                        "<a href='/socialite/twitter' class='text-white'><i class='mr-2 fa fa-twitter'> </i>" +
                                        "Connect twitter Account</a>",
                                });
                            }
                            break;

                        default:
                            if (resp.data.user_services[e.target.name] == 1) {
                                toast.success(
                                    "Service activated successfully."
                                );
                            }
                            if (resp.data.user_services[e.target.name] == 0) {
                                toast.info("Service deactivated successfully.");
                            }
                            this.setState({
                                userServices: resp.data.user_services,
                            });
                            break;
                    }

                    this.props.reloadUser();
                },
                (err) => {
                    this.setState({ isBusy: false, errors: err.response.data });
                    if (err.response.status == 402) {
                        swal.fire(
                            "Upgrade to Pro Plan!",
                            "You have reached your Free 100 credits.",
                            "warning"
                        ).then((value) => {
                            this.setState({
                                redirectTo: "/settings/price-plans",
                            });
                        });
                    }
                }
            )
            .catch((err) => {
                this.setState({ isBusy: false, errors: err });
            });
    }

    serviceStatusHandler(e) {
        if (this.props.user.price_plan.has_data_sources) {
            e.persist();
            if (e.target.name == "is_ds_holidays_enabled" && e.target.checked) {
                this.sectionToggler("holidays");
                this.updateUserService(e);
            } else if (
                e.target.name == "is_ds_holidays_enabled" &&
                !e.target.checked
            ) {
                this.sectionToggler(null);
                this.updateUserService(e);
            }
            if (
                e.target.name == "is_ds_retail_marketing_enabled" &&
                e.target.checked
            ) {
                this.sectionToggler("retail_marketings");
                this.updateUserService(e);
            } else if (
                e.target.name == "is_ds_retail_marketing_enabled" &&
                !e.target.checked
            ) {
                this.sectionToggler(null);
                this.updateUserService(e);
            }
            if (
                e.target.name == "is_ds_weather_alerts_enabled" &&
                e.target.checked
            ) {
                this.sectionToggler("weather_alerts");
                this.updateUserService(e);
            } else if (
                e.target.name == "is_ds_weather_alerts_enabled" &&
                !e.target.checked
            ) {
                this.sectionToggler(null);
                this.updateUserService(e);
            }
            if (
                e.target.name == "is_ds_google_alerts_enabled" &&
                e.target.checked
            ) {
                this.sectionToggler("google_alerts");
                this.updateUserService(e);
            } else if (
                e.target.name == "is_ds_google_alerts_enabled" &&
                !e.target.checked
            ) {
                this.sectionToggler(null);
                this.updateUserService(e);
            }
            if (
                e.target.name == "is_ds_web_monitors_enabled" &&
                e.target.checked
            ) {
                this.sectionToggler("web_monitors");
                this.updateUserService(e);
            } else if (
                e.target.name == "is_ds_web_monitors_enabled" &&
                !e.target.checked
            ) {
                this.sectionToggler(null);
                this.updateUserService(e);
            }
            if (
                e.target.name == "is_ds_wordpress_updates_enabled" &&
                e.target.checked
            ) {
                this.sectionToggler(null);
                this.updateUserService(e);
            } else if (
                e.target.name == "is_ds_wordpress_updates_enabled" &&
                !e.target.checked
            ) {
                this.sectionToggler(null);
                this.updateUserService(e);
            }
            if (
                e.target.name == "is_ds_google_algorithm_updates_enabled" &&
                e.target.checked
            ) {
                this.sectionToggler("google_algorithm_updates");
                this.updateUserService(e);
            } else if (
                e.target.name == "is_ds_google_algorithm_updates_enabled" &&
                !e.target.checked
            ) {
                this.sectionToggler(null);
                this.updateUserService(e);
            }
            if (
                e.target.name == "is_ds_keyword_tracking_enabled" &&
                e.target.checked
            ) {
                this.sectionToggler("keyword_tracking");
                this.updateUserService(e);
            } else if (
                e.target.name == "is_ds_keyword_tracking_enabled" &&
                !e.target.checked
            ) {
                this.sectionToggler(null);
                this.updateUserService(e);
            }

            if (
                e.target.name == "is_ds_apple_podcast_annotation_enabled" &&
                e.target.checked
            ) {
                this.sectionToggler("apple_podcast");
                this.updateUserService(e);
            } else if (
                e.target.name == "is_ds_apple_podcast_annotation_enabled" &&
                !e.target.checked
            ) {
                this.sectionToggler(null);
                this.updateUserService(e);
            }
            if (
                e.target.name == "is_ds_instagram_tracking_enabled" &&
                e.target.checked
            ) {
                if (this.state.userInstagramAccountsExists) {
                    this.sectionToggler("instagram_tracking");
                    this.updateUserService(e, this);
                } else {
                    swal.fire({
                        customClass: {
                            htmlContainer: "py-3",
                        },
                        showCloseButton: true,
                        title: "Connect with Instagram",
                        text: "Connect your Instagram account to create automatic annotations for new posts; when you reach a post goal or run campaigns..",
                        confirmButtonClass:
                            "rounded-pill btn btn-primary bg-primary px-4 font-weight-bold",
                        confirmButtonText:
                            "<a href='/socialite/facebook' class='text-white'><i class='mr-2 fa fa-instagram'> </i>" +
                            "Connect Instagram Account</a>",
                    });
                }
            } else if (
                e.target.name == "is_ds_instagram_tracking_enabled" &&
                !e.target.checked
            ) {
                this.sectionToggler(null);
                this.updateUserService(e);
            }
            if (
                e.target.name == "is_ds_facebook_tracking_enabled" &&
                e.target.checked
            ) {
                if (this.state.userFacebookAccountsExists) {
                    this.sectionToggler("facebook_tracking");
                    this.updateUserService(e, this);
                } else {
                    swal.fire({
                        customClass: {
                            htmlContainer: "py-3",
                        },
                        showCloseButton: true,
                        title: "Connect with Facebook",
                        text: "Connect your Facebook account to create automatic annotations for new posts; when you reach a post goal or run campaigns..",
                        confirmButtonClass:
                            "rounded-pill btn btn-primary bg-primary px-4 font-weight-bold",
                        confirmButtonText:
                            "<a href='/socialite/facebook' class='text-white'><i class='mr-2 fa fa-facebook'> </i>" +
                            "Connect Facebook Account</a>",
                    });
                }
            } else if (
                e.target.name == "is_ds_facebook_tracking_enabled" &&
                !e.target.checked
            ) {
                this.sectionToggler(null);
                this.updateUserService(e);
            }

            if (
                e.target.name == "is_ds_bitbucket_tracking_enabled" &&
                e.target.checked
            ) {
                if (this.state.userBitbucketAccountsExists) {
                    this.sectionToggler("bitbucket_tracking");
                    this.updateUserService(e, this);
                } else {
                    swal.fire({
                        customClass: {
                            htmlContainer: "py-3",
                        },
                        showCloseButton: true,
                        title: "Connect with Bitbucket",
                        text: "Connect your Bitbucket account to create automatic annotations for commits",
                        confirmButtonClass:
                            "rounded-pill btn btn-primary bg-primary px-4 font-weight-bold",
                        confirmButtonText:
                            "<a href='/socialite/bitbucket' class='text-white'><i class='mr-2 fa fa-bitbucket'> </i>" +
                            "Connect Bitbucket Account</a>",
                    });
                }
            } else if (
                e.target.name == "is_ds_bitbucket_tracking_enabled" &&
                !e.target.checked
            ) {
                this.sectionToggler(null);
                this.updateUserService(e);
            }

            if (
                e.target.name == "is_ds_github_tracking_enabled" &&
                e.target.checked
            ) {
                if (this.state.userGithubAccountsExists) {
                    this.sectionToggler("github_tracking");
                    this.updateUserService(e, this);
                } else {
                    swal.fire({
                        customClass: {
                            htmlContainer: "py-3",
                        },
                        showCloseButton: true,
                        title: "Connect with Github",
                        text: "Connect your github account to create automatic annotations for commits",
                        confirmButtonClass:
                            "rounded-pill btn btn-primary bg-primary px-4 font-weight-bold",
                        confirmButtonText:
                            "<a href='/socialite/github' class='text-white'><i class='mr-2 fa fa-github'> </i>" +
                            "Connect Github Account</a>",
                    });
                }
            } else if (
                e.target.name == "is_ds_github_tracking_enabled" &&
                !e.target.checked
            ) {
                this.sectionToggler(null);
                this.updateUserService(e);
            }

            if (e.target.name == "is_ds_twitter_tracking_enabled") {
                this.updateUserService(e);
                this.sectionToggler(
                    e.target.checked ? "twitter_tracking" : null
                );
            }
        } else {
            const accountNotLinkedHtml =
                "" +
                '<div class="">' +
                '<img src="/images/automation-upgrade-modal.jpg" class="img-fluid">' +
                "</div>";

            swal.fire({
                html: accountNotLinkedHtml,
                width: 700,
                customClass: {
                    popup: "bg-light-red",
                    htmlContainer: "m-0",
                },
                confirmButtonClass:
                    "rounded-pill btn btn-primary bg-primary px-4 font-weight-bold",
                confirmButtonText:
                    "Upgrade Now" + "<i class='ml-2 fa fa-caret-right'> </i>",
            }).then((value) => {
                this.setState({ redirectTo: "/settings/price-plans" });
            });
        }
    }

    userDataSourceAddHandler(dataSource) {
        this.setState({ isBusy: true });
        let formData = {
            ds_code: dataSource.code,
            ds_name: dataSource.name,
            country_name: dataSource.country_name,
            retail_marketing_id: dataSource.retail_marketing_id,
            open_weather_map_city_id: dataSource.open_weather_map_city_id,
            open_weather_map_event: dataSource.open_weather_map_event,
            status: dataSource.status,
            value: dataSource.value,
            is_enabled: 1,
            ga_property_id: this.state.ga_property_id,
            workspace: dataSource.workspace,
        };
        HttpClient.post("/data-source/user-data-source", formData)
            .then(
                (resp) => {
                    let uds = resp.data.user_data_source;
                    let ar = this.state.userDataSources[uds.ds_code];
                    if (uds.ds_code == "google_algorithm_update_dates") {
                        ar = [uds];
                    } else {
                        ar.push(uds);
                    }

                    if (
                        dataSource.code == "bitbucket_tracking" ||
                        dataSource.code == "github_tracking"
                    )
                        toast.success("Repository Connected.");
                    this.setState({
                        userDataSources: {
                            ...this.state.userDataSources,
                            [uds.ds_code]: ar,
                        },
                        isBusy: false,
                        errors: undefined,
                    });
                },
                (err) => {
                    this.setState({ isBusy: false, errors: err.response.data });

                    if (err.response.status === 422) {
                        let imgSrc = "/images/api-upgrade-modal.jpg";
                        switch (dataSource.code) {
                            case "bitbucket_tracking":
                            case "github_tracking":
                                imgSrc = "/images/banners/Repositories-01.svg";
                                break;

                            default:
                                imgSrc = "/images/api-upgrade-modal.jpg";
                                break;
                        }
                        const accountNotLinkedHtml =
                            "" +
                            '<div class="">' +
                            '<img src="' +
                            imgSrc +
                            '" class="img-fluid">' +
                            "</div>";

                        swal.fire({
                            html: accountNotLinkedHtml,
                            width: 700,
                            customClass: {
                                popup: "bg-light-red",
                                htmlContainer: "m-0",
                            },
                            confirmButtonClass:
                                "rounded-pill btn btn-primary bg-primary px-4 font-weight-bold",
                            confirmButtonText:
                                "Upgrade Now" +
                                "<i class='ml-2 fa fa-caret-right'> </i>",
                        }).then((value) => {
                            this.setState({
                                redirectTo: "/settings/price-plans",
                            });
                        });
                    }
                }
            )
            .catch((err) => {
                this.setState({ isBusy: false, errors: err });
            });
    }

    userDataSourceDeleteHandler(userDataSourceId, dsCode) {
        this.setState({ isBusy: true });
        HttpClient.delete(`/data-source/user-data-source/${userDataSourceId}`)
            .then(
                (resp) => {
                    let ar = this.state.userDataSources[dsCode];
                    let newAr = ar.filter((a) => a.id != userDataSourceId);
                    if (
                        dsCode == "bitbucket_tracking" ||
                        dsCode == "github_tracking"
                    )
                        toast.info("Repository Disconnected.");
                    this.setState({
                        userDataSources: {
                            ...this.state.userDataSources,
                            [dsCode]: newAr,
                        },
                        isBusy: false,
                        errors: undefined,
                    });
                },
                (err) => {
                    this.setState({ isBusy: false, errors: err.response.data });
                }
            )
            .catch((err) => {
                this.setState({ isBusy: false, errors: err });
            });
    }

    changeShownHint(obj) {
        this.setState({ showHintFor: obj });
    }

    sectionToggler(sectionName) {
        if (null == sectionName) {
            this.setState({ sectionName: null });
        } else if (this.state.sectionName == sectionName) {
            this.setState({ sectionName: null });
            window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
            this.setState({ sectionName: sectionName });
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    }
}

export default AppsMarket;
