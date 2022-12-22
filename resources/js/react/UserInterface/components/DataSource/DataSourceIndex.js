import React from 'react';
import { toast } from "react-toastify";
import { Redirect } from "react-router-dom";
import { UncontrolledPopover, PopoverHeader, PopoverBody } from 'reactstrap';
import LoaderAnimation from "../../utils/LoaderAnimation";
import Countries from "../../utils/Countries";
import HttpClient from "../../utils/HttpClient";
import DSRMDatesSelect from '../../utils/DSRMDatesSelect';
import DSOWMCitiesSelect from '../../utils/DSOWMCitiesSelect';
import DSOWMEventsSelect from '../../utils/DSOWMEventsSelect';
import DSGAUDatesSelect from '../../utils/DSGAUDatesSelect';
import DSGoogleAlertsSelect from '../../utils/DSGoogleAlertsSelect';
import DSWebMonitorsSelect from '../../utils/DSWebMonitorsSelect';
import GoogleAnalyticsPropertySelect from '../../utils/GoogleAnalyticsPropertySelect';
import AddKeyword from '../../utils/AddKeyword';
import ManageKeywords from '../../utils/ManageKeywords';
import UserAnnotationColorPicker from '../../helpers/UserAnnotationColorPickerComponent';
import ErrorAlert from '../../utils/ErrorAlert';
import DataSourceInterfaceTour from '../../helpers/DataSourceInterfaceTour';
import { getCompanyName } from '../../helpers/CommonFunctions';
import EditKeyword from '../../utils/EditKeyword';
import GoogleAdChanges from "../../utils/GoogleAdChanges";
import FacebookTracking from "../../utils/FacebookTracking";
import TwitterTracking from "../../utils/TwitterTracking";
import InstagramTracking from "../../utils/InstagramTracking";
import BitbucketTracking from "../../utils/BitbucketTracking";
import GithubTracking from "../../utils/GithubTracking";
import ApplePodcast, { ApplePodcastConfig } from "../../utils/ApplePodcast";

export default class DataSourceIndex extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sectionName: null,
            userDataSources: {},
            userAnnotationColors: {},
            userServices: this.props.user,
            isBusy: false,
            isLoading: false,
            errors: '',
            redirectTo: null,
            showHintFor: null,
            ga_property_id: '',
            webMonitors: [],
            manage_keyword_show: false,
            dfsKeywords: [],
            totalDfsKeywordCreditsUsed: 0,
            editKeyword: false,
            editKeyword_keyword_id: '',
            editKeyword_keyword_configuration_id: '',
            userFacebookAccountsExists: false,
            userInstagramAccountsExists: false,
            userBitbucketAccountsExists: false,
            userGithubAccountsExists: false
        }
        this.userDataSourceAddHandler = this.userDataSourceAddHandler.bind(this)
        this.userDataSourceDeleteHandler = this.userDataSourceDeleteHandler.bind(this)
        this.serviceStatusHandler = this.serviceStatusHandler.bind(this);

        this.loadUserDataSources = this.loadUserDataSources.bind(this);

        this.updateUserAnnotationColors = this.updateUserAnnotationColors.bind(this);
        this.loadUserAnnotationColors = this.loadUserAnnotationColors.bind(this);

        this.sectionToggler = this.sectionToggler.bind(this);

        this.reloadWebMonitors = this.reloadWebMonitors.bind(this);

        this.manage_keyword_popup_handler = this.manage_keyword_popup_handler.bind(this);

        this.keywordAddHandler = this.keywordAddHandler.bind(this);
        this.loadKeywordTrackingKeywords = this.loadKeywordTrackingKeywords.bind(this);

        this.editKeywordToggler = this.editKeywordToggler.bind(this);
        this.checkUserFacebookAccount = this.checkUserFacebookAccount.bind(this);
        this.checkUserBitbucketAccount = this.checkUserBitbucketAccount.bind(this);
        this.checkUserGithubAccount = this.checkUserGithubAccount.bind(this);
        this.updateUserService = this.updateUserService.bind(this);


    }

    componentDidMount() {
        document.title = 'Automation';
        this.loadUserDataSources('');
        this.loadUserAnnotationColors();
        this.reloadWebMonitors('');

        this.loadKeywordTrackingKeywords();

        this.checkUserFacebookAccount();
        this.checkUserBitbucketAccount();
        this.checkUserGithubAccount();

        let alertMessage = new URLSearchParams(window.location.search).get("alertMessage");
        if(alertMessage){
            swal.fire({
                iconHtml: '<img src="/images/svg/twitter.svg">',
                title: 'Connected',
                html: alertMessage,
            });
        }
    }

    loadUserDataSources(gaPropertyId) {
        if (!this.state.isLoading) {
            this.setState({ isLoading: true });
            HttpClient.get(`/data-source/user-data-source?ga_property_id=${gaPropertyId}`).then(resp => {
                this.setState({ isLoading: false, userDataSources: resp.data.user_data_sources });
            }, (err) => {
                this.setState({ isLoading: false, errors: (err.response).data });
            }).catch(err => {
                this.setState({ isLoading: false, errors: err });
            })
        }
    }

    loadKeywordTrackingKeywords() {
        this.setState({ isBusy: true, errors: '' });
        HttpClient.get(`/data-source/get-keyword-tracking-keywords`).then(resp => {
            this.setState({
                isLoading: false,
                dfsKeywords: resp.data.keywords ? resp.data.keywords : [],
            });
            let total = 0;
            this.state.dfsKeywords.map(function (keyword_instance, index) {
                keyword_instance.configurations.map(function (configuration_instance) {
                    total++;
                });
            });
            this.setState({
                totalDfsKeywordCreditsUsed: total,
            });
        }, (err) => {
            this.setState({ isLoading: false, errors: (err.response).data });
        }).catch(err => {
            this.setState({ isLoading: false, errors: err });
        })
    }

    loadUserAnnotationColors() {
        if (!this.state.isLoading) {
            this.setState({ isLoading: true });
            HttpClient.get(`/data-source/user-annotation-color`).then(resp => {
                this.setState({ isLoading: false, userAnnotationColors: resp.data.user_annotation_color });
            }, (err) => {
                this.setState({ isLoading: false, errors: (err.response).data });
            }).catch(err => {
                this.setState({ isLoading: false, errors: err });
            })
        }
    }

    updateUserAnnotationColors(userAnnotationColors) {
        this.setState({ userAnnotationColors: userAnnotationColors });
    }

    reloadWebMonitors(gaPropertyId) {
        HttpClient.get(`/data-source/web-monitor?ga_property_id=${gaPropertyId}`).then(resp => {
            this.setState({ webMonitors: resp.data.web_monitors, isBusy: false })
        }, (err) => {
            this.setState({ isBusy: false });
        }).catch(err => {
            this.setState({ isBusy: false });
        })
    }

    manage_keyword_popup_handler() {
        this.setState({
            manage_keyword_show: false,
        })
    }

    keywordAddHandler() {
        // reload the component
        this.sectionToggler('keyword_tracking')
        this.loadKeywordTrackingKeywords();

    }

    editKeywordToggler(keyword_id, keyword_configuration_id) {
        // close popup
        this.manage_keyword_popup_handler()

        // show edit form
        this.setState({
            editKeyword_keyword_id: keyword_id,
            editKeyword_keyword_configuration_id: keyword_configuration_id
        });

        this.setState({
            editKeyword: true
        });

        this.sectionToggler('edit_keyword')
    }

    render() {
        if (this.state.redirectTo) return <Redirect to={this.state.redirectTo} />

        return (
            <div className="container bg-white d-flex flex-column justify-content-center">
                {/* <DataSourceInterfaceTour isOpen={this.props.showDataSourceTour}
                    toggleShowTour={this.props.toggleDataSourceTour} userId={this.props.user.id} /> */}
                <LoaderAnimation show={this.state.isLoading} />
                <div className="row ml-0 mr-0">
                    <div className="col-4">
                        <h2 className="heading-section gaa-title">
                            Set Automations for:
                        </h2>
                        <GoogleAnalyticsPropertySelect
                            name="ga_property_id"
                            id="ga_property_id"
                            currentPricePlan={this.props.user.price_plan}
                            value={this.state.ga_property_id}
                            onChangeCallback={(gAP) => {
                                if (gAP.target.value == "") {
                                    this.setState({ ga_property_id: null });
                                    this.loadUserDataSources(null);
                                    this.reloadWebMonitors(null);
                                } else {
                                    this.setState({
                                        ga_property_id: gAP.target.value,
                                    });
                                    this.loadUserDataSources(gAP.target.value);
                                    this.reloadWebMonitors(gAP.target.value);
                                }
                            }}
                            components={{
                                DropdownIndicator: () => null,
                                IndicatorSeparator: () => null,
                            }}
                            placeholder="Select GA Properties"
                            isClearable={true}
                        />
                    </div>
                    <div className="col-3"></div>
                </div>
                {/* <ErrorAlert errors={this.state.errors} /> */}
                <div className="row p-2 mt-4 mb-5">
                    <div
                        className="col-md-9 col-sm-12"
                        id="data-source-page-container"
                    >
                        <div className="row">
                            {/*
                                Website Monitoring Section
                            */}
                            <div className="col-md-6 mt-2">
                                <div
                                    className="d-flex border rounded flex-column justify-content-between"
                                    style={{ minHeight: "180px" }}
                                >
                                    <div>
                                        <div
                                            className="d-flex mt-2 justify-content-between"
                                            id="web-monitoring-data-source-section"
                                        >
                                            <div className="px-2">
                                                <h2>
                                                    <small>
                                                        Website Monitoring{" "}
                                                        <UserAnnotationColorPicker
                                                            name="web_monitors"
                                                            value={
                                                                this.state
                                                                    .userAnnotationColors
                                                                    .web_monitors
                                                            }
                                                            updateCallback={
                                                                this
                                                                    .updateUserAnnotationColors
                                                            }
                                                        />
                                                        <img
                                                            id="web-monitors-datasource-hint"
                                                            className="hint-button-2"
                                                            onClick={() => {
                                                                this.changeShownHint(
                                                                    "web-monitors"
                                                                );
                                                            }}
                                                            src="/images/info-logo.png"
                                                        />
                                                    </small>
                                                </h2>
                                                <UncontrolledPopover
                                                    trigger="legacy"
                                                    placement="right"
                                                    isOpen={
                                                        this.state
                                                            .showHintFor ==
                                                        "web-monitors"
                                                    }
                                                    target="web-monitors-datasource-hint"
                                                    toggle={() => {
                                                        this.changeShownHint(
                                                            null
                                                        );
                                                    }}
                                                >
                                                    <PopoverHeader>
                                                        Web Monitoring
                                                    </PopoverHeader>
                                                    <PopoverBody>
                                                        Downtime happens even to
                                                        the best of us. But it’s
                                                        important to know it
                                                        before customers are
                                                        affected and also keep
                                                        annotations on your
                                                        reports. Add your
                                                        website URL; we will
                                                        monitor it every 1
                                                        minute.
                                                    </PopoverBody>
                                                </UncontrolledPopover>
                                            </div>
                                            <div className="px-2 text-center">
                                                {this.state.userServices
                                                    .is_ds_web_monitors_enabled
                                                    ? "ON"
                                                    : "OFF"}
                                                <label className="trigger switch">
                                                    <input
                                                        type="checkbox"
                                                        name="is_ds_web_monitors_enabled"
                                                        onChange={
                                                            this
                                                                .serviceStatusHandler
                                                        }
                                                        checked={
                                                            this.state
                                                                .userServices
                                                                .is_ds_web_monitors_enabled
                                                        }
                                                    />
                                                    <span
                                                        className={`slider round ${this.state
                                                            .userServices
                                                            .is_ds_web_monitors_enabled
                                                            ? "animate-pulse"
                                                            : ""
                                                            }`}
                                                    />
                                                </label>
                                            </div>
                                        </div>
                                        {this.state.webMonitors ? (
                                            <div className="px-2">
                                                <div className="list-wrapper">
                                                    <p
                                                        style={{
                                                            fontSize: "13px",
                                                        }}
                                                    >
                                                        Credits:{" "}
                                                        {
                                                            this.state
                                                                .webMonitors
                                                                .length
                                                        }
                                                        /
                                                        {
                                                            this.props.user
                                                                .price_plan
                                                                .web_monitor_count > 0 ?
                                                            this.props.user
                                                                .price_plan
                                                                .web_monitor_count : 0
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        ) : null}
                                        <div className="px-2">
                                            <div className="list-wrapper">
                                                <p style={{ fontSize: "13px" }}>
                                                    { this.state.webMonitors.length > 0 ? "Keywords:" : ""}
                                                </p>
                                                {this.state.webMonitors
                                                    .map((wM) => wM.name)
                                                    .join(", ")}
                                            </div>
                                        </div>
                                    </div>

                                    <p
                                        className="ds-update-text m-0 pb-3 px-2 text-right"
                                        style={{ fontSize: "13px" }}
                                        onClick={() => {
                                            this.sectionToggler("web_monitors");
                                        }}
                                    >
                                        {this.state.sectionName ==
                                            "web_monitors"
                                            ? "Hide"
                                            : "Configure Monitors"}
                                    </p>
                                </div>
                            </div>

                            {/*
                                News Alert Section
                            */}

                            <div className="col-md-6 mt-2">
                                <div
                                    className="d-flex border rounded flex-column justify-content-between"
                                    style={{ minHeight: "180px" }}
                                >
                                    <div>
                                        <div
                                            className="d-flex mt-2 justify-content-between "
                                            id="web-monitoring-data-source-section"
                                        >
                                            <div className="px-2">
                                                <h2>
                                                    <small>
                                                        News Alerts{" "}
                                                        <UserAnnotationColorPicker
                                                            name="google_alerts"
                                                            value={
                                                                this.state
                                                                    .userAnnotationColors
                                                                    .google_alerts
                                                            }
                                                            updateCallback={
                                                                this
                                                                    .updateUserAnnotationColors
                                                            }
                                                        />
                                                        <img
                                                            id="google-alert-datasource-hint"
                                                            className="hint-button-2"
                                                            onClick={() => {
                                                                this.changeShownHint(
                                                                    "google-alert"
                                                                );
                                                            }}
                                                            src="/images/info-logo.png"
                                                        />
                                                    </small>
                                                </h2>
                                                <UncontrolledPopover
                                                    trigger="legacy"
                                                    placement="right"
                                                    isOpen={
                                                        this.state
                                                            .showHintFor ==
                                                        "google-alert"
                                                    }
                                                    target="google-alert-datasource-hint"
                                                    toggle={() => {
                                                        this.changeShownHint(
                                                            null
                                                        );
                                                    }}
                                                >
                                                    <PopoverHeader>
                                                        News Alerts
                                                    </PopoverHeader>
                                                    <PopoverBody>
                                                        <strong>
                                                            News Alerts
                                                        </strong>{" "}
                                                        Is a content change
                                                        detection on the web.{" "}
                                                        {getCompanyName()} add
                                                        annotations that match
                                                        the user's search terms,
                                                        such as web pages,
                                                        newspaper articles,
                                                        blogs, or scientific
                                                        research. Add keywords
                                                        like
                                                        https://www.your-domain.com/,
                                                        Company Name. The system
                                                        will search for news
                                                        once a day at midnight.
                                                        Annotations for News
                                                        Alerts will start
                                                        showing after 48 hours
                                                        the automation is
                                                        activated.
                                                    </PopoverBody>
                                                </UncontrolledPopover>
                                            </div>
                                            <div className="px-2 text-center">
                                                {this.state.userServices
                                                    .is_ds_google_alerts_enabled
                                                    ? "ON"
                                                    : "OFF"}
                                                <label className="trigger switch">
                                                    <input
                                                        type="checkbox"
                                                        name="is_ds_google_alerts_enabled"
                                                        onChange={
                                                            this
                                                                .serviceStatusHandler
                                                        }
                                                        checked={
                                                            this.state
                                                                .userServices
                                                                .is_ds_google_alerts_enabled
                                                        }
                                                    />
                                                    <span
                                                        className={`slider round ${this.state
                                                            .userServices
                                                            .is_ds_google_alerts_enabled
                                                            ? "animate-pulse"
                                                            : ""
                                                            }`}
                                                    />
                                                </label>
                                            </div>
                                        </div>
                                        {this.state.userDataSources
                                            .google_alert_keywords ? (
                                            <div className="px-2">
                                                <div className="list-wrapper">
                                                    <p
                                                        style={{
                                                            fontSize: "13px",
                                                        }}
                                                    >
                                                        Credits:{" "}
                                                        {
                                                            this.state
                                                                .userDataSources
                                                                .google_alert_keywords
                                                                .length
                                                        }
                                                        /
                                                        {
                                                            this.props.user
                                                                .price_plan
                                                                .google_alert_keyword_count > 0 ?
                                                            this.props.user
                                                                .price_plan
                                                                .google_alert_keyword_count : 0
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        ) : null}
                                        <div className="px-2">
                                            <div className="list-wrapper">
                                                {this.state.userDataSources
                                                    .google_alert_keywords ? (
                                                    <div>
                                                        <p
                                                            style={{
                                                                fontSize:
                                                                    "13px",
                                                            }}
                                                        >
                                                            Keywords:
                                                        </p>
                                                        <dl className="d-flex flex-row flex-wrap data-source-select-options">
                                                            {this.state
                                                                .userDataSources
                                                                .google_alert_keywords ? (
                                                                this.state.userDataSources.google_alert_keywords
                                                                    .map(
                                                                        (
                                                                            keyword
                                                                        ) =>
                                                                            keyword.value
                                                                    )
                                                                    .join(", ")
                                                            ) : (
                                                                <dd>
                                                                    no keyword
                                                                    added&nbsp;
                                                                </dd>
                                                            )}
                                                        </dl>
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>

                                    <p
                                        className="ds-update-text m-0 pb-3 px-2 text-right"
                                        onClick={() => {
                                            this.sectionToggler(
                                                "google_alerts"
                                            );
                                        }}
                                    >
                                        {this.state.sectionName ==
                                            "google_alerts"
                                            ? "Hide"
                                            : "Choose Keywords"}
                                    </p>
                                </div>
                            </div>

                            {/*
                                Google Updates Section
                            */}

                            <div className="col-md-6 mt-2">
                                <div
                                    className="d-flex border rounded flex-column justify-content-between"
                                    style={{ minHeight: "180px" }}
                                >
                                    <div>
                                        <div
                                            className="d-flex mt-2 justify-content-between "
                                            id="web-monitoring-data-source-section"
                                        >
                                            <div className="px-2">
                                                <h2>
                                                    <small>
                                                        Google Updates{" "}
                                                        <UserAnnotationColorPicker
                                                            name="google_algorithm_updates"
                                                            value={
                                                                this.state
                                                                    .userAnnotationColors
                                                                    .google_algorithm_updates
                                                            }
                                                            updateCallback={
                                                                this
                                                                    .updateUserAnnotationColors
                                                            }
                                                        />
                                                        <img
                                                            id="google-updates-datasource-hint"
                                                            className="hint-button-2"
                                                            onClick={() => {
                                                                this.changeShownHint(
                                                                    "google-updates"
                                                                );
                                                            }}
                                                            src="/images/info-logo.png"
                                                        />
                                                    </small>
                                                </h2>
                                                <UncontrolledPopover
                                                    trigger="legacy"
                                                    placement="right"
                                                    isOpen={
                                                        this.state
                                                            .showHintFor ==
                                                        "google-updates"
                                                    }
                                                    target="google-updates-datasource-hint"
                                                    toggle={() => {
                                                        this.changeShownHint(
                                                            null
                                                        );
                                                    }}
                                                >
                                                    <PopoverHeader>
                                                        Google Algorithm Updates
                                                    </PopoverHeader>
                                                    <PopoverBody>
                                                        Most of these Google
                                                        updates are so slight
                                                        that they go completely
                                                        unnoticed. However, on
                                                        occasion, the search
                                                        engine rolls out major
                                                        algorithmic updates that
                                                        significantly impact the
                                                        Search Engine Results
                                                        Pages
                                                    </PopoverBody>
                                                </UncontrolledPopover>
                                            </div>
                                            <div className="px-2 text-center">
                                                {this.state.userServices
                                                    .is_ds_google_algorithm_updates_enabled
                                                    ? "ON"
                                                    : "OFF"}
                                                <label className="trigger switch">
                                                    <input
                                                        type="checkbox"
                                                        checked={
                                                            this.state
                                                                .userServices
                                                                .is_ds_google_algorithm_updates_enabled
                                                        }
                                                        onChange={
                                                            this
                                                                .serviceStatusHandler
                                                        }
                                                        name="is_ds_google_algorithm_updates_enabled"
                                                    />
                                                    <span
                                                        className={`slider round ${this.state
                                                            .userServices
                                                            .is_ds_google_algorithm_updates_enabled
                                                            ? "animate-pulse"
                                                            : ""
                                                            }`}
                                                    />
                                                </label>
                                            </div>
                                        </div>
                                        {/*<div className="px-2">*/}
                                        {/*    <div className="list-wrapper">*/}
                                        {/*        {this.state.userDataSources.google_alert_keywords ?*/}
                                        {/*            <div>*/}
                                        {/*                <p style={{ fontSize: "13px" }}>Keywords:</p>*/}
                                        {/*                <dl className="d-flex flex-row flex-wrap data-source-select-options">*/}
                                        {/*                    {this.state.userDataSources.google_alert_keywords*/}
                                        {/*                        ? this.state.userDataSources.google_alert_keywords.map(keyword => keyword.value).join(", ")*/}
                                        {/*                        : <dd>no keyword added&nbsp;</dd>*/}
                                        {/*                    }*/}

                                        {/*                </dl>*/}
                                        {/*            </div>*/}
                                        {/*            : null*/}
                                        {/*        }*/}
                                        {/*    </div>*/}
                                        {/*</div>*/}
                                    </div>

                                    <p
                                        className="ds-update-text m-0 pb-3 px-2 text-right"
                                        onClick={() => {
                                            this.sectionToggler(
                                                "google_algorithm_updates"
                                            );
                                        }}
                                    >
                                        {this.state.sectionName ==
                                            "google_algorithm_updates"
                                            ? "Hide"
                                            : "Confirmed/Unconfirmed"}
                                    </p>
                                </div>
                            </div>

                            {/*
                                Retail Marketing Section
                            */}

                            <div className="col-md-6 mt-2">
                                <div
                                    className="d-flex border rounded flex-column justify-content-between"
                                    style={{ minHeight: "180px" }}
                                >
                                    <div>
                                        <div
                                            className="d-flex mt-2 justify-content-between "
                                            id="web-monitoring-data-source-section"
                                        >
                                            <div className="px-2">
                                                <h2>
                                                    <small>
                                                        Retail Marketing Dates{" "}
                                                        <UserAnnotationColorPicker
                                                            name="retail_marketings"
                                                            value={
                                                                this.state
                                                                    .userAnnotationColors
                                                                    .retail_marketings
                                                            }
                                                            updateCallback={
                                                                this
                                                                    .updateUserAnnotationColors
                                                            }
                                                        />
                                                        <img
                                                            id="retail-marketing-datasource-hint"
                                                            className="hint-button-2"
                                                            onClick={() => {
                                                                this.changeShownHint(
                                                                    "retail-marketing"
                                                                );
                                                            }}
                                                            src="/images/info-logo.png"
                                                        />
                                                    </small>
                                                </h2>
                                                <UncontrolledPopover
                                                    trigger="legacy"
                                                    placement="right"
                                                    isOpen={
                                                        this.state
                                                            .showHintFor ==
                                                        "retail-marketing"
                                                    }
                                                    target="retail-marketing-datasource-hint"
                                                    toggle={() => {
                                                        this.changeShownHint(
                                                            null
                                                        );
                                                    }}
                                                >
                                                    <PopoverHeader>
                                                        Retail Marketing Dates
                                                    </PopoverHeader>
                                                    <PopoverBody>
                                                        If you run an ecommerce
                                                        business, you know the
                                                        drill: Having a
                                                        promotional calendar for
                                                        marketing and shopping
                                                        events is key to deliver
                                                        on your sales targets.
                                                        Add automated
                                                        annotations to see how
                                                        affected your site.
                                                    </PopoverBody>
                                                </UncontrolledPopover>
                                            </div>
                                            <div className="px-2 text-center">
                                                {this.state.userServices
                                                    .is_ds_retail_marketing_enabled
                                                    ? "ON"
                                                    : "OFF"}
                                                <label className="trigger switch">
                                                    <input
                                                        type="checkbox"
                                                        name="is_ds_retail_marketing_enabled"
                                                        onChange={
                                                            this
                                                                .serviceStatusHandler
                                                        }
                                                        checked={
                                                            this.state
                                                                .userServices
                                                                .is_ds_retail_marketing_enabled
                                                        }
                                                    />
                                                    <span
                                                        className={`slider round ${this.state
                                                            .userServices
                                                            .is_ds_retail_marketing_enabled
                                                            ? "animate-pulse"
                                                            : ""
                                                            }`}
                                                    />
                                                </label>
                                            </div>
                                        </div>
                                        <div className="px-2"></div>
                                    </div>

                                    <p
                                        className="ds-update-text m-0 pb-3 px-2 text-right"
                                        onClick={() => {
                                            this.sectionToggler(
                                                "retail_marketings"
                                            );
                                        }}
                                    >
                                        {this.state.sectionName ==
                                            "retail_marketings"
                                            ? "Hide"
                                            : "Choose Dates"}
                                    </p>
                                </div>
                            </div>

                            {/*
                                Holidays Section
                            */}

                            <div className="col-md-6 mt-2">
                                <div
                                    className="d-flex border rounded flex-column justify-content-between"
                                    style={{ minHeight: "180px" }}
                                >
                                    <div>
                                        <div
                                            className="d-flex mt-2 justify-content-between "
                                            id="web-monitoring-data-source-section"
                                        >
                                            <div className="px-2">
                                                <h2>
                                                    <small>
                                                        Holidays{" "}
                                                        <UserAnnotationColorPicker
                                                            name="holidays"
                                                            value={
                                                                this.state
                                                                    .userAnnotationColors
                                                                    .holidays
                                                            }
                                                            updateCallback={
                                                                this
                                                                    .updateUserAnnotationColors
                                                            }
                                                        />
                                                        <img
                                                            id="holidays-datasource-hint"
                                                            className="hint-button-2"
                                                            onClick={() => {
                                                                this.changeShownHint(
                                                                    "holidays"
                                                                );
                                                            }}
                                                            src="/images/info-logo.png"
                                                        />
                                                    </small>
                                                </h2>
                                                <UncontrolledPopover
                                                    trigger="legacy"
                                                    placement="right"
                                                    isOpen={
                                                        this.state
                                                            .showHintFor ==
                                                        "holidays"
                                                    }
                                                    target="holidays-datasource-hint"
                                                    toggle={() => {
                                                        this.changeShownHint(
                                                            null
                                                        );
                                                    }}
                                                    onClick={() => {
                                                        this.changeShownHint(
                                                            null
                                                        );
                                                    }}
                                                >
                                                    <PopoverHeader>
                                                        Holidays
                                                    </PopoverHeader>
                                                    <PopoverBody>
                                                        How Christmas Day affect
                                                        your sells? Add
                                                        automatic annotations
                                                        for the Holidays of any
                                                        country
                                                    </PopoverBody>
                                                </UncontrolledPopover>
                                            </div>
                                            <div className="px-2 text-center">
                                                {this.state.userServices
                                                    .is_ds_holidays_enabled
                                                    ? "ON"
                                                    : "OFF"}
                                                <label className="trigger switch">
                                                    <input
                                                        type="checkbox"
                                                        name="is_ds_holidays_enabled"
                                                        onChange={
                                                            this
                                                                .serviceStatusHandler
                                                        }
                                                        checked={
                                                            this.state
                                                                .userServices
                                                                .is_ds_holidays_enabled
                                                        }
                                                    />
                                                    <span
                                                        className={`slider round ${this.state
                                                            .userServices
                                                            .is_ds_holidays_enabled
                                                            ? "animate-pulse"
                                                            : ""
                                                            }`}
                                                    />
                                                </label>
                                            </div>
                                        </div>
                                        <div className="px-2">
                                            <div className="list-wrapper">
                                                {this.state.userDataSources
                                                    .holidays ? (
                                                    <div>
                                                        <p
                                                            style={{
                                                                fontSize:
                                                                    "13px",
                                                            }}
                                                        >
                                                            Annotations for:
                                                        </p>
                                                        <dl className="d-flex flex-row flex-wrap data-source-select-options">
                                                            {this.state
                                                                .userDataSources
                                                                .holidays ? (
                                                                this.state.userDataSources.holidays
                                                                    .map(
                                                                        (
                                                                            country
                                                                        ) =>
                                                                            country.country_name
                                                                    )
                                                                    .join(", ")
                                                            ) : (
                                                                <dd>
                                                                    no country
                                                                    added
                                                                </dd>
                                                            )}
                                                        </dl>
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>

                                    <p
                                        className="ds-update-text m-0 pb-3 px-2 text-right"
                                        onClick={() => {
                                            this.sectionToggler("holidays");
                                        }}
                                    >
                                        {this.state.sectionName == "holidays"
                                            ? "Hide"
                                            : "Choose Countries"}
                                    </p>
                                </div>
                            </div>

                            {/*
                                Weather Alerts Section
                            */}

                            <div className="col-md-6 mt-2">
                                <div
                                    className="d-flex border rounded flex-column justify-content-between"
                                    style={{ minHeight: "180px" }}
                                >
                                    <div>
                                        <div
                                            className="d-flex mt-2 justify-content-between "
                                            id="web-monitoring-data-source-section"
                                        >
                                            <div className="px-2">
                                                <h2>
                                                    <small>
                                                        Weather Alerts{" "}
                                                        <UserAnnotationColorPicker
                                                            name="weather_alerts"
                                                            value={
                                                                this.state
                                                                    .userAnnotationColors
                                                                    .weather_alerts
                                                            }
                                                            updateCallback={
                                                                this
                                                                    .updateUserAnnotationColors
                                                            }
                                                        />
                                                        <img
                                                            id="weather-alert-datasource-hint"
                                                            className="hint-button-2"
                                                            onClick={() => {
                                                                this.changeShownHint(
                                                                    "weather-alert"
                                                                );
                                                            }}
                                                            src="/images/info-logo.png"
                                                        />
                                                    </small>
                                                </h2>
                                                <UncontrolledPopover
                                                    trigger="legacy"
                                                    placement="right"
                                                    isOpen={
                                                        this.state
                                                            .showHintFor ==
                                                        "weather-alert"
                                                    }
                                                    target="weather-alert-datasource-hint"
                                                    toggle={() => {
                                                        this.changeShownHint(
                                                            null
                                                        );
                                                    }}
                                                >
                                                    <PopoverHeader>
                                                        Weather Alerts
                                                    </PopoverHeader>
                                                    <PopoverBody>
                                                        <strong>Weather</strong>{" "}
                                                        disrupts the operating
                                                        and financial
                                                        performance of 70% of
                                                        businesses worldwide.
                                                        Add automated
                                                        annotations for the
                                                        location you operate{" "}
                                                    </PopoverBody>
                                                </UncontrolledPopover>
                                            </div>
                                            <div className="px-2 text-center">
                                                {this.state.userServices
                                                    .is_ds_weather_alerts_enabled
                                                    ? "ON"
                                                    : "OFF"}
                                                <label className="trigger switch">
                                                    <input
                                                        type="checkbox"
                                                        name="is_ds_weather_alerts_enabled"
                                                        onChange={
                                                            this
                                                                .serviceStatusHandler
                                                        }
                                                        checked={
                                                            this.state
                                                                .userServices
                                                                .is_ds_weather_alerts_enabled
                                                        }
                                                    />
                                                    <span
                                                        className={`slider round ${this.state
                                                            .userServices
                                                            .is_ds_weather_alerts_enabled
                                                            ? "animate-pulse"
                                                            : ""
                                                            }`}
                                                    />
                                                </label>
                                            </div>
                                        </div>
                                        <div className="px-2">
                                            <div className="list-wrapper">
                                                {this.state.userDataSources
                                                    .open_weather_map_cities ? (
                                                    <div className="px-2">
                                                        <div className="list-wrapper">
                                                            <p
                                                                style={{
                                                                    fontSize:
                                                                        "13px",
                                                                }}
                                                            >
                                                                Credits:{" "}
                                                                {
                                                                    this.state
                                                                        .userDataSources
                                                                        .open_weather_map_cities
                                                                        .length
                                                                }
                                                                /
                                                                {
                                                                    this.props
                                                                        .user
                                                                        .price_plan
                                                                        .owm_city_count > 0 ?
                                                                    this.props
                                                                        .user
                                                                        .price_plan
                                                                        .owm_city_count : 0
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="px-2">
                                            <div className="list-wrapper">
                                                {this.state.userDataSources
                                                    .open_weather_map_cities ? (
                                                    <div>
                                                        <p
                                                            style={{
                                                                fontSize:
                                                                    "13px",
                                                            }}
                                                        >
                                                            Alerts for:
                                                        </p>
                                                        <dl className="d-flex flex-row flex-wrap data-source-select-options">
                                                            {this.state
                                                                .userDataSources
                                                                .open_weather_map_cities ? (
                                                                this.state.userDataSources.open_weather_map_cities.map(
                                                                    (owmc) =>
                                                                        owmc.open_weather_map_city ? (
                                                                            <dd
                                                                                key={
                                                                                    owmc.id
                                                                                }
                                                                            >
                                                                                {
                                                                                    owmc
                                                                                        .open_weather_map_city
                                                                                        .name
                                                                                }
                                                                                ,{" "}
                                                                                {
                                                                                    owmc
                                                                                        .open_weather_map_city
                                                                                        .country_name
                                                                                }
                                                                                &nbsp;
                                                                            </dd>
                                                                        ) : null
                                                                )
                                                            ) : (
                                                                <dd>
                                                                    no city
                                                                    added
                                                                </dd>
                                                            )}
                                                        </dl>
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <p
                                            className="ds-update-text m-0 px-2 text-right"
                                            onClick={() => {
                                                this.sectionToggler(
                                                    "weather_alerts"
                                                );
                                            }}
                                        >
                                            {this.state.sectionName ==
                                                "weather_alerts"
                                                ? "Hide"
                                                : "Choose Cities"}
                                        </p>
                                        <p
                                            className="ds-update-text m-0 pb-3 px-2 text-right"
                                            onClick={() => {
                                                this.sectionToggler(
                                                    "open_weather_map_events"
                                                );
                                            }}
                                        >
                                            {this.state.sectionName ==
                                                "open_weather_map_events"
                                                ? "Hide"
                                                : "Choose Events"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/*
                                Wordpress Updates Section
                            */}

                            <div className="col-md-6 mt-2">
                                <div
                                    className="d-flex border rounded flex-column justify-content-between"
                                    style={{ minHeight: "180px" }}
                                >
                                    <div>
                                        <div
                                            className="d-flex mt-2 justify-content-between "
                                            id="web-monitoring-data-source-section"
                                        >
                                            <div className="px-2">
                                                <h2>
                                                    <small>
                                                        Wordpress Updates{" "}
                                                        <UserAnnotationColorPicker
                                                            name="wordpress_updates"
                                                            value={
                                                                this.state
                                                                    .userAnnotationColors
                                                                    .wordpress_updates
                                                            }
                                                            updateCallback={
                                                                this
                                                                    .updateUserAnnotationColors
                                                            }
                                                        />
                                                        <img
                                                            id="wordpress-updates-datasource-hint"
                                                            className="hint-button-2"
                                                            onClick={() => {
                                                                this.changeShownHint(
                                                                    "wordpress-updates"
                                                                );
                                                            }}
                                                            src="/images/info-logo.png"
                                                        />
                                                    </small>
                                                </h2>
                                                <div className="input-group-prepend">
                                                    <div
                                                        className="input-group"
                                                        style={{
                                                            marginTop: "7px",
                                                        }}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            style={{
                                                                position:
                                                                    "absolute",
                                                                top: "3px",
                                                            }}
                                                            onChange={(e) => {
                                                                if (
                                                                    e.target
                                                                        .checked
                                                                ) {
                                                                    this.userDataSourceAddHandler(
                                                                        {
                                                                            code: "wordpress_updates",
                                                                            name: "WordpressUpdate",
                                                                            country_name:
                                                                                null,
                                                                            retail_marketing_id:
                                                                                null,
                                                                            value: "last year",
                                                                        }
                                                                    );
                                                                } else {
                                                                    this.userDataSourceDeleteHandler(
                                                                        this
                                                                            .state
                                                                            .userDataSources
                                                                            .wordpress_updates[0]
                                                                            .id,
                                                                        "wordpress_updates"
                                                                    );
                                                                }
                                                            }}
                                                            checked={
                                                                this.state
                                                                    .userDataSources
                                                                    .wordpress_updates &&
                                                                this.state
                                                                    .userDataSources
                                                                    .wordpress_updates
                                                                    .length > 0
                                                            }
                                                            name="last_year_only"
                                                        />
                                                        <h6
                                                            style={{
                                                                position:
                                                                    "absolute",
                                                                top: "0px",
                                                                left: "10px",
                                                            }}
                                                        >
                                                            {" "}
                                                            &nbsp;&nbsp; Show
                                                            last year only
                                                        </h6>
                                                    </div>
                                                </div>
                                                <UncontrolledPopover
                                                    trigger="legacy"
                                                    placement="right"
                                                    isOpen={
                                                        this.state
                                                            .showHintFor ==
                                                        "wordpress-updates"
                                                    }
                                                    target="wordpress-updates-datasource-hint"
                                                    toggle={() => {
                                                        this.changeShownHint(
                                                            null
                                                        );
                                                    }}
                                                >
                                                    <PopoverHeader>
                                                        WordPress Core Updates
                                                    </PopoverHeader>
                                                    <PopoverBody>
                                                        <strong>
                                                            WordPress Core
                                                            Updates
                                                        </strong>{" "}
                                                        Our automated annotation
                                                        feature will inform you
                                                        when a new version,
                                                        Security, or Maintenance
                                                        Release of WordPress is
                                                        available.
                                                    </PopoverBody>
                                                </UncontrolledPopover>
                                            </div>
                                            <div className="px-2 text-center">
                                                {this.state.userServices
                                                    .is_ds_wordpress_updates_enabled
                                                    ? "ON"
                                                    : "OFF"}
                                                <label className="trigger switch">
                                                    <input
                                                        type="checkbox"
                                                        checked={
                                                            this.state
                                                                .userServices
                                                                .is_ds_wordpress_updates_enabled
                                                        }
                                                        onChange={
                                                            this
                                                                .serviceStatusHandler
                                                        }
                                                        name="is_ds_wordpress_updates_enabled"
                                                    />
                                                    <span
                                                        className={`slider round ${this.state
                                                            .userServices
                                                            .is_ds_wordpress_updates_enabled
                                                            ? "animate-pulse"
                                                            : ""
                                                            }`}
                                                    />
                                                </label>
                                            </div>
                                        </div>
                                        <div className="px-2">
                                            <div className="list-wrapper"></div>
                                        </div>
                                    </div>
                                    <div></div>
                                </div>
                            </div>

                            {/*
                                Search Engine Position Tracking
                            */}
                            <div className="col-md-6 mt-2">
                                <div
                                    className="d-flex border rounded flex-column justify-content-between"
                                    style={{ minHeight: "180px" }}
                                >
                                    <div>
                                        <div
                                            className="d-flex mt-2 justify-content-between "
                                            id="keyword-tracking-data-source-section"
                                        >
                                            <div className="px-2">
                                                <h2>
                                                    <small>
                                                        Rank Tracking{" "}
                                                        <UserAnnotationColorPicker
                                                            name="keyword_tracking"
                                                            value={
                                                                this.state
                                                                    .userAnnotationColors
                                                                    .keyword_tracking
                                                            }
                                                            updateCallback={
                                                                this
                                                                    .updateUserAnnotationColors
                                                            }
                                                        />
                                                        <img
                                                            id="keyword-tracking"
                                                            className="hint-button-2"
                                                            onClick={() => {
                                                                this.changeShownHint(
                                                                    "keyword-tracking"
                                                                );
                                                            }}
                                                            src="/images/info-logo.png"
                                                        />
                                                    </small>
                                                </h2>
                                            </div>
                                            <UncontrolledPopover
                                                trigger="legacy"
                                                placement="right"
                                                isOpen={
                                                    this.state.showHintFor ==
                                                    "keyword-tracking"
                                                }
                                                target="keyword-tracking"
                                                toggle={() => {
                                                    this.changeShownHint(null);
                                                }}
                                            >
                                                <PopoverHeader>
                                                    Rank Tracking
                                                </PopoverHeader>
                                                <PopoverBody>
                                                    Track daily changes of your
                                                    target keywords in your
                                                    target area for your
                                                    business or competitors.
                                                </PopoverBody>
                                            </UncontrolledPopover>

                                            <div className="px-2 text-center">
                                                {this.state.userServices
                                                    .is_ds_keyword_tracking_enabled
                                                    ? "ON"
                                                    : "OFF"}
                                                <label className="trigger switch">
                                                    <input
                                                        type="checkbox"
                                                        checked={
                                                            this.state
                                                                .userServices
                                                                .is_ds_keyword_tracking_enabled
                                                        }
                                                        onChange={
                                                            this
                                                                .serviceStatusHandler
                                                        }
                                                        name="is_ds_keyword_tracking_enabled"
                                                    />
                                                    <span
                                                        className={`slider round ${this.state
                                                            .userServices
                                                            .is_ds_keyword_tracking_enabled
                                                            ? "animate-pulse"
                                                            : ""
                                                            }`}
                                                    />
                                                </label>
                                            </div>
                                        </div>

                                        <div className="ml-2">
                                            Credits:{" "}
                                            {
                                                this.state
                                                    .totalDfsKeywordCreditsUsed
                                            }
                                            /
                                            {this.props.user.price_plan
                                                .keyword_tracking_count == -1
                                                ? 0
                                                : this.props.user.price_plan
                                                    .keyword_tracking_count}
                                        </div>
                                    </div>
                                    <div>
                                        <p
                                            className="ds-update-text m-0 px-2 text-right"
                                            onClick={() => {
                                                this.sectionToggler(
                                                    "keyword_tracking"
                                                );
                                            }}
                                        >
                                            {this.state.sectionName ==
                                                "keyword_tracking"
                                                ? "Hide"
                                                : "Add Keywords"}
                                        </p>
                                        <p
                                            className="ds-update-text m-0 px-2 text-right"
                                            onClick={() => {
                                                this.setState({
                                                    manage_keyword_show: true,
                                                });
                                            }}
                                        >
                                            Manage Keywords
                                        </p>
                                        {this.state.manage_keyword_show ==
                                            true ? (
                                            <ManageKeywords
                                                keywords={
                                                    this.state.dfsKeywords
                                                }
                                                loadKeywordsCallback={
                                                    this
                                                        .loadKeywordTrackingKeywords
                                                }
                                                editKeywordCallback={
                                                    this.editKeywordToggler
                                                }
                                                closeManageKeywordPopup={
                                                    this
                                                        .manage_keyword_popup_handler
                                                }
                                            />
                                        ) : null}
                                    </div>
                                </div>
                            </div>

                            {/*
                                Bitbucket Section
                            */}
                            <div className="col-md-6 mt-2">
                                <div
                                    className="d-flex border rounded flex-column justify-content-between"
                                    style={{ minHeight: "180px" }}
                                >
                                    <div>
                                        <div
                                            className="d-flex mt-2 justify-content-between "
                                            id="web-monitoring-data-source-section"
                                        >
                                            <div className="px-2">
                                                <h2>
                                                    <small>
                                                        Bitbucket Tracking{" "}
                                                        <UserAnnotationColorPicker
                                                            name="bitbucket_tracking"
                                                            value={
                                                                this.state
                                                                    .userAnnotationColors
                                                                    .bitbucket_tracking
                                                            }
                                                            updateCallback={
                                                                this
                                                                    .updateUserAnnotationColors
                                                            }
                                                        />
                                                        <img
                                                            id="bitbucket_tracking-datasource-hint"
                                                            className="hint-button-2"
                                                            onClick={() => {
                                                                this.changeShownHint(
                                                                    "bitbucket_tracking"
                                                                );
                                                            }}
                                                            src="/images/info-logo.png"
                                                        />
                                                    </small>
                                                </h2>
                                            </div>
                                            <UncontrolledPopover
                                                trigger="legacy"
                                                placement="right"
                                                isOpen={
                                                    this.state
                                                        .showHintFor ==
                                                    "bitbucket_tracking"
                                                }
                                                target="bitbucket_tracking-datasource-hint"
                                                toggle={() => {
                                                    this.changeShownHint(
                                                        null
                                                    );
                                                }}
                                                onClick={() => {
                                                    this.changeShownHint(
                                                        null
                                                    );
                                                }}
                                            >
                                                <PopoverHeader>
                                                    Bitbucket Tracking
                                                </PopoverHeader>
                                                <PopoverBody>
                                                    Activate Bitbucket and automatically send code deployments to Crystal Ball
                                                </PopoverBody>
                                            </UncontrolledPopover>
                                            <div className="px-2 text-center">
                                                {this.state.userServices
                                                    .is_ds_bitbucket_tracking_enabled
                                                    ? "ON"
                                                    : "OFF"}
                                                <label className="trigger switch">
                                                    <input
                                                        type="checkbox"
                                                        name="is_ds_bitbucket_tracking_enabled"
                                                        onChange={
                                                            this
                                                                .serviceStatusHandler
                                                        }
                                                        checked={
                                                            this.state
                                                                .userServices
                                                                .is_ds_bitbucket_tracking_enabled
                                                        }
                                                    />
                                                    <span
                                                        className={`slider round ${this.state
                                                            .userServices
                                                            .is_ds_bitbucket_tracking_enabled
                                                            ? "animate-pulse"
                                                            : ""
                                                            }`}
                                                    />
                                                </label>
                                            </div>
                                        </div>
                                        <div className="ml-2">
                                            Credits:{" "}
                                            {
                                                this.state.userDataSources.bitbucket_tracking?.length
                                            }
                                            /
                                            {this.props.user.price_plan
                                                .bitbucket_credits_count == -1
                                                ? 0
                                                : this.props.user.price_plan
                                                    .bitbucket_credits_count}
                                        </div>
                                    </div>
                                    <div>
                                        {this.state.userServices.is_ds_bitbucket_tracking_enabled ?
                                            <p
                                                className="ds-update-text m-0 px-2 pb-3 text-right"
                                                onClick={() => {
                                                    this.sectionToggler(
                                                        "bitbucket_tracking"
                                                    );
                                                }}
                                            >
                                                {this.state.sectionName ==
                                                    "bitbucket_tracking"
                                                    ? "Hide"
                                                    : "Add Respositories"}
                                            </p>
                                            :
                                            <div></div>
                                        }
                                    </div>
                                </div>
                            </div>

                            {/*
                                Github Section
                            */}
                            <div className="col-md-6 mt-2">
                                <div
                                    className="d-flex border rounded flex-column justify-content-between"
                                    style={{ minHeight: "180px" }}
                                >
                                    <div>
                                        <div
                                            className="d-flex mt-2 justify-content-between "
                                            id="web-monitoring-data-source-section"
                                        >
                                            <div className="px-2">
                                                <h2>
                                                    <small>
                                                        Github Tracking{" "}
                                                        <UserAnnotationColorPicker
                                                            name="github_tracking"
                                                            value={
                                                                this.state
                                                                    .userAnnotationColors
                                                                    .github_tracking
                                                            }
                                                            updateCallback={
                                                                this
                                                                    .updateUserAnnotationColors
                                                            }
                                                        />
                                                        <img
                                                            id="github_tracking-datasource-hint"
                                                            className="hint-button-2"
                                                            onClick={() => {
                                                                this.changeShownHint(
                                                                    "github_tracking"
                                                                );
                                                            }}
                                                            src="/images/info-logo.png"
                                                        />
                                                    </small>
                                                </h2>
                                            </div>
                                            <UncontrolledPopover
                                                trigger="legacy"
                                                placement="right"
                                                isOpen={
                                                    this.state
                                                        .showHintFor ==
                                                    "github_tracking"
                                                }
                                                target="github_tracking-datasource-hint"
                                                toggle={() => {
                                                    this.changeShownHint(
                                                        null
                                                    );
                                                }}
                                                onClick={() => {
                                                    this.changeShownHint(
                                                        null
                                                    );
                                                }}
                                            >
                                                <PopoverHeader>
                                                    Github Tracking
                                                </PopoverHeader>
                                                <PopoverBody>
                                                    Activate Github and automatically send code deployments to Crystal Ball
                                                </PopoverBody>
                                            </UncontrolledPopover>
                                            <div className="px-2 text-center">
                                                {this.state.userServices
                                                    .is_ds_github_tracking_enabled
                                                    ? "ON"
                                                    : "OFF"}
                                                <label className="trigger switch">
                                                    <input
                                                        type="checkbox"
                                                        name="is_ds_github_tracking_enabled"
                                                        onChange={
                                                            this
                                                                .serviceStatusHandler
                                                        }
                                                        checked={
                                                            this.state
                                                                .userServices
                                                                .is_ds_github_tracking_enabled
                                                        }
                                                    />
                                                    <span
                                                        className={`slider round ${this.state
                                                            .userServices
                                                            .is_ds_github_tracking_enabled
                                                            ? "animate-pulse"
                                                            : ""
                                                            }`}
                                                    />
                                                </label>
                                            </div>
                                        </div>
                                        <div className="ml-2">
                                            Credits:{" "}
                                            {
                                                this.state.userDataSources.github_tracking?.length
                                            }
                                            /
                                            {this.props.user.price_plan
                                                .github_credits_count == -1
                                                ? 0
                                                : this.props.user.price_plan
                                                    .github_credits_count}
                                        </div>
                                    </div>
                                    <div>
                                        {this.state.userServices.is_ds_github_tracking_enabled ?
                                            <p
                                                className="ds-update-text m-0 px-2 pb-3 text-right"
                                                onClick={() => {
                                                    this.sectionToggler(
                                                        "github_tracking"
                                                    );
                                                }}
                                            >
                                                {this.state.sectionName ==
                                                    "github_tracking"
                                                    ? "Hide"
                                                    : "Add Respositories"}
                                            </p>
                                            :
                                            <div></div>
                                        }
                                    </div>
                                </div>
                                </div>
                            <div className="col-md-6 mt-2">
                                <ApplePodcast
                                    state={this.state}
                                    updateUserAnnotationColors={this.updateUserAnnotationColors}
                                    serviceStatusHandler={this.serviceStatusHandler}
                                    props={this.props}
                                    sectionToggler={() => this.sectionToggler('apple_podcast')}
                                />
                            </div>

                            {/*<div className="col-md-6 mt-2">*/}
                            {/*    <div className="d-flex border rounded flex-column justify-content-between" style={{ minHeight: "180px" }}>*/}
                            {/*        <div>*/}
                            {/*            <div className="d-flex mt-2 justify-content-between "*/}
                            {/*                 id="google-ads-change-data-source-section">*/}
                            {/*                <div className="px-2">*/}
                            {/*                    <h2>*/}
                            {/*                        <small>*/}
                            {/*                            Google Ads Changes <UserAnnotationColorPicker name="g_ads_history_change"*/}
                            {/*                                                                        value={this.state.userAnnotationColors.g_ads_history_change}*/}
                            {/*                                                                        updateCallback={this.updateUserAnnotationColors} />*/}
                            {/*                            <img className="hint-button-2" src="/images/info-logo.png" />*/}
                            {/*                        </small>*/}
                            {/*                    </h2>*/}
                            {/*                </div>*/}

                            {/*                <div className="px-2 text-center">*/}
                            {/*                    {this.state.userServices.is_ds_g_ads_history_change_enabled ? "ON" : "OFF"}*/}
                            {/*                    <label className="trigger switch">*/}
                            {/*                        <input type="checkbox"*/}
                            {/*                               checked={this.state.userServices.is_ds_g_ads_history_change_enabled}*/}
                            {/*                               onChange={this.serviceStatusHandler}*/}
                            {/*                               name="is_ds_g_ads_history_change_enabled"*/}
                            {/*                        />*/}
                            {/*                        <span className={`slider round ${this.state.userServices.is_ds_g_ads_history_change_enabled ? 'animate-pulse' : ''}`} />*/}
                            {/*                    </label>*/}
                            {/*                </div>*/}
                            {/*            </div>*/}
                            {/*        </div>*/}
                            {/*        <div>*/}
                            {/*            <p*/}
                            {/*                className="ds-update-text m-0 px-2 text-right"*/}
                            {/*                onClick={() => {*/}
                            {/*                    this.sectionToggler('g_ads_history_change');*/}
                            {/*                }}*/}
                            {/*            >*/}
                            {/*                {this.state.sectionName == "g_ads_history_change" ? "Hide" : "Configure"}*/}
                            {/*            </p>*/}

                            {/*        </div>*/}
                            {/*    </div>*/}
                            {/*</div>*/}

                            {/*
                                Facebook section
                            */}

                            {/*<div className="col-md-6 mt-2">*/}
                            {/*   <div className="d-flex border rounded flex-column justify-content-between"*/}
                            {/*        style={{minHeight: "180px"}}>*/}
                            {/*       <div>*/}
                            {/*           <div className="d-flex mt-2 justify-content-between "*/}
                            {/*                id="keyword-tracking-data-source-section">*/}
                            {/*               <div className="px-2">*/}
                            {/*                   <h2>*/}
                            {/*                       <small>*/}
                            {/*                           Facebook Tracking <UserAnnotationColorPicker*/}
                            {/*                           name="facebook_tracking"*/}
                            {/*                           value={this.state.userAnnotationColors.facebook_tracking}*/}
                            {/*                           updateCallback={this.updateUserAnnotationColors}/>*/}
                            {/*                           <img className="hint-button-2" src="/images/info-logo.png"/>*/}
                            {/*                       </small>*/}
                            {/*                   </h2>*/}
                            {/*               </div>*/}

                            {/*               <div className="px-2 text-center">*/}
                            {/*                   {this.state.userServices.is_ds_facebook_tracking_enabled ? "ON" : "OFF"}*/}
                            {/*                   <label className="trigger switch">*/}
                            {/*                       <input type="checkbox"*/}
                            {/*                              checked={this.state.userServices.is_ds_facebook_tracking_enabled}*/}
                            {/*                              onChange={this.serviceStatusHandler}*/}
                            {/*                              name="is_ds_facebook_tracking_enabled"*/}
                            {/*                       />*/}
                            {/*                       <span*/}
                            {/*                           className={`slider round ${this.state.userServices.is_ds_facebook_tracking_enabled ? 'animate-pulse' : ''}`}/>*/}
                            {/*                   </label>*/}
                            {/*               </div>*/}

                            {/*           </div>*/}
                            {/*       </div>*/}
                            {/*       <div>*/}
                            {/*           <p*/}
                            {/*               className="ds-update-text m-0 px-2 text-right"*/}
                            {/*               onClick={() => {*/}
                            {/*                   this.sectionToggler('facebook_tracking');*/}
                            {/*               }}*/}
                            {/*           >*/}
                            {/*               {this.state.sectionName == "facebook_tracking" ? "Hide" : "Configure"}*/}
                            {/*           </p>*/}

                            {/*       </div>*/}
                            {/*   </div>*/}
                            {/*</div>*/}

                            <div className="col-md-6 mt-2">
                                <div
                                    className="d-flex border rounded flex-column justify-content-between"
                                    style={{ minHeight: "180px" }}
                                >
                                    <div>
                                        <div
                                            className="d-flex mt-2 justify-content-between "
                                            id="web-monitoring-data-source-section"
                                        >
                                            <div className="px-2">
                                                <h2>
                                                    <small>
                                                        Facebook Tracking{" "}
                                                        <UserAnnotationColorPicker
                                                            name="anomolies_detection"
                                                            value={
                                                                this.state
                                                                    .userAnnotationColors
                                                                    .facebook_tracking
                                                            }
                                                            updateCallback={
                                                                this
                                                                    .updateUserAnnotationColors
                                                            }
                                                        />
                                                        <img
                                                            className="hint-button-2"
                                                            src="/images/info-logo.png"
                                                        />
                                                    </small>
                                                </h2>
                                            </div>
                                            <div className="px-2 text-center">
                                                OFF
                                                <label className="trigger switch">
                                                    <input
                                                        type="checkbox"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            swal.fire(
                                                                "This feature is coming soon. Stay tuned!",
                                                                "",
                                                                "info"
                                                            );
                                                            // swal.fire(
                                                            //     "This feature is coming soon. Stay tuned!",
                                                            //     "",
                                                            //     "info"
                                                            // );
                                                            // const accountNotLinkedHtml =
                                                            //     "" +
                                                            //     '<div class="">' +
                                                            //     '<img src="/images/banners/social_automations_banner.jpg" class="img-fluid">' +
                                                            //     "</div>";

                                                            // swal.fire({
                                                            //     html: accountNotLinkedHtml,
                                                            //     width: 700,
                                                            //     customClass: {
                                                            //         popup: "bg-light-red",
                                                            //         htmlContainer:
                                                            //             "m-0",
                                                            //     },
                                                            //     confirmButtonClass:
                                                            //         "rounded-pill btn btn-primary bg-primary px-4 font-weight-bold",
                                                            //     confirmButtonText:
                                                            //         "Upgrade Now" +
                                                            //         "<i class='ml-2 fa fa-caret-right'> </i>",
                                                            // }).then((value) => {
                                                            //     this.setState({
                                                            //         redirectTo:
                                                            //             "/settings/price-plans",
                                                            //     });
                                                            // });
                                                        }}
                                                        name="is_ds_anomolies_detection_enabled"
                                                    />
                                                    <span
                                                        className={`slider round`}
                                                    />
                                                </label>
                                            </div>
                                        </div>
                                        <div className="px-2">
                                            <div className="list-wrapper"></div>
                                            <div className="text-center mt-2">
                                                <img
                                                    src="images/comingsoon.png"
                                                    className="img-fluid w-40"
                                                    style={{
                                                        maxWidth: "150px",
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/*
                                INSTAGRAM AUTOMATION
                            */}

                            {/* <div className="col-md-6 mt-2">
                                <div className="d-flex border rounded flex-column justify-content-between"
                                     style={{minHeight: "180px"}}>
                                        <div className="d-flex mt-2 justify-content-between "
                                             id="web-monitoring-data-source-section">
                                            <div className="px-2">
                                                <h2>
                                                    <small>
                                                        Instagram Tracking
                                                        <UserAnnotationColorPicker
                                                            name="instagram_tracking"
                                                            value={this.state.userAnnotationColors.instagram_tracking}
                                                            updateCallback={this.updateUserAnnotationColors}
                                                        />
                                                        <img className="hint-button-2" src="/images/info-logo.png"/>
                                                    </small>
                                                </h2>
                                            </div>

                                            <div className="px-2 text-center">
                                                {this.state.userServices.is_ds_instagram_tracking_enabled ? "ON" : "OFF"}
                                                <label className="trigger switch">
                                                    <input type="checkbox"
                                                        checked={this.state.userServices.is_ds_instagram_tracking_enabled}
                                                        onChange={this.serviceStatusHandler}
                                                        name="is_ds_instagram_tracking_enabled"
                                                    />
                                                    <span className={`slider round ${this.state.userServices.is_ds_instagram_tracking_enabled ? 'animate-pulse' : ''}`} />
                                                </label>
                                            </div>

                                        </div>
                                        <div className="px-2">
                                           <p
                                                className="ds-update-text m-0 px-2 text-right"
                                                onClick={() => {
                                                    this.sectionToggler('instagram_tracking');
                                                }}
                                            >
                                                {this.state.sectionName == "instagram_tracking" ? "Hide" : "Configure"}
                                            </p>
                                        </div>
                                </div>
                            </div> */}

                            <div className="col-md-6 mt-2">
                                <div
                                    className="d-flex border rounded flex-column justify-content-between"
                                    style={{ minHeight: "180px" }}
                                >
                                    <div>
                                        <div
                                            className="d-flex mt-2 justify-content-between "
                                            id="web-monitoring-data-source-section"
                                        >
                                            <div className="px-2">
                                                <h2>
                                                    <small>
                                                        Instagram Tracking{" "}
                                                        <UserAnnotationColorPicker
                                                            name="anomolies_detection"
                                                            value={
                                                                this.state
                                                                    .userAnnotationColors
                                                                    .facebook_tracking
                                                            }
                                                            updateCallback={
                                                                this
                                                                    .updateUserAnnotationColors
                                                            }
                                                        />
                                                        <img
                                                            className="hint-button-2"
                                                            src="/images/info-logo.png"
                                                        />
                                                    </small>
                                                </h2>
                                            </div>
                                            <div className="px-2 text-center">
                                                OFF
                                                <label className="trigger switch">
                                                    <input
                                                        type="checkbox"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            swal.fire(
                                                                "This feature is coming soon. Stay tuned!",
                                                                "",
                                                                "info"
                                                            );
                                                            // const accountNotLinkedHtml =
                                                            //     "" +
                                                            //     '<div class="">' +
                                                            //     '<img src="/images/banners/social_automations_banner.jpg" class="img-fluid">' +
                                                            //     "</div>";

                                                            // swal.fire({
                                                            //     html: accountNotLinkedHtml,
                                                            //     width: 700,
                                                            //     customClass: {
                                                            //         popup: "bg-light-red",
                                                            //         htmlContainer:
                                                            //             "m-0",
                                                            //     },
                                                            //     confirmButtonClass:
                                                            //         "rounded-pill btn btn-primary bg-primary px-4 font-weight-bold",
                                                            //     confirmButtonText:
                                                            //         "Upgrade Now" +
                                                            //         "<i class='ml-2 fa fa-caret-right'> </i>",
                                                            // }).then((value) => {
                                                            //     this.setState({
                                                            //         redirectTo:
                                                            //             "/settings/price-plans",
                                                            //     });
                                                            // });
                                                        }}
                                                        name="is_ds_anomolies_detection_enabled"
                                                    />
                                                    <span
                                                        className={`slider round`}
                                                    />
                                                </label>
                                            </div>
                                        </div>
                                        <div className="px-2">
                                            <div className="list-wrapper"></div>
                                            <div className="text-center mt-2">
                                                <img
                                                    src="images/comingsoon.png"
                                                    className="img-fluid w-40"
                                                    style={{
                                                        maxWidth: "150px",
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/*
                                Google ads history changes section
                            */}
                            <div className="col-md-6 mt-2">
                                <div
                                    className="d-flex border rounded flex-column justify-content-between"
                                    style={{ minHeight: "180px" }}
                                >
                                    <div>
                                        <div
                                            className="d-flex mt-2 justify-content-between "
                                            id="web-monitoring-data-source-section"
                                        >
                                            <div className="px-2">
                                                <h2>
                                                    <small>
                                                        Google Ads Changes{" "}
                                                        <UserAnnotationColorPicker
                                                            name="g_ads_history_change"
                                                            value={
                                                                this.state
                                                                    .userAnnotationColors
                                                                    .g_ads_history_change
                                                            }
                                                            updateCallback={
                                                                this
                                                                    .updateUserAnnotationColors
                                                            }
                                                        />
                                                    </small>
                                                </h2>
                                                <UncontrolledPopover
                                                    trigger="legacy"
                                                    placement="right"
                                                    isOpen={
                                                        this.state
                                                            .showHintFor ==
                                                        "web-monitors"
                                                    }
                                                    target="web-monitors-datasource-hint"
                                                    toggle={() => {
                                                        this.changeShownHint(
                                                            null
                                                        );
                                                    }}
                                                >
                                                    <PopoverHeader>
                                                        Web Monitoring
                                                    </PopoverHeader>
                                                    <PopoverBody>
                                                        Downtime happens even to
                                                        the best of us. But it’s
                                                        important to know it
                                                        before customers are
                                                        affected and also keep
                                                        annotations on your
                                                        reports. Add your
                                                        website URL; we will
                                                        monitor it every 1
                                                        minute.
                                                    </PopoverBody>
                                                </UncontrolledPopover>
                                            </div>
                                            <div className="px-2">
                                                {/* {this.state.userServices.is_ds_g_ads_history_change_enabled ? "Yes" : "No"} */}
                                                OFF
                                                <label className="trigger switch">
                                                    <input
                                                        type="checkbox"
                                                        // checked={this.state.userServices.is_ds_g_ads_history_change_enabled}
                                                        // onChange={this.serviceStatusHandler}
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            swal.fire(
                                                                "This feature is coming soon. Stay tuned!",
                                                                "",
                                                                "info"
                                                            );
                                                            // if (!this.state.userServices.is_ds_g_ads_history_change_enabled) {
                                                            // }
                                                        }}
                                                        name="is_ds_g_ads_history_change_enabled"
                                                    />
                                                    {/* <span className={`slider round ${this.state.userServices.is_ds_g_ads_history_change_enabled ? 'animate-pulse' : ''}`} /> */}
                                                    <span
                                                        className={`slider round`}
                                                    />
                                                </label>
                                            </div>
                                        </div>
                                        <div className="px-2">
                                            <div className="list-wrapper"></div>
                                            <div className="text-center mt-2">
                                                <img
                                                    src="images/comingsoon.png"
                                                    className="img-fluid w-40"
                                                    style={{
                                                        maxWidth: "150px",
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-6 mt-2">
                                <div
                                    className="d-flex border rounded flex-column justify-content-between"
                                    style={{ minHeight: "180px" }}
                                >
                                    <div>
                                        <div
                                            className="d-flex mt-2 justify-content-between "
                                            id="web-monitoring-data-source-section"
                                        >
                                            <div className="px-2">
                                                <h2>
                                                    <small>
                                                        LinkedIn Tracking{" "}
                                                        <UserAnnotationColorPicker
                                                            name="anomolies_detection"
                                                            value={
                                                                this.state
                                                                    .userAnnotationColors
                                                                    .facebook_tracking
                                                            }
                                                            updateCallback={
                                                                this
                                                                    .updateUserAnnotationColors
                                                            }
                                                        />
                                                        <img
                                                            className="hint-button-2"
                                                            src="/images/info-logo.png"
                                                        />
                                                    </small>
                                                </h2>
                                            </div>
                                            <div className="px-2 text-center">
                                                {/* {this.state.userServices.is_ds_anomolies_detection_enabled ? "Active" : "Deactive"} */}
                                                OFF
                                                <label className="trigger switch">
                                                    <input
                                                        type="checkbox"
                                                        // checked={this.state.userServices.is_ds_anomolies_detection_enabled}
                                                        // onChange={this.serviceStatusHandler}
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            swal.fire(
                                                                "This feature is coming soon. Stay tuned!",
                                                                "",
                                                                "info"
                                                            );
                                                            // const accountNotLinkedHtml =
                                                            //     "" +
                                                            //     '<div class="">' +
                                                            //     '<img src="/images/banners/social_automations_banner.jpg" class="img-fluid">' +
                                                            //     "</div>";

                                                            // swal.fire({
                                                            //     html: accountNotLinkedHtml,
                                                            //     width: 700,
                                                            //     customClass: {
                                                            //         popup: "bg-light-red",
                                                            //         htmlContainer:
                                                            //             "m-0",
                                                            //     },
                                                            //     confirmButtonClass:
                                                            //         "rounded-pill btn btn-primary bg-primary px-4 font-weight-bold",
                                                            //     confirmButtonText:
                                                            //         "Upgrade Now" +
                                                            //         "<i class='ml-2 fa fa-caret-right'> </i>",
                                                            // }).then((value) => {
                                                            //     this.setState({
                                                            //         redirectTo:
                                                            //             "/settings/price-plans",
                                                            //     });
                                                            // });
                                                            // if (!this.state.userServices.is_ds_anomolies_detection_enabled) {

                                                            // }
                                                        }}
                                                        name="is_ds_anomolies_detection_enabled"
                                                    />
                                                    {/* <span className={`slider round ${this.state.userServices.is_ds_anomolies_detection_enabled ? 'animate-pulse' : ''}`} /> */}
                                                    <span
                                                        className={`slider round`}
                                                    />
                                                </label>
                                            </div>
                                        </div>
                                        <div className="px-2">
                                            <div className="list-wrapper"></div>
                                            <div className="text-center mt-2">
                                                <img
                                                    src="images/comingsoon.png"
                                                    className="img-fluid w-40"
                                                    style={{
                                                        maxWidth: "150px",
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-6 mt-2">
                                <div
                                    className="d-flex border rounded flex-column justify-content-between"
                                    style={{ minHeight: "180px" }}
                                >
                                    <div>
                                        <div
                                            className="d-flex mt-2 justify-content-between "
                                            id="web-monitoring-data-source-section"
                                        >
                                            <div className="px-2">
                                                <h2>
                                                    <small>
                                                        Twitter Tracking{" "}
                                                        <UserAnnotationColorPicker
                                                            name="twitter_tracking"
                                                            value={
                                                                this.state
                                                                    .userAnnotationColors
                                                                    .twitter_tracking
                                                            }
                                                            updateCallback={
                                                                this
                                                                    .updateUserAnnotationColors
                                                            }
                                                        />
                                                        <img
                                                            id="twitter_tracking-datasource-hint"
                                                            className="hint-button-2"
                                                            onClick={() => {
                                                                this.changeShownHint(
                                                                    "twitter_tracking"
                                                                );
                                                            }}
                                                            src="/images/info-logo.png"
                                                        />
                                                    </small>
                                                </h2>
                                                <UncontrolledPopover
                                                    trigger="legacy"
                                                    placement="right"
                                                    isOpen={
                                                        this.state
                                                            .showHintFor ==
                                                        "twitter_tracking"
                                                    }
                                                    target="twitter_tracking-datasource-hint"
                                                    toggle={() => {
                                                        this.changeShownHint(
                                                            null
                                                        );
                                                    }}
                                                >
                                                    <PopoverHeader>
                                                        Twitter Tracking
                                                    </PopoverHeader>
                                                    <PopoverBody>
                                                        description
                                                    </PopoverBody>
                                                </UncontrolledPopover>
                                            </div>
                                            <div className="px-2 text-center">
                                                {this.state.userServices.is_ds_twitter_tracking_enabled ? "ON" : "OFF"}
                                                <label className="trigger switch">
                                                    <input
                                                        type="checkbox"
                                                        checked={this.state.userServices.is_ds_twitter_tracking_enabled}
                                                        onChange={this.serviceStatusHandler}
                                                        name="is_ds_twitter_tracking_enabled"
                                                    />
                                                    <span className={`slider round ${this.state.userServices.is_ds_twitter_tracking_enabled ? 'animate-pulse' : ''}`} />
                                                </label>
                                            </div>
                                        </div>
                                        <div className="px-2">
                                            <div className="list-wrapper">
                                                <p
                                                    style={{
                                                        fontSize: "13px",
                                                    }}
                                                >
                                                    Credits: ∞
                                                </p>
                                            </div>
                                        </div>
                                        <div className="px-2">
                                            <div className="list-wrapper">
                                                    <div>

                                                    </div>
                                            </div>
                                        </div>

                                        <p
                                            className="ds-update-text m-0 pb-3 px-2 text-right"
                                            onClick={() => {
                                                this.sectionToggler(
                                                    "twitter_tracking"
                                                );
                                            }}
                                        >
                                            {this.state.sectionName ==
                                            "twitter_tracking"
                                                ? "Hide"
                                                : "Configure"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-6 mt-2">
                                <div
                                    className="d-flex border rounded flex-column justify-content-between"
                                    style={{ minHeight: "180px" }}
                                >
                                    <div>
                                        <div
                                            className="d-flex mt-2 justify-content-between "
                                            id="web-monitoring-data-source-section"
                                        >
                                            <div className="px-2">
                                                <h2>
                                                    <small>
                                                        TikTok Tracking{" "}
                                                        <UserAnnotationColorPicker
                                                            name="anomolies_detection"
                                                            value={
                                                                this.state
                                                                    .userAnnotationColors
                                                                    .facebook_tracking
                                                            }
                                                            updateCallback={
                                                                this
                                                                    .updateUserAnnotationColors
                                                            }
                                                        />
                                                        <img
                                                            className="hint-button-2"
                                                            src="/images/info-logo.png"
                                                        />
                                                    </small>
                                                </h2>
                                            </div>
                                            <div className="px-2 text-center">
                                                {/* {this.state.userServices.is_ds_anomolies_detection_enabled ? "Active" : "Deactive"} */}
                                                OFF
                                                <label className="trigger switch">
                                                    <input
                                                        type="checkbox"
                                                        // checked={this.state.userServices.is_ds_anomolies_detection_enabled}
                                                        // onChange={this.serviceStatusHandler}
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            swal.fire(
                                                                "This feature is coming soon. Stay tuned!",
                                                                "",
                                                                "info"
                                                            );
                                                            // swal.fire('This feature is coming soon. Stay tuned!', '', 'info');
                                                            // const accountNotLinkedHtml =
                                                            //     "" +
                                                            //     '<div class="">' +
                                                            //     '<img src="/images/banners/social_automations_banner.jpg" class="img-fluid">' +
                                                            //     "</div>";

                                                            // swal.fire({
                                                            //     html: accountNotLinkedHtml,
                                                            //     width: 700,
                                                            //     customClass: {
                                                            //         popup: "bg-light-red",
                                                            //         htmlContainer:
                                                            //             "m-0",
                                                            //     },
                                                            //     confirmButtonClass:
                                                            //         "rounded-pill btn btn-primary bg-primary px-4 font-weight-bold",
                                                            //     confirmButtonText:
                                                            //         "Upgrade Now" +
                                                            //         "<i class='ml-2 fa fa-caret-right'> </i>",
                                                            // }).then((value) => {
                                                            //     this.setState({
                                                            //         redirectTo:
                                                            //             "/settings/price-plans",
                                                            //     });
                                                            // });
                                                        }}
                                                        name="is_ds_anomolies_detection_enabled"
                                                    />
                                                    {/* <span className={`slider round ${this.state.userServices.is_ds_anomolies_detection_enabled ? 'animate-pulse' : ''}`} /> */}
                                                    <span
                                                        className={`slider round`}
                                                    />
                                                </label>
                                            </div>
                                        </div>
                                        <div className="px-2">
                                            <div className="list-wrapper"></div>
                                            <div className="text-center mt-2">
                                                <img
                                                    src="images/comingsoon.png"
                                                    className="img-fluid w-40"
                                                    style={{
                                                        maxWidth: "150px",
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/*
                                Anomalies Detection section
                            */}
                            {/*<div className="col-md-6 mt-2">*/}
                            {/*    <div className="d-flex border rounded flex-column justify-content-between" style={{ minHeight: "180px" }}>*/}
                            {/*        <div>*/}
                            {/*            <div className="d-flex mt-2 justify-content-between "*/}
                            {/*                id="web-monitoring-data-source-section">*/}
                            {/*                <div className="px-2">*/}
                            {/*                    <h2>*/}
                            {/*                        <small>*/}
                            {/*                            Anomalies Detection <UserAnnotationColorPicker name="anomolies_detection"*/}
                            {/*                                value={this.state.userAnnotationColors.anomolies_detection}*/}
                            {/*                                updateCallback={this.updateUserAnnotationColors} />*/}
                            {/*                            <img className="hint-button-2" src="/images/info-logo.png" />*/}
                            {/*                        </small>*/}
                            {/*                    </h2>*/}
                            {/*                </div>*/}
                            {/*                <div className="px-2 text-center">*/}
                            {/*                    /!* {this.state.userServices.is_ds_anomolies_detection_enabled ? "On" : "Off"} *!/*/}
                            {/*                    Deactive*/}
                            {/*                    <label className="trigger switch">*/}
                            {/*                        <input type="checkbox"*/}
                            {/*                            // checked={this.state.userServices.is_ds_anomolies_detection_enabled}*/}
                            {/*                            // onChange={this.serviceStatusHandler}*/}
                            {/*                            onClick={e => {*/}
                            {/*                                e.preventDefault()*/}
                            {/*                                swal.fire('This feature is coming soon. Stay tuned!', '', 'info');*/}
                            {/*                                // if (!this.state.userServices.is_ds_anomolies_detection_enabled) {*/}

                            {/*                                // }*/}
                            {/*                            }}*/}
                            {/*                            name="is_ds_anomolies_detection_enabled"*/}
                            {/*                        />*/}
                            {/*                        /!* <span className={`slider round ${this.state.userServices.is_ds_anomolies_detection_enabled ? 'animate-pulse' : ''}`} /> *!/*/}
                            {/*                        <span className={`slider round`} />*/}
                            {/*                    </label>*/}
                            {/*                </div>*/}
                            {/*            </div>*/}
                            {/*            <div className="px-2">*/}
                            {/*                <div className="list-wrapper">*/}
                            {/*                </div>*/}
                            {/*                <div className='text-center mt-2'>*/}
                            {/*                    <img src='images/comingsoon.png' className='img-fluid w-40' style={{ maxWidth: "150px" }} />*/}
                            {/*                </div>*/}
                            {/*            </div>*/}
                            {/*        </div>*/}
                            {/*    </div>*/}
                            {/*</div>*/}
                            {/*
                                Budget Tracking section
                            */}
                            {/*<div className="col-md-6 mt-2">*/}
                            {/*    <div className="d-flex border rounded flex-column justify-content-between" style={{ minHeight: "180px" }}>*/}
                            {/*        <div>*/}
                            {/*            <div className="d-flex mt-2 justify-content-between "*/}
                            {/*                id="web-monitoring-data-source-section">*/}
                            {/*                <div className="px-2">*/}
                            {/*                    <h2>*/}
                            {/*                        <small>*/}
                            {/*                            Budget Tracking <UserAnnotationColorPicker name="budget_tracking"*/}
                            {/*                                value={this.state.userAnnotationColors.budget_tracking}*/}
                            {/*                                updateCallback={this.updateUserAnnotationColors} />*/}
                            {/*                            <img className="hint-button-2" src="/images/info-logo.png" />*/}
                            {/*                        </small>*/}
                            {/*                    </h2>*/}
                            {/*                </div>*/}

                            {/*                <div className="px-2 text-center">*/}
                            {/*                    /!* {this.state.userServices.is_ds_budget_tracking_enabled ? "On" : "Off"} *!/*/}
                            {/*                    Deactive*/}
                            {/*                    <label className="trigger switch">*/}
                            {/*                        <input type="checkbox"*/}
                            {/*                            // checked={this.state.userServices.is_ds_budget_tracking_enabled}*/}
                            {/*                            // onChange={this.serviceStatusHandler}*/}
                            {/*                            onClick={e => {*/}
                            {/*                                e.preventDefault()*/}
                            {/*                                swal.fire('This feature is coming soon. Stay tuned!', '', 'info');*/}
                            {/*                                // if (!this.state.userServices.is_ds_budget_tracking_enabled) {*/}

                            {/*                                // }*/}
                            {/*                            }}*/}
                            {/*                            name="is_ds_budget_tracking_enabled"*/}
                            {/*                        />*/}
                            {/*                        /!* <span className={`slider round ${this.state.userServices.is_ds_budget_tracking_enabled ? 'animate-pulse' : ''}`} /> *!/*/}
                            {/*                        <span className={`slider round`} />*/}
                            {/*                    </label>*/}
                            {/*                </div>*/}
                            {/*            </div>*/}
                            {/*            <div className="px-2">*/}
                            {/*                <div className="list-wrapper">*/}
                            {/*                </div>*/}
                            {/*                <div className='text-center mt-2'>*/}
                            {/*                    <img src='images/comingsoon.png' className='img-fluid w-40' style={{ maxWidth: "150px" }} />*/}
                            {/*                </div>*/}
                            {/*            </div>*/}
                            {/*        </div>*/}
                            {/*    </div>*/}
                            {/*</div>*/}

                            {/*
                                Keyword Tracking section
                            */}

                            {/* <div className="col-md-6 mt-2">
                                <div className="d-flex border rounded flex-column justify-content-between" style={{ minHeight: "180px" }}>
                                    <div>
                                        <div className="d-flex mt-2 justify-content-between "
                                           id="web-monitoring-data-source-section">
                                           <div className="px-2">
                                               <h2>
                                                   <small>
                                                       Keyword Tracking <UserAnnotationColorPicker name="keyword_tracking"
                                                           value={this.state.userAnnotationColors.keyword_tracking}
                                                           updateCallback={this.updateUserAnnotationColors} />
                                                       <img className="hint-button-2" src="/images/info-logo.png" />
                                                   </small>
                                               </h2>
                                           </div>

                                            <div className="px-2">
                                                Deactive
                                                <label className="trigger switch">
                                                    <input type="checkbox"
                                                        onClick={e => {
                                                            e.preventDefault()
                                                            // swal.fire('This feature is coming soon. Stay tuned!', '', 'info');
                                                            const accountNotLinkedHtml = '' +
                                                                '<div class="">' +
                                                                '<img src="/images/banners/rank_tracking_banner.jpg" class="img-fluid">' +
                                                                '</div>'

                                                            swal.fire({
                                                                html: accountNotLinkedHtml,
                                                                width: 700,
                                                                customClass: {
                                                                    popup: 'bg-light-red',
                                                                    htmlContainer: 'm-0',
                                                                },
                                                                confirmButtonClass: "rounded-pill btn btn-primary bg-primary px-4 font-weight-bold",
                                                                confirmButtonText: "Upgrade Now" + "<i class='ml-2 fa fa-caret-right'> </i>",

                                                            }).then(value => {
                                                                this.setState({redirectTo: "/settings/price-plans"});
                                                            });
                                                        }}
                                                        name="is_ds_budget_tracking_enabled"
                                                    />
                                                    <span className={`slider round`} />
                                                </label>
                                            </div>
                                        </div>
                                        <div className="px-2">
                                            <div className="list-wrapper">
                                            </div>
                                            <div className='text-center mt-2'>
                                                <img src='images/comingsoon.png' className='img-fluid w-40' style={{ maxWidth: "150px" }} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div> */}
                        </div>
                    </div>

                    <div
                        className="col-md-3 col-sm-12 border-left"
                        id="data-source-detail-container"
                    >
                        {this.state.sectionName == "holidays" &&
                            this.state.userDataSources ? (
                            <Countries
                                onCheckCallback={this.userDataSourceAddHandler}
                                onUncheckCallback={
                                    this.userDataSourceDeleteHandler
                                }
                                ds_data={this.state.userDataSources.holidays}
                            />
                        ) : null}
                        {this.state.sectionName == "retail_marketings" &&
                            this.state.userDataSources ? (
                            <DSRMDatesSelect
                                onCheckCallback={this.userDataSourceAddHandler}
                                onUncheckCallback={
                                    this.userDataSourceDeleteHandler
                                }
                                ds_data={
                                    this.state.userDataSources.retail_marketings
                                }
                            />
                        ) : null}
                        {this.state.sectionName == "weather_alerts" &&
                            this.state.userDataSources ? (
                            <DSOWMCitiesSelect
                                onCheckCallback={this.userDataSourceAddHandler}
                                onUncheckCallback={
                                    this.userDataSourceDeleteHandler
                                }
                                ds_data={
                                    this.state.userDataSources
                                        .open_weather_map_cities
                                }
                            />
                        ) : null}
                        {this.state.sectionName == "open_weather_map_events" &&
                            this.state.userDataSources ? (
                            <DSOWMEventsSelect
                                onCheckCallback={this.userDataSourceAddHandler}
                                onUncheckCallback={
                                    this.userDataSourceDeleteHandler
                                }
                                ds_data={
                                    this.state.userDataSources
                                        .open_weather_map_events
                                }
                            />
                        ) : null}
                        {this.state.sectionName == "google_algorithm_updates" &&
                            this.state.userDataSources ? (
                            <DSGAUDatesSelect
                                onCheckCallback={this.userDataSourceAddHandler}
                                onUncheckCallback={
                                    this.userDataSourceDeleteHandler
                                }
                                ds_data={
                                    this.state.userDataSources
                                        .google_algorithm_update_dates
                                }
                            />
                        ) : null}
                        {this.state.sectionName == "google_alerts" &&
                            this.state.userDataSources ? (
                            <DSGoogleAlertsSelect
                                onCheckCallback={this.userDataSourceAddHandler}
                                onUncheckCallback={
                                    this.userDataSourceDeleteHandler
                                }
                                ds_data={
                                    this.state.userDataSources
                                        .google_alert_keywords
                                }
                            />
                        ) : null}

                        {this.state.sectionName == "apple_podcast" &&
                        this.state.userDataSources ? (
                            <ApplePodcastConfig
                                setState={this.setState}
                                sectionToggler={() => this.sectionToggler('apple_podcast')}
                                gaPropertyId={this.state.ga_property_id}
                            />
                        ) : null}
                        {this.state.sectionName == "web_monitors" &&
                            this.state.userDataSources ? (
                            <DSWebMonitorsSelect
                                onCheckCallback={this.userDataSourceAddHandler}
                                onUncheckCallback={
                                    this.userDataSourceDeleteHandler
                                }
                                ga_property_id={this.state.ga_property_id}
                                reloadWebMonitors={this.reloadWebMonitors}
                            />
                        ) : null}

                        {/* {
                            this.state.sectionName == 'keyword_tracking' && this.state.userDataSources ?
                                <DSKeywordTracking
                                    onCheckCallback={this.userDataSourceAddHandler}
                                    onUncheckCallback={this.userDataSourceDeleteHandler}
                                    ds_data={this.state.userDataSources.keyword_tracking}
                                />
                                : null
                        } */}

                        {this.state.sectionName == "keyword_tracking" &&
                            this.state.userDataSources ? (
                            <AddKeyword
                                used_credits={
                                    this.state.totalDfsKeywordCreditsUsed
                                }
                                total_credits={
                                    this.props.user.price_plan
                                        .keyword_tracking_count
                                }
                                onAddCallback={this.keywordAddHandler}
                            />
                        ) : null}

                        {this.state.sectionName == "edit_keyword" &&
                            this.state.editKeyword ? (
                            <EditKeyword
                                keyword_id={this.state.editKeyword_keyword_id}
                                total_credits={
                                    this.props.user.price_plan
                                        .keyword_tracking_count
                                }
                                used_credits={
                                    this.state.totalDfsKeywordCreditsUsed
                                }
                                keyword_configuration_id={
                                    this.state
                                        .editKeyword_keyword_configuration_id
                                }
                            />
                        ) : null}

                        {this.state.sectionName == "g_ads_history_change" ? (
                            <GoogleAdChanges />
                        ) : null}

                        {this.state.sectionName == "twitter_tracking" ? (
                            <TwitterTracking/>
                        ) : null}

                        {this.state.sectionName == "facebook_tracking" ? (
                            <FacebookTracking />
                        ) : null}

                        {this.state.sectionName == "instagram_tracking" ? (
                            <InstagramTracking />
                        ) : null}

                        {this.state.sectionName == "bitbucket_tracking" ? (
                            <BitbucketTracking
                                used_credits={
                                    this.state.userDataSources.bitbucket_tracking?.length
                                }
                                total_credits={
                                    this.props.user.price_plan.bitbucket_credits_count
                                }
                                ds_data={
                                    this.state.userDataSources.bitbucket_tracking
                                }
                                onCheckCallback={this.userDataSourceAddHandler}
                                onUncheckCallback={
                                    this.userDataSourceDeleteHandler
                                }
                            />
                        ) : null}

                        {this.state.sectionName == "github_tracking" ? (
                            <GithubTracking
                                used_credits={
                                    this.state.userDataSources.github_tracking?.length
                                }
                                total_credits={
                                    this.props.user.price_plan.github_credits_count
                                }
                                ds_data={
                                    this.state.userDataSources.github_tracking
                                }
                                onCheckCallback={this.userDataSourceAddHandler}
                                onUncheckCallback={
                                    this.userDataSourceDeleteHandler
                                }
                            />
                        ) : null}
                    </div>
                </div>
                </div>
        );
    }

    checkUserFacebookAccount() {
        // userFacebookAccountsExists
        this.setState({ isBusy: true })
        HttpClient.get('/data-source/user-facebook-accounts-exists', {}).then((resp) => {
            if (resp.data.exists) {
                this.setState({
                    isBusy: false,
                    errors: undefined,
                    userFacebookAccountsExists: true
                })
            }
        }, (err) => {
            this.setState({ isBusy: false, errors: err.response.data })
            status = false;
        }, this).catch(err => {
            this.setState({ isBusy: false, errors: err })
            status = false;
        });

        // userInstagramAccountsExists
        this.setState({ isBusy: true });
        HttpClient.get('/data-source/user-instagram-accounts-exists', {}).then((resp) => {
            if (resp.data.exists) {
                this.setState({
                    isBusy: false,
                    errors: undefined,
                    userInstagramAccountsExists: true
                })
            }
        }, (err) => {
            this.setState({ isBusy: false, errors: err.response.data })
            status = false;
        }, this).catch(err => {
            this.setState({ isBusy: false, errors: err })
            status = false;
        });
    }

    checkUserBitbucketAccount() {
        // userBitbucketAccountsExists
        this.setState({ isBusy: true });
        HttpClient.get('/data-source/user-bitbucket-accounts-exists', {}).then((resp) => {
            if (resp.data.exists) {
                this.setState({
                    isBusy: false,
                    errors: undefined,
                    userBitbucketAccountsExists: true
                })
            } else if (resp.data.error) {
                toast.error("BitBucket Error: " + resp.data.error);
                this.sectionToggler(null)
                this.updateUserService(
                    {
                        target: {
                            name: 'is_ds_bitbucket_tracking_enabled',
                            checked: 0
                        }
                    }
                );
            }
        }, (err) => {
            this.setState({ isBusy: false, errors: err.response.data })
            status = false;
        }, this).catch(err => {
            this.setState({ isBusy: false, errors: err })
            status = false;
        });
    }

    checkUserGithubAccount() {
        // userGithubAccountsExists
        this.setState({ isBusy: true });
        HttpClient.get('/data-source/user-github-accounts-exists', {}).then((resp) => {
            if (resp.data.exists) {
                this.setState({
                    isBusy: false,
                    errors: undefined,
                    userGithubAccountsExists: true
                })
            } else if (resp.data.error) {
                toast.error("Github Error: " + resp.data.error);
                this.sectionToggler(null)
                this.updateUserService(
                    {
                        target: {
                            name: 'is_ds_github_tracking_enabled',
                            checked: 0
                        }
                    }
                );
            }
        }, (err) => {
            this.setState({ isBusy: false, errors: err.response.data })
            status = false;
        }, this).catch(err => {
            this.setState({ isBusy: false, errors: err })
            status = false;
        });
    }

    updateUserService(e) {

        HttpClient.post('/userService', {[e.target.name]: e.target.checked ? 1 : 0}).then(resp => {

            switch (e.target.name) {
                case 'is_ds_twitter_tracking_enabled':
                    if(resp.data.twitter_accounts > 0){
                        this.setState({userServices: resp.data.user_services})
                        if (resp.data.user_services[e.target.name] == 1) {
                            toast.success("Service activated successfully.");
                        }
                        if (resp.data.user_services[e.target.name] == 0) {
                            toast.info("Service deactivated successfully.");
                        }
                    }else{
                        swal.fire({
                            iconHtml: '<img src="/images/svg/twitter.svg">',
                            showCloseButton: true,
                            title: "Connect with Twitter",
                            text: "Connect your Twitter account to create automatic annotations",
                            confirmButtonClass: "rounded-pill btn btn-primary bg-primary px-4 font-weight-bold",
                            confirmButtonText: "<a href='/socialite/twitter' class='text-white'><i class='mr-2 fa fa-twitter'> </i>" + "Connect twitter Account</a>"
                        });
                    }
                    break;

                default:

                    if (resp.data.user_services[e.target.name] == 1) {
                        toast.success("Service activated successfully.");
                    }
                    if (resp.data.user_services[e.target.name] == 0) {
                        toast.info("Service deactivated successfully.");
                    }
                    this.setState({userServices: resp.data.user_services})
                    break;
            }

            (this.props.reloadUser)();

        }, (err) => {
            this.setState({ isBusy: false, errors: (err.response).data });
            if ((err.response).status == 402) {
                swal.fire("Upgrade to Pro Plan!", "You have reached your Free 100 credits.", "warning").then(value => {
                    this.setState({redirectTo: '/settings/price-plans'});
                })
            }
        }).catch(err => {
            this.setState({ isBusy: false, errors: err });
        });
    }

    serviceStatusHandler(e) {
        if (this.props.user.price_plan.has_data_sources) {

            e.persist();
            if (e.target.name == 'is_ds_holidays_enabled' && e.target.checked) {
                this.sectionToggler('holidays')
                this.updateUserService(e);

            } else if (e.target.name == 'is_ds_holidays_enabled' && !e.target.checked) {
                this.sectionToggler(null)
                this.updateUserService(e);
            }
            if (e.target.name == 'is_ds_retail_marketing_enabled' && e.target.checked) {
                this.sectionToggler('retail_marketings')
                this.updateUserService(e);
            } else if (e.target.name == 'is_ds_retail_marketing_enabled' && !e.target.checked) {
                this.sectionToggler(null)
                this.updateUserService(e);
            }
            if (e.target.name == 'is_ds_weather_alerts_enabled' && e.target.checked) {
                this.sectionToggler('weather_alerts')
                this.updateUserService(e);
            } else if (e.target.name == 'is_ds_weather_alerts_enabled' && !e.target.checked) {
                this.sectionToggler(null)
                this.updateUserService(e);
            }
            if (e.target.name == 'is_ds_google_alerts_enabled' && e.target.checked) {
                this.sectionToggler('google_alerts')
                this.updateUserService(e);
            } else if (e.target.name == 'is_ds_google_alerts_enabled' && !e.target.checked) {
                this.sectionToggler(null)
                this.updateUserService(e);
            }
            if (e.target.name == 'is_ds_web_monitors_enabled' && e.target.checked) {
                this.sectionToggler('web_monitors')
                this.updateUserService(e);
            } else if (e.target.name == 'is_ds_web_monitors_enabled' && !e.target.checked) {
                this.sectionToggler(null)
                this.updateUserService(e);
            }
            if (e.target.name == 'is_ds_wordpress_updates_enabled' && e.target.checked) {
                this.sectionToggler(null)
                this.updateUserService(e);
            } else if (e.target.name == 'is_ds_wordpress_updates_enabled' && !e.target.checked) {
                this.sectionToggler(null)
                this.updateUserService(e);
            }
            if (e.target.name == 'is_ds_google_algorithm_updates_enabled' && e.target.checked) {
                this.sectionToggler('google_algorithm_updates')
                this.updateUserService(e);
            } else if (e.target.name == 'is_ds_google_algorithm_updates_enabled' && !e.target.checked) {
                this.sectionToggler(null)
                this.updateUserService(e);
            }
            if (e.target.name == 'is_ds_keyword_tracking_enabled' && e.target.checked) {
                this.sectionToggler('keyword_tracking')
                this.updateUserService(e);
            } else if (e.target.name == 'is_ds_keyword_tracking_enabled' && !e.target.checked) {
                this.sectionToggler(null)
                this.updateUserService(e);
            }

            if (e.target.name == 'is_ds_apple_podcast_annotation_enabled' && e.target.checked) {
                this.sectionToggler('apple_podcast')
                this.updateUserService(e);
            } else if (e.target.name == 'is_ds_apple_podcast_annotation_enabled' && !e.target.checked) {
                this.sectionToggler(null)
                this.updateUserService(e);
            }
            if (e.target.name == 'is_ds_instagram_tracking_enabled' && e.target.checked) {
                if (this.state.userInstagramAccountsExists) {
                    this.sectionToggler('instagram_tracking')
                    this.updateUserService(e, this);
                } else {
                    swal.fire({
                        customClass: {
                            htmlContainer: "py-3",
                        },
                        showCloseButton: true,
                        title: "Connect with Instagram",
                        text: "Connect your Instagram account to create automatic annotations for new posts; when you reach a post goal or run campaigns..",
                        confirmButtonClass: "rounded-pill btn btn-primary bg-primary px-4 font-weight-bold",
                        confirmButtonText: "<a href='/socialite/facebook' class='text-white'><i class='mr-2 fa fa-instagram'> </i>" + "Connect Instagram Account</a>",
                    })
                }
            } else if (e.target.name == 'is_ds_instagram_tracking_enabled' && !e.target.checked) {
                this.sectionToggler(null)
                this.updateUserService(e);
            }
            if (e.target.name == 'is_ds_facebook_tracking_enabled' && e.target.checked) {

                if (this.state.userFacebookAccountsExists) {
                    this.sectionToggler('facebook_tracking')
                    this.updateUserService(e, this);
                } else {
                    swal.fire({
                        customClass: {
                            htmlContainer: "py-3",
                        },
                        showCloseButton: true,
                        title: "Connect with Facebook",
                        text: "Connect your Facebook account to create automatic annotations for new posts; when you reach a post goal or run campaigns..",
                        confirmButtonClass: "rounded-pill btn btn-primary bg-primary px-4 font-weight-bold",
                        confirmButtonText: "<a href='/socialite/facebook' class='text-white'><i class='mr-2 fa fa-facebook'> </i>" + "Connect Facebook Account</a>",
                    })
                }

            } else if (e.target.name == 'is_ds_facebook_tracking_enabled' && !e.target.checked) {
                this.sectionToggler(null)
                this.updateUserService(e);
            }

            if (e.target.name == 'is_ds_bitbucket_tracking_enabled' && e.target.checked) {
                if (this.state.userBitbucketAccountsExists) {
                    this.sectionToggler('bitbucket_tracking')
                    this.updateUserService(e, this);
                } else {
                    swal.fire({
                        customClass: {
                            htmlContainer: "py-3",
                        },
                        showCloseButton: true,
                        title: "Connect with Bitbucket",
                        text: "Connect your Bitbucket account to create automatic annotations for commits",
                        confirmButtonClass: "rounded-pill btn btn-primary bg-primary px-4 font-weight-bold",
                        confirmButtonText: "<a href='/socialite/bitbucket' class='text-white'><i class='mr-2 fa fa-bitbucket'> </i>" + "Connect Bitbucket Account</a>",
                    })
                }
            } else if (e.target.name == 'is_ds_bitbucket_tracking_enabled' && !e.target.checked) {
                this.sectionToggler(null)
                this.updateUserService(e);
            }

            if (e.target.name == 'is_ds_github_tracking_enabled' && e.target.checked) {
                if (this.state.userGithubAccountsExists) {
                    this.sectionToggler('github_tracking')
                    this.updateUserService(e, this);
                } else {
                    swal.fire({
                        customClass: {
                            htmlContainer: "py-3",
                        },
                        showCloseButton: true,
                        title: "Connect with Github",
                        text: "Connect your github account to create automatic annotations for commits",
                        confirmButtonClass: "rounded-pill btn btn-primary bg-primary px-4 font-weight-bold",
                        confirmButtonText: "<a href='/socialite/github' class='text-white'><i class='mr-2 fa fa-github'> </i>" + "Connect Github Account</a>",
                    })
                }
            } else if (e.target.name == 'is_ds_github_tracking_enabled' && !e.target.checked) {
                this.sectionToggler(null)
                this.updateUserService(e);
            }

            if (e.target.name == 'is_ds_twitter_tracking_enabled') {
                this.updateUserService(e);
                this.sectionToggler(e.target.checked ? 'twitter_tracking' : null)
            }

        } else {
            const accountNotLinkedHtml = '' +
                '<div class="">' +
                '<img src="/images/automation-upgrade-modal.jpg" class="img-fluid">' +
                '</div>'

            swal.fire({
                html: accountNotLinkedHtml,
                width: 700,
                customClass: {
                    popup: 'bg-light-red',
                    htmlContainer: 'm-0',
                },
                confirmButtonClass: "rounded-pill btn btn-primary bg-primary px-4 font-weight-bold",
                confirmButtonText: "Upgrade Now" + "<i class='ml-2 fa fa-caret-right'> </i>",

            }).then(value => {
                this.setState({ redirectTo: "/settings/price-plans" });
            });
        }
    }

    userDataSourceAddHandler(dataSource) {
        this.setState({ isBusy: true });
        let formData = {
            'ds_code': dataSource.code,
            'ds_name': dataSource.name,
            'country_name': dataSource.country_name,
            'retail_marketing_id': dataSource.retail_marketing_id,
            'open_weather_map_city_id': dataSource.open_weather_map_city_id,
            'open_weather_map_event': dataSource.open_weather_map_event,
            'status': dataSource.status,
            'value': dataSource.value,
            'is_enabled': 1,
            'ga_property_id': this.state.ga_property_id,
            'workspace': dataSource.workspace
        }
        HttpClient.post('/data-source/user-data-source', formData).then(resp => {
            let uds = resp.data.user_data_source;
            let ar = this.state.userDataSources[uds.ds_code];
            if (uds.ds_code == 'google_algorithm_update_dates') {
                ar = [uds];
            } else {
                ar.push(uds)
            }

            if (dataSource.code == 'bitbucket_tracking' || dataSource.code == 'github_tracking')
                toast.success("Repository Connected.");
            this.setState({
                userDataSources: { ...this.state.userDataSources, [uds.ds_code]: ar },
                isBusy: false,
                errors: undefined
            })
        }, (err) => {
            this.setState({ isBusy: false, errors: err.response.data })

            if (err.response.status === 422) {
                let imgSrc = "/images/api-upgrade-modal.jpg";
                switch (dataSource.code) {
                    case 'bitbucket_tracking':
                    case 'github_tracking':
                        imgSrc = "/images/banners/Repositories-01.svg";
                        break;

                    default:
                        imgSrc = "/images/api-upgrade-modal.jpg";
                        break;
                }
                const accountNotLinkedHtml = '' +
                    '<div class="">' +
                    '<img src="' + imgSrc + '" class="img-fluid">' +
                    '</div>'

                swal.fire({
                    html: accountNotLinkedHtml,
                    width: 700,
                    customClass: {
                        popup: 'bg-light-red',
                        htmlContainer: 'm-0',
                    },
                    confirmButtonClass: "rounded-pill btn btn-primary bg-primary px-4 font-weight-bold",
                    confirmButtonText: "Upgrade Now" + "<i class='ml-2 fa fa-caret-right'> </i>",

                }).then(value => {
                    this.setState({ redirectTo: "/settings/price-plans" });
                });
            }
        }).catch(err => {
            this.setState({ isBusy: false, errors: err })
        })
    }

    userDataSourceDeleteHandler(userDataSourceId, dsCode) {
        this.setState({ isBusy: true });
        HttpClient.delete(`/data-source/user-data-source/${userDataSourceId}`).then(resp => {
            let ar = this.state.userDataSources[dsCode];
            let newAr = ar.filter(a => a.id != userDataSourceId)
            if (dsCode == 'bitbucket_tracking' || dsCode == 'github_tracking')
                toast.info("Repository Disconnected.");
            this.setState({
                userDataSources: { ...this.state.userDataSources, [dsCode]: newAr },
                isBusy: false,
                errors: undefined
            })
        }, (err) => {
            this.setState({ isBusy: false, errors: err.response.data })
        }).catch(err => {
            this.setState({ isBusy: false, errors: err })
        })
    }

    changeShownHint(obj) {
        this.setState({ showHintFor: obj })
    }

    sectionToggler(sectionName) {
        if (null == sectionName) {
            this.setState({ sectionName: null })
        } else if (this.state.sectionName == sectionName) {
            this.setState({ sectionName: null })
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            this.setState({ sectionName: sectionName });
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

}
