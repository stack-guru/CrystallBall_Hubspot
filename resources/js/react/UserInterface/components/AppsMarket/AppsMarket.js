import React from "react";
import {Redirect} from "react-router-dom";
import HttpClient from "../../utils/HttpClient";

import {Container, FormGroup, Input, Label} from "reactstrap";
import AppsModal from "./AppsModal";
import WebsiteMonitoring from "./WebsiteMonitoring";
import NewsAlerts from "./NewsAlerts";
import Shopify from "./Shopify";
import GoogleUpdates from "./GoogleUpdates";
import RetailMarketingDates from "./RetailMarketingDates";
import Holidays from "./Holidays";
import WeatherAlerts from "./WeatherAlerts";
import WordpressUpdates from "./WordpressUpdates";
import Wordpress from "./Wordpress";
import RankTracking from "./RankTracking";
import Bitbucket from "./Bitbucket";
import Facebook from "./Facebook";
import Instagram from "./Instagram";
import Github from "./Github";
import Apple from "./Apple";
import Youtube from "./Youtube";
import Twitter from "./Twitter";
import GoogleTagManager from "./GoogleTagManager";
import Slider from "react-slick";
import Toast from "../../utils/Toast";

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
            userTwitterAccountsExists: false,
            userBitbucketAccountsExists: false,
            userGithubAccountsExists: false,
            dsKey: "",
            dsKeySkip: "",
            recommendedApps: [],
            sortBy: '',
            filter: ''
        };
        this.userDataSourceAddHandler =
            this.userDataSourceAddHandler.bind(this);
        this.userDataSourceAddAllHandler =
            this.userDataSourceAddAllHandler.bind(this);
        this.onUncheckAllCallback =
            this.onUncheckAllCallback.bind(this);
        this.userDataSourceDeleteHandler =
            this.userDataSourceDeleteHandler.bind(this);
        this.serviceStatusHandler = this.serviceStatusHandler.bind(this);
        this.onChangeSortHandler = this.onChangeSortHandler.bind(this);
        this.onChangeFilterHandler = this.onChangeFilterHandler.bind(this);

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
        this.addKeywordToggler = this.addKeywordToggler.bind(this);
        this.upgradePopupForRankTracking = this.upgradePopupForRankTracking.bind(this);
        this.checkUserFacebookAccount =
            this.checkUserFacebookAccount.bind(this);
        this.checkUserBitbucketAccount =
            this.checkUserBitbucketAccount.bind(this);
        this.checkUserGithubAccount = this.checkUserGithubAccount.bind(this);
        this.updateUserService = this.updateUserService.bind(this);
        this.getRecommendedApps = this.getRecommendedApps.bind(this);
        this.userDataSourceUpdateHandler = this.userDataSourceUpdateHandler.bind(this);
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
        this.getRecommendedApps();
        var urlSearchParams = new URLSearchParams(window.location.search);
        if (urlSearchParams.has('show_bit_bucket_popup')) {
            this.setState({
                dsKey: "is_ds_bitbucket_tracking_enabled",
            });
        }
        if (urlSearchParams.has('show_github_popup')) {
            this.setState({
                dsKey: "is_ds_github_tracking_enabled",
            });
        }
        if (urlSearchParams.has('show_twitter_popup')) {
            this.setState({
                dsKey: "is_ds_twitter_tracking_enabled",
            });
        }
        if (urlSearchParams.has('show_instagram_popup')) {
            this.setState({
                dsKey: "is_ds_instagram_tracking_enabled",
            });
        }
        if (urlSearchParams.has('show_facebook_popup')) {
            this.setState({
                dsKey: "is_ds_facebook_tracking_enabled",
            });
        }
        let alertMessage = new URLSearchParams(window.location.search).get(
            "alertMessage"
        );
        if (alertMessage) {
            swal.fire({
                iconHtml: '<img src="/images/svg/twitter.svg">',
                popup: "twitterAlert",
                backdrop: "twitterAlert",
                title: "Connected",
                html: alertMessage,
                confirmButtonClass:
                    "rounded-pill btn btn-primary bg-primary px-4 font-weight-bold",
                customClass: {
                    popup: "popupAlert",
                    closeButton: "closeButtonTwitterAlert",
                },
            });
        }

        const redirectedRepo = localStorage.getItem("repo");
        if (!!redirectedRepo) {
            Toast.fire({
                icon: 'success',
                title: `${redirectedRepo} Account is connected. You can enable the automation now.`
            });
            // this.setState({ dsKey: `is_ds_${ redirectedRepo.toLowerCase() }_tracking_enabled` });
            localStorage.removeItem("repo");
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.user.toString() !== this.props.user.toString()) {
            this.setState({userServices: this.props.user});
        }
    }

    loadUserDataSources(gaPropertyId = '') {
        if (!this.state.isLoading) {
            this.setState({isLoading: true});

            let url = "/data-source/user-data-source"
            if (gaPropertyId) url = url + `?ga_property_id=${gaPropertyId}`;

            HttpClient.get(url)
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
                    this.setState({isLoading: false, errors: err});
                });
        }
    }

    loadKeywordTrackingKeywords() {
        this.setState({isBusy: true, errors: ""});
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
                this.setState({isLoading: false, errors: err});
            });
    }

    loadUserAnnotationColors() {
        if (!this.state.isLoading) {
            this.setState({isLoading: true});
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
                    this.setState({isLoading: false, errors: err});
                });
        }
    }

    updateUserAnnotationColors(userAnnotationColors) {
        this.setState({userAnnotationColors: userAnnotationColors});
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
                    this.setState({isBusy: false});
                }
            )
            .catch((err) => {
                this.setState({isBusy: false});
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

    addKeywordToggler() {
        // close popup
        this.manage_keyword_popup_handler();

        this.setState({
            editKeyword: false,
        });

        this.sectionToggler("keyword_tracking");
    }

    getRecommendedAppsData() {
        return [
            {
                id: "01",
                background: null,
                dsKey: "is_ds_google_alerts_enabled",
                connected: this.state.userServices["is_ds_google_alerts_enabled"],
                premium: false,
                brandName: "News Alerts",
                brandLogo: "/newsAlerts.svg",
                width: 136,
                height: 26,
            },
            ...(this.props.userStartupConfig ? [] : [
                {
                    id: "02",
                    background: "#00749a",
                    dsKey: "is_ds_wordpress_enabled",
                    connected: this.state.userServices["is_ds_wordpress_enabled"],
                    premium: false,
                    brandName: "Wordpress",
                    brandLogo: "/wordpress.svg",
                    width: 146,
                    height: 42,
                },
                {
                    id: "30",
                    background: null,
                    dsKey: "is_ds_wordpress_updates_enabled",
                    connected: this.state.userServices["is_ds_wordpress_updates_enabled"],
                    premium: false,
                    brandName: "Wordpress System Core Updates",
                    brandLogo: "/wordpressSCU.svg",
                    width: 148,
                    height: 40,
                }
            ]),


            {
                id: "05",
                background: null,
                dsKey: "is_ds_google_algorithm_updates_enabled",
                connected: this.state.userServices["is_ds_google_algorithm_updates_enabled"],
                premium: false,
                brandName: "Google Updates",
                brandLogo: "/googleUpdates.svg",
                width: 156,
                height: 26,
            },

            ...(this.props.userStartupConfig ? [] : [{
                id: "17",
                background: null,
                dsKey: "is_ds_apple_podcast_annotation_enabled",
                connected: this.state.userServices["is_ds_apple_podcast_annotation_enabled"],
                premium: false,
                brandName: "Apple Podcast",
                brandLogo: "/applePodcast.svg",
                width: 114,
                height: 30,
            }]),

            ...(this.props.userStartupConfig ? [] : [{
                id: "20",
                background: null,
                dsKey: "is_ds_shopify_annotation_enabled",
                connected: this.state.userServices["is_ds_shopify_annotation_enabled"],
                premium: false,
                commingSoon: false,
                brandName: "Shopify",
                brandLogo: "/shopify.svg",
                width: 114,
                height: 32,
            }]),


            {
                id: "24",
                background: null,
                dsKey: "is_ds_retail_marketing_enabled",
                connected: this.state.userServices["is_ds_retail_marketing_enabled"],
                premium: false,
                brandName: "Retail Marketing Dates",
                brandLogo: "/retail_marketing_dates_full.svg",
                width: 218,
                height: 26,
            },
            {
                id: "27",
                background: null,
                dsKey: "is_ds_holidays_enabled",
                connected: this.state.userServices["is_ds_holidays_enabled"],
                premium: false,
                brandName: "Holidays",
                brandLogo: "/holidays_full.svg",
                width: 106,
                height: 26,
            },
            {
                id: "28",
                background: null,
                dsKey: "is_ds_web_monitors_enabled",
                connected: this.state.userServices["is_ds_web_monitors_enabled"],
                premium: false,
                brandName: "Website Monitoring",
                brandLogo: "/websiteMonitoring.svg",
                width: 194,
                height: 26,
            },
            ...(this.props.userStartupConfig ? [] : [{
                id: "19",
                background: "#24292F",
                dsKey: "is_ds_github_tracking_enabled",
                connected: this.state.userServices["is_ds_github_tracking_enabled"],
                premium: false,
                brandName: "GitHub",
                brandLogo: "/github.svg",
                width: 116,
                height: 34,
            }]),
            {
                id: "03",
                background: null,
                dsKey: "is_ds_keyword_tracking_enabled",
                connected: this.state.userServices["is_ds_keyword_tracking_enabled"],
                premium: false,
                brandName: "Rank Tracking SERP",
                brandLogo: "/serp.svg",
                width: 160,
                height: 56,
            },
            ...(this.props.userStartupConfig ? [] : [{
                id: "25",
                background: "#253858",
                dsKey: "is_ds_bitbucket_tracking_enabled",
                connected: this.state.userServices["is_ds_bitbucket_tracking_enabled"],
                premium: false,
                brandName: "Bitbucket",
                brandLogo: "/bitbucket.svg",
                width: 142,
                height: 40,
            }]),
            ...(this.props.userStartupConfig ? [] : [{
                id: "04",
                background: null,
                dsKey: "is_ds_weather_alerts_enabled",
                connected: this.state.userServices["is_ds_weather_alerts_enabled"],
                premium: false,
                brandName: "Weather Alerts",
                brandLogo: "/weatherAlerts.svg",
                width: 160,
                height: 56,
            },
            // {
            //     id: "26",
            //     background: "#004F9D",
            //     dsKey: "is_ds_facebook_tracking_enabled",
            //     connected: this.state.userServices["is_ds_facebook_tracking_enabled"],
            //     premium: false,
            //     beta: true,
            //     brandName: "Facebook Ads",
            //     brandLogo: "/facebook.svg",
            //     width: 140,
            //     height: 19,
            // },
            // {
            //     id: "27",
            //     background: "radial-gradient(126.96% 126.96% at 6.47% 97.81%, #FA8F21 9%, #D82D7E 78%)",
            //     dsKey: "is_ds_instagram_tracking_enabled",
            //     connected: this.state.userServices["is_ds_instagram_tracking_enabled"],
            //     premium: false,
            //     beta: true,
            //     brandName: "Instagram",
            //     brandLogo: "/instagram.svg",
            //     width: 142,
            //     height: 32,
            // },
            {
                id: "26",
                background: "#004F9D",
                dsKey: "is_ds_facebook_tracking_enabled",
                connected: this.state.userServices["is_ds_facebook_tracking_enabled"],
                premium: false,
                beta: true,
                brandName: "Facebook Ads",
                brandLogo: "/facebook.svg",
                width: 140,
                height: 19,
            },
            {
                id: "27",
                background: "radial-gradient(126.96% 126.96% at 6.47% 97.81%, #FA8F21 9%, #D82D7E 78%)",
                dsKey: "is_ds_instagram_tracking_enabled",
                connected: this.state.userServices["is_ds_instagram_tracking_enabled"],
                premium: false,
                beta: true,
                brandName: "Instagram",
                brandLogo: "/instagram.svg",
                height: 32,
            },
            {
                id: "28",
                background: "null",
                dsKey: "is_ds_google_tag_manager_enabled",
                connected: this.state.userServices["is_ds_google_tag_manager_enabled"],
                premium: false,
                brandName: "Google Tag Manager",
                brandLogo: "/googleTagManager.svg",
                width: 110,
                height: 64,
            },
            // {
            //     id: "23",
            //     background: "null",
            //     dsKey: "is_ds_youtube_tracking_enabled",
            //     connected: this.state.userServices["is_ds_youtube_tracking_enabled"],
            //     premium: false,
            //     brandName: "YouTube",
            //     brandLogo: "/youtube.svg",
            //     width: 120,
            //     height: 28,
            // },
            // {
            //     id: "28",
            //     background: "#1DA1F2",
            //     dsKey: "is_ds_twitter_tracking_enabled",
            //     connected: this.state.userServices["is_ds_twitter_tracking_enabled"],
            //     premium: false,
            //     brandName: "Twitter",
            //     brandLogo: "/twitter.svg",
            //     width: 160,
            //     height: 56,
            // },
            // {
            //     id: "29",
            //     background: "#0A0A0A",
            //     dsKey: "is_ds_tiktok_tracking_enabled",
            //     connected: this.state.userServices["is_ds_tiktok_tracking_enabled"],
            //     premium: false,
            //     brandName: "Tiktok",
            //     brandLogo: "/tiktok.svg",
            //     width: 110,
            //     height: 32,
            // },
            // {
            //     id: "30",
            //     background: "#006192",
            //     dsKey: "is_ds_linkedin_tracking_enabled",
            //     connected: this.state.userServices["is_ds_linkedin_tracking_enabled"],
            //     premium: false,
            //     brandName: "linkedin",
            //     brandLogo: "/linkedin.svg",
            //     width: 116,
            //     height: 28,
            // },
        ]),
        ];
    }

    getRecommendedApps(sortColumn) {

        const sort_by = (field, reverse, primer) => {

            const key = primer ?
                function (x) {
                    return primer(x[field])
                } :
                function (x) {
                    return x[field]
                };

            reverse = !reverse ? 1 : -1;
            return function (a, b) {
                return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
            }
        }

        let sortedData = this.getRecommendedAppsData();
        if (sortColumn) {
            const column = sortColumn.split(':')[0]
            const order = sortColumn.split(':')[1]
            sortedData = this.state.recommendedApps.sort(sort_by(column, order !== "asc", (a) => (column === 'brandName' ? a.toUpperCase() : !!a)))
        }

        this.setState({recommendedApps: sortedData});
    }

    onChangeSortHandler(data) {
        this.setState({sortBy: data.target.value})
        this.getRecommendedApps(data.target.value);
    }

    onChangeFilterHandler(data) {
        this.setState({filter: data.target.value})

        let sortedData = this.getRecommendedAppsData();
        sortedData = sortedData.filter(x => x.brandName.toLowerCase().includes(data.target.value.toLowerCase()))
        this.setState({recommendedApps: sortedData});
    }

    render() {
        function SampleNextArrow(props) {
            const {className, style, onClick} = props;
            return (
                <div className={className} onClick={onClick}>
                    <i className="fa fa-angle-right"></i>
                </div>
            );
        }

        function SamplePrevArrow(props) {
            const {className, style, onClick} = props;
            return (
                <div className={className} onClick={onClick}>
                    <i className="fa fa-angle-left"></i>
                </div>
            );
        }

        var settings = {
            fade: true,
            speed: 500,
            dots: false,
            autoplay: true,
            infinite: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            adaptiveHeight: true,
            className: "themeTextSlider",
            nextArrow: <SampleNextArrow/>,
            prevArrow: <SamplePrevArrow/>
        };

        if (this.state.redirectTo)
            return <Redirect to={this.state.redirectTo}/>;

        return (
            <div id="appMarket" className={this.props.userStartupConfig ? "" : "appMarket"}>
                <Container>
                    {this.props.userStartupConfig ? null : <>
                        <div className="pageHeader">
                            <h2 className="pageTitle">Apps Market</h2>

                            <div className="pageNote position-relative">
                                <Slider {...settings}>
                                    {[
                                        {
                                            id: "01a",
                                            background: "null",
                                            text: "Create annotations directly from Slack or Asana",
                                            logo: "/zapier-small.svg",
                                            url: '/integrations',
                                        },

                                        {
                                            id: "02a",
                                            background: "null",
                                            dsKey: "is_ds_google_algorithm_updates_enabled",
                                            text: "Get the latest updates from Google and harness new SEO opportunities.",
                                            logo: "/google-small.svg",
                                        },

                                        {
                                            id: "03a",
                                            background: "null",
                                            dsKey: "is_ds_web_monitors_enabled",
                                            text: "Be the first to know that your website is down!",
                                            logo: "/web-monitoring-small.svg",
                                        },

                                        {
                                            id: "04a",
                                            background: "null",
                                            dsKey: "is_ds_keyword_tracking_enabled",
                                            text: "Automate your rank tracking to win the SERP game.",
                                            logo: "/SERP-small.svg",
                                        },

                                        {
                                            id: "05a",
                                            background: "null",
                                            dsKey: "is_ds_google_alerts_enabled",
                                            text: "Stay on top! Keep track of mentions of your brand and products.",
                                            logo: "/news-alert-small.svg",
                                        },

                                        {
                                            id: "06a",
                                            background: "null",
                                            dsKey: "is_ds_weather_alerts_enabled",
                                            text: "Explore weather-driven patterns of demand and consumer behavior.",
                                            logo: "/weather-small.svg",
                                        },

                                        {
                                            id: "07a",
                                            background: "null",
                                            dsKey: "is_ds_bitbucket_tracking_enabled",
                                            text: "See the changes your R&D makes and how they affect your sales.",
                                            logo: "/bitbucket-small.svg",
                                        },

                                        {
                                            id: "08a",
                                            background: "null",
                                            dsKey: "is_ds_github_tracking_enabled",
                                            text: "How is the new UI change affect the traffic?",
                                            logo: "/github-small.svg",
                                        },

                                        {
                                            id: "09a",
                                            background: "null",
                                            commingSoon: true,
                                            text: "Are your TikTok ads entertaining? Has it become a trend?",
                                            logo: "/tiktok-small.svg",
                                        },
                                        {
                                            id: "010a",
                                            background: "null",
                                            dsKey: "is_ds_twitter_tracking_enabled",
                                            text: "Find the campaign that's right for your goals.",
                                            logo: "/twitter-small.svg",
                                        },
                                        {
                                            id: "011a",
                                            background: "null",
                                            commingSoon: true,
                                            text: "See Facebook ads performance and optimize your SM marketing scheme",
                                            logo: "/facebook-small.svg",
                                        },
                                        {
                                            id: "012a",
                                            background: "null",
                                            commingSoon: true,
                                            text: "Get heads-ups on your Insta stats and work to improve the clicks.",
                                            logo: "/instagram-small.svg",
                                        },
                                        {
                                            id: "013a",
                                            background: "null",
                                            dsKey: "is_ds_wordpress_updates_enabled",
                                            text: "Get context, display new products, and design updates over your GA4 charts.",
                                            logo: "/wordPress-small.svg",
                                        },
                                        {
                                            id: "014a",
                                            background: "null",
                                            dsKey: "is_ds_shopify_annotation_enabled",
                                            text: "See new product data over GA4 metrics.",
                                            logo: "/shopify-small.svg",
                                        },
                                        {
                                            id: "015a",
                                            background: "null",
                                            dsKey: "is_ds_holidays_enabled",
                                            text: "Targeting a specific location? Don't miss any local holidays.",
                                            logo: "/holidays-small.svg",
                                        },
                                        {
                                            id: "015a",
                                            background: "null",
                                            dsKey: "is_ds_retail_marketing_enabled",
                                            text: "Get upfront reminders and advertise on retail marketing dates.",
                                            logo: "/retails-marketing-dates-small.svg",
                                        },
                                    ].map((item, i) => (<div key={i}
                                                             className="noteSlideerContent d-flex align-items-center justify-content-center">
                                        <span className="githubIcon flex-shrink-0"><img src={item.logo} alt={item.logo}
                                                                                        className="svg-inject"/></span>
                                        <p className="noteText mb-0">{item.text}</p>
                                        <button data-dsKey={item.dsKey} onClick={(ev) => {
                                            ev.stopPropagation();
                                            if (item.url) {
                                                window.location.href = item.url;
                                            } else if (item.commingSoon) {
                                                swal.fire("This feature is coming soon. Stay tuned!", "", "info");
                                            } else {
                                                this.setState({dsKey: item.dsKey, dsKeySkip: item.dsKey});
                                            }
                                        }} className="btn btn-sm btn-primary flex-shrink-0">Add
                                        </button>
                                        <a onClick={() => {
                                            this.setState({dsKey: item.dsKey, dsKeySkip: ''});
                                        }} href="javascript:void(0);" className="btn-learnmore">Learn more</a>
                                    </div>))}
                                </Slider>
                                {/* <span>See the changes your </span><strong>R&D</strong>{" "}<span>makes and how they affect your</span>{" "}<strong>sales</strong> */}
                            </div>

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
                                    <Input type="select" name="select" id="dropdownFilters"
                                           onChange={this.onChangeSortHandler}>
                                        <option>Sort by</option>
                                        <option value="brandName:asc">By Name</option>
                                        {/* <option value="brandName:desc">By Name: DESC</option> */}
                                        <option value="connected:desc">By Connected</option>
                                        {/* <option value="enabled:desc">By Not Connected</option> */}
                                    </Input>
                                </FormGroup>
                                <FormGroup className="filter-search position-relative">
                                    <Label className="sr-only" for="search">search</Label>
                                    <Input type="text" name="search" id="search" placeholder="Search App to Connect"
                                           onChange={this.onChangeFilterHandler}/>
                                    <button className="btn-searchIcon">
                                        <img className="d-block" src="/search-new.svg" width="16" height="16"
                                             alt="Search"/>
                                    </button>
                                </FormGroup>
                            </form>

                            <h3 className="h3-title">Display Insights and Annotations on Analytics and BI Tools</h3>
                        </div>

                        <div className="items analyticsAndBITools">
                            {[
                                {
                                    id: "06",
                                    background: "null",
                                    dsKey: "",
                                    enabled: false,
                                    premium: false,
                                    brandName: "Google Analytics",
                                    brandLogo: "/googleAnalytics.svg",
                                    url: 'https://chrome.google.com/webstore/detail/automated-google-analytic/jfkimpgkmamkdhamnhabohpeaplbpmom?hl=en',
                                    width: 178,
                                    height: 28,
                                },
                                {
                                    id: "12",
                                    background: "null",
                                    dsKey: "",
                                    enabled: false,
                                    premium: false,
                                    brandName: "Data Studio",
                                    brandLogo: "/dataStudio.svg",
                                    url: 'https://lookerstudio.google.com/data?search=gaannotations',
                                    width: 142,
                                    height: 32,
                                },
                                {
                                    id: "06",
                                    background: "null",
                                    dsKey: "",
                                    enabled: false,
                                    premium: false,
                                    brandName: "Google Ads",
                                    brandLogo: "/googleAds.svg",
                                    url: 'https://chrome.google.com/webstore/detail/automated-google-analytic/jfkimpgkmamkdhamnhabohpeaplbpmom?hl=en',
                                    width: 108,
                                    height: 40,
                                },
                                {
                                    id: "12",
                                    background: "#FF4A00",
                                    dsKey: "",
                                    enabled: false,
                                    premium: false,
                                    brandName: "Zapier",
                                    brandLogo: "/zapier.svg",
                                    url: '/integrations',
                                    width: 88,
                                    height: 40,
                                    openInSameTab: true
                                }
                            ].map((item, itemKey) => (
                                <a target={`${!item.openInSameTab ? '_blank' : ''}`} href={item.url}
                                   onClick={() => {
                                       this.setState({
                                           dsKey: item.dsKey,
                                           dsKeySkip: ""
                                       });
                                   }}
                                   className="item"
                                   key={itemKey}
                                   style={{
                                       background: item.background || "#fff",
                                       "borderColor":
                                           item.background || "#e0e0e0",
                                   }}
                                >
                                    {item.enabled ? (
                                        <i className="active fa fa-check-circle"></i>
                                    ) : null}
                                    <img src={item.brandLogo} alt={item.brandName} className="svg-inject"
                                         width={item.width} height={item.height}/>
                                    {item.premium ? (
                                        <span className="btn-premium">
                                        <i className="fa fa-diamond"></i>
                                        <span>Premium</span>
                                    </span>
                                    ) : null}
                                </a>
                            ))}
                        </div>

                        <div className="pageHeader">
                            <h3 className="h3-title">Connect Apps to Automate Insights</h3>
                        </div>
                    </>}
                    <div className="items recommendedForYou">
                        {this.state.recommendedApps.map((item, itemKey) => (
                            <div
                                onClick={() => {
                                    if (item.commingSoon) {
                                        swal.fire(
                                            "This feature is coming soon. Stay tuned!",
                                            "",
                                            "info"
                                        );
                                    } else {
                                        this.setState({
                                            dsKey: item.dsKey,
                                            ga_property_id: null,
                                            dsKeySkip: ""
                                        });
                                    }
                                }}
                                className="item position-relative"
                                key={itemKey}
                                style={{
                                    background: item.background || "#fff",
                                    "borderColor":
                                        item.background || "#e0e0e0",
                                }}
                            >
                                {this.state.userServices[item.dsKey] || this.state.userServices?.user?.[item.dsKey] ? (
                                    <i className="active fa fa-check-circle"></i>
                                ) : null}
                                <img src={item.brandLogo} alt={item.brandName} className="svg-inject" width={item.width}
                                     height={item.height}/>
                                {item.premium ? (
                                    <span className="btn-premium">
                                        <i className="fa fa-diamond"></i>
                                        <span>Premium</span>
                                    </span>
                                ) : null}
                                 {item.beta ? (
                                    <span className="btn-apps-beta text-light position-absolute">
                                        <span>BETA</span>
                                    </span>
                                ) : null}
                            </div>
                        ))}
                    </div>

                    {this.props.userStartupConfig ? null : <div className="boxWhite comingSoon">
                        <h4>Coming Soon</h4>
                        <div className="items">
                            {[
                                {
                                    id: "01",
                                    background: "#f12e45",
                                    dsKey: "",
                                    enabled: false,
                                    premium: false,
                                    brandName: "twilio",
                                    brandLogo: "/twilio.svg",
                                    width: 108,
                                    height: 32,
                                },
                                // {
                                //     id: "07",
                                //     background: "#004F9D",
                                //     dsKey: "",
                                //     enabled: false,
                                //     premium: false,
                                //     commingSoon: true,
                                //     brandName: "Facebook Ads",
                                //     brandLogo: "/facebookAds.svg",
                                //     width: 140,
                                //     height: 19,
                                // },
                                {
                                    id: "08",
                                    background: "radial-gradient(126.96% 126.96% at 6.47% 97.81%, #FA8F21 9%, #D82D7E 78%)",
                                    dsKey: "",
                                    enabled: false,
                                    premium: false,
                                    commingSoon: true,
                                    brandName: "Instagram",
                                    brandLogo: "/instagram.svg",
                                    width: 142,
                                    height: 32,
                                },
                                {
                                    id: "29",
                                    background: "#0A0A0A",
                                    dsKey: "",
                                    enabled: false,
                                    premium: false,
                                    commingSoon: true,
                                    brandName: "TikTok",
                                    brandLogo: "/tiktok.svg",
                                    width: 110,
                                    height: 32,
                                },
                                {
                                    id: "23",
                                    background: "null",
                                    dsKey: "",
                                    enabled: false,
                                    premium: false,
                                    commingSoon: true,
                                    brandName: "YouTube",
                                    brandLogo: "/youtube.svg",
                                    width: 120,
                                    height: 28,
                                },
                                {
                                    id: "22",
                                    background: "null",
                                    dsKey: "",
                                    enabled: false,
                                    premium: false,
                                    commingSoon: true,
                                    brandName: "ZOHO",
                                    brandLogo: "/zoho.svg",
                                    width: 100,
                                    height: 36,
                                },
                                {
                                    id: "21",
                                    background: "#2E3133",
                                    dsKey: "",
                                    enabled: false,
                                    premium: false,
                                    commingSoon: true,
                                    brandName: "WIX.com",
                                    brandLogo: "/wixCom.svg",
                                    width: 116,
                                    height: 28,
                                },
                                {
                                    id: "10",
                                    background: "#411442",
                                    dsKey: "",
                                    enabled: false,
                                    premium: false,
                                    commingSoon: true,
                                    brandName: "slack",
                                    brandLogo: "/slack.svg",
                                    width: 112,
                                    height: 28,
                                },
                                {
                                    id: "11",
                                    background: "#F8761F",
                                    dsKey: "",
                                    enabled: false,
                                    premium: false,
                                    commingSoon: true,
                                    brandName: "Hubspot",
                                    brandLogo: "/hubspot.svg",
                                    width: 104,
                                    height: 30,
                                },
                                {
                                    id: "13",
                                    background: "#006192",
                                    dsKey: "",
                                    enabled: false,
                                    premium: false,
                                    commingSoon: true,
                                    brandName: "Linkedin",
                                    brandLogo: "/linkedin.svg",
                                    width: 116,
                                    height: 28,
                                },
                                {
                                    id: "14",
                                    background: "#03363D",
                                    dsKey: "",
                                    enabled: false,
                                    premium: false,
                                    commingSoon: true,
                                    brandName: "Zendesk",
                                    brandLogo: "/zendesk.svg",
                                    width: 126,
                                    height: 24,
                                },
                                {
                                    id: "15",
                                    background: "#00A1E0",
                                    dsKey: "",
                                    enabled: false,
                                    premium: false,
                                    commingSoon: true,
                                    brandName: "Salesforce",
                                    brandLogo: "/salesforce.svg",
                                    width: 124,
                                    height: 28,
                                },
                                {
                                    id: "16",
                                    background: "#2EBD59",
                                    dsKey: "",
                                    enabled: false,
                                    premium: false,
                                    commingSoon: true,
                                    brandName: "Sportfy Podcast",
                                    brandLogo: "/sportfyPodcast.svg",
                                    width: 116,
                                    height: 32,
                                },
                                {
                                    id: "18",
                                    background: "#FF9900",
                                    dsKey: "",
                                    enabled: false,
                                    premium: false,
                                    commingSoon: true,
                                    brandName: "amazoon Podcast",
                                    brandLogo: "/amazonPodcast.svg",
                                    width: 114,
                                    height: 30,
                                },
                                {
                                    id: "09",
                                    background: "#1DA1F2",
                                    dsKey: "is_ds_twitter_tracking_enabled",
                                    connected: this.state.userServices["is_ds_twitter_tracking_enabled"],
                                    premium: false,
                                    commingSoon: true,
                                    brandName: "Twitter",
                                    brandLogo: "/twitter.svg",
                                    width: 100,
                                    height: 26,
                                },
                                // {
                                //     id: "26",
                                //     background: "#004F9D",
                                //     dsKey: "is_ds_facebook_tracking_enabled",
                                //     connected: this.state.userServices["is_ds_facebook_tracking_enabled"],
                                //     premium: false,
                                //     brandName: "Facebook Ads",
                                //     brandLogo: "/facebookAds.svg",
                                //     width: 140,
                                //     height: 19,
                                // },
                            ].map((item, itemKey) => (
                                <div className="item" key={itemKey} style={{
                                    background: item.background || "#fff",
                                    "borderColor": item.background || "#e0e0e0",
                                }}>
                                    {item.enabled ? (<i className="active fa fa-check-circle"></i>) : null}
                                    <img src={item.brandLogo} alt={item.brandName} className="svg-inject"
                                         width={item.width} height={item.height}/>
                                    {item.premium ? (<span className="btn-premium"><i
                                        className="fa fa-diamond"></i><span>Premium</span></span>) : null}
                                </div>
                            ))}
                        </div>
                    </div>}


                    <AppsModal
                        isOpen={!!this.state.dsKey}
                        toggle={() => {
                            this.setState({
                                dsKey: "",
                                dsKeySkip: ""
                            });
                        }}
                    >
                        {this.state.dsKey === "is_ds_web_monitors_enabled" ? (
                            <WebsiteMonitoring
                                {...this.state}
                                {...this.props}
                                closeModal={() => {
                                    this.setState({
                                        dsKey: "",
                                        dsKeySkip: ""
                                    });
                                }}
                                updateUserAnnotationColors={
                                    this.updateUserAnnotationColors
                                }
                                updateUserService={this.updateUserService}
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
                                closeModal={() => {
                                    this.setState({
                                        dsKey: "",
                                        dsKeySkip: ""
                                    });
                                }}
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
                        "is_ds_shopify_annotation_enabled" ? (
                            <Shopify
                                {...this.state}
                                {...this.props}
                                closeModal={() => {
                                    this.setState({
                                        dsKey: "",
                                        dsKeySkip: ""
                                    });
                                }}
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
                                closeModal={() => {
                                    this.setState({
                                        dsKey: "",
                                        dsKeySkip: ""
                                    });
                                }}
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
                                closeModal={() => {
                                    this.setState({
                                        dsKey: "",
                                        dsKeySkip: ""
                                    });
                                }}
                                updateUserAnnotationColors={
                                    this.updateUserAnnotationColors
                                }
                                serviceStatusHandler={this.serviceStatusHandler}
                                changeShownHint={this.changeShownHint}
                                sectionToggler={this.sectionToggler}
                                userDataSourceAddHandler={
                                    this.userDataSourceAddHandler
                                }
                                userDataSourceAddAllHandler={
                                    this.userDataSourceAddAllHandler
                                }
                                userDataSourceDeleteHandler={
                                    this.userDataSourceDeleteHandler
                                }
                                userDataSourceUpdateHandler={
                                    this.userDataSourceUpdateHandler
                                }
                                onUncheckAllCallback={
                                    this.onUncheckAllCallback
                                }
                                updateUserService={this.updateUserService}
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
                                closeModal={() => {
                                    this.setState({
                                        dsKey: "",
                                        dsKeySkip: ""
                                    });
                                }}
                                updateUserAnnotationColors={
                                    this.updateUserAnnotationColors
                                }
                                serviceStatusHandler={this.serviceStatusHandler}
                                changeShownHint={this.changeShownHint}
                                updateUserService={this.updateUserService}
                                sectionToggler={this.sectionToggler}
                                userDataSourceAddHandler={
                                    this.userDataSourceAddHandler
                                }
                                userDataSourceDeleteHandler={
                                    this.userDataSourceDeleteHandler
                                }
                                userDataSourceUpdateHandler={
                                    this.userDataSourceUpdateHandler
                                }
                                userDataSourceAddAllHandler={
                                    this.userDataSourceAddAllHandler
                                }
                                onUncheckAllCallback={
                                    this.onUncheckAllCallback
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
                        "is_ds_weather_alerts_enabled" ? (
                            <WeatherAlerts
                                {...this.state}
                                {...this.props}
                                closeModal={() => {
                                    this.setState({
                                        dsKey: "",
                                        dsKeySkip: ""
                                    });
                                }}
                                updateUserAnnotationColors={
                                    this.updateUserAnnotationColors
                                }
                                updateUserService={this.updateUserService}
                                serviceStatusHandler={this.serviceStatusHandler}
                                changeShownHint={this.changeShownHint}
                                sectionToggler={this.sectionToggler}
                                userDataSourceAddHandler={
                                    this.userDataSourceAddHandler
                                }
                                userDataSourceDeleteHandler={
                                    this.userDataSourceDeleteHandler
                                }
                                onUncheckAllCallback={
                                    this.onUncheckAllCallback
                                }
                                userDataSourceUpdateHandler={
                                    this.userDataSourceUpdateHandler
                                }
                                userDataSourceAddAllHandler={
                                    this.userDataSourceAddAllHandler
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
                        "is_ds_wordpress_updates_enabled" ? (
                            <WordpressUpdates
                                {...this.state}
                                {...this.props}
                                closeModal={() => {
                                    this.setState({
                                        dsKey: "",
                                        dsKeySkip: ""
                                    });
                                }}
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
                                userDataSourceUpdateHandler={
                                    this.userDataSourceUpdateHandler
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
                        "is_ds_wordpress_enabled" ? (
                            <Wordpress
                                {...this.state}
                                {...this.props}
                                closeModal={() => {
                                    this.setState({
                                        dsKey: "",
                                        dsKeySkip: ""
                                    });
                                }}
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
                                currentPricePlan={this.props.user.price_plan}
                            />
                        ) : this.state.dsKey ===
                        "is_ds_keyword_tracking_enabled" ? (
                            <RankTracking
                                {...this.state}
                                {...this.props}
                                closeModal={() => {
                                    this.setState({
                                        dsKey: "",
                                        dsKeySkip: ""
                                    });
                                }}
                                updateUserAnnotationColors={
                                    this.updateUserAnnotationColors
                                }
                                manageKeywordShow={(flag) => {
                                    this.setState({
                                        manage_keyword_show: flag,
                                    });
                                }}
                                loadKeywordTrackingKeywords={this.loadKeywordTrackingKeywords}
                                keywordAddHandler={this.keywordAddHandler}
                                updateUserService={this.updateUserService}
                                upgradePopupForTracking={this.upgradePopupForRankTracking}
                                serviceStatusHandler={this.serviceStatusHandler}
                                editKeywordToggler={this.editKeywordToggler}
                                addKeywordToggler={this.addKeywordToggler}
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
                        "is_ds_bitbucket_tracking_enabled" ? (
                            <Bitbucket
                                {...this.state}
                                {...this.props}
                                closeModal={() => {
                                    this.setState({
                                        dsKey: "",
                                        dsKeySkip: ""
                                    });
                                }}
                                updateUserAnnotationColors={
                                    this.updateUserAnnotationColors
                                }
                                updateUserService={this.updateUserService}
                                userGithubAccountsExists={this.state.userGithubAccountsExists}
                                serviceStatusHandler={this.serviceStatusHandler}
                                changeShownHint={this.changeShownHint}
                                sectionToggler={this.sectionToggler}
                                userDataSourceAddHandler={
                                    this.userDataSourceAddHandler
                                }
                                userDataSourceDeleteHandler={
                                    this.userDataSourceDeleteHandler
                                }
                                userDataSourceUpdateHandler={
                                    this.userDataSourceUpdateHandler
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
                        "is_ds_github_tracking_enabled" ? (
                            <Github
                                {...this.state}
                                {...this.props}
                                closeModal={() => {
                                    this.setState({
                                        dsKey: "",
                                        dsKeySkip: ""
                                    });
                                }}
                                updateUserAnnotationColors={
                                    this.updateUserAnnotationColors
                                }
                                updateUserService={this.updateUserService}
                                userGithubAccountsExists={this.state.userGithubAccountsExists}
                                serviceStatusHandler={this.serviceStatusHandler}
                                changeShownHint={this.changeShownHint}
                                sectionToggler={this.sectionToggler}
                                userDataSourceAddHandler={
                                    this.userDataSourceAddHandler
                                }
                                userDataSourceDeleteHandler={
                                    this.userDataSourceDeleteHandler
                                }
                                userDataSourceUpdateHandler={
                                    this.userDataSourceUpdateHandler
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
                        "is_ds_apple_podcast_annotation_enabled" ? (
                            <Apple
                                {...this.state}
                                {...this.props}
                                closeModal={() => {
                                    this.setState({
                                        dsKey: "",
                                        dsKeySkip: ""
                                    });
                                }}
                                updateUserAnnotationColors={
                                    this.updateUserAnnotationColors
                                }
                                updateUserService={this.updateUserService}
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
                        "is_ds_youtube_tracking_enabled" ? (
                            <Youtube
                                {...this.state}
                                {...this.props}
                                closeModal={() => {
                                    this.setState({
                                        dsKey: "",
                                        dsKeySkip: ""
                                    });
                                }}
                                updateUserAnnotationColors={
                                    this.updateUserAnnotationColors
                                }
                                updateUserService={this.updateUserService}
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
                        "is_ds_twitter_tracking_enabled" ? (
                            <Twitter
                                {...this.state}
                                {...this.props}
                                closeModal={() => {
                                    this.setState({
                                        dsKey: "",
                                        dsKeySkip: ""
                                    });
                                }}
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
                        "is_ds_facebook_tracking_enabled" ? (
                            <Facebook
                                {...this.state}
                                {...this.props}
                                closeModal={() => {
                                    this.setState({
                                        dsKey: "",
                                        dsKeySkip: ""
                                    });
                                }}
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
                        "is_ds_instagram_tracking_enabled" ? (
                            <Instagram
                                {...this.state}
                                {...this.props}
                                closeModal={() => {
                                    this.setState({
                                        dsKey: "",
                                        dsKeySkip: ""
                                    });
                                }}
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
                        )  : this.state.dsKey ===
                        "is_ds_google_tag_manager_enabled" ? (
                            <GoogleTagManager
                                {...this.state}
                                {...this.props}
                                closeModal={() => {
                                    this.setState({
                                        dsKey: "",
                                        dsKeySkip: ""
                                    });
                                }}
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
        this.setState({isBusy: true});
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
                    this.setState({isBusy: false, errors: err.response.data});
                    status = false;
                },
                this
            )
            .catch((err) => {
                this.setState({isBusy: false, errors: err});
                status = false;
            });

        // userInstagramAccountsExists
        this.setState({isBusy: true});
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
                    this.setState({isBusy: false, errors: err.response.data});
                    status = false;
                },
                this
            )
            .catch((err) => {
                this.setState({isBusy: false, errors: err});
                status = false;
            });

        //userTwitterAccountsExists
        this.setState({isBusy: true});
        HttpClient.get("/data-source/user-twitter-accounts-exists", {})
            .then(
                (resp) => {
                    if (resp.data.exists) {
                        this.setState({
                            isBusy: false,
                            errors: undefined,
                            userTwitterAccountsExists: true,
                        });
                    }
                },
                (err) => {
                    this.setState({isBusy: false, errors: err.response.data});
                    status = false;
                },
                this
            )
            .catch((err) => {
                this.setState({isBusy: false, errors: err});
                status = false;
            });
    }

    checkUserBitbucketAccount() {
        // userBitbucketAccountsExists
        this.setState({isBusy: true});
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
                        Toast.fire({
                            icon: 'error',
                            title: "BitBucket Error: " + resp.data.error
                        });
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
                    this.setState({isBusy: false, errors: err.response.data});
                    status = false;
                },
                this
            )
            .catch((err) => {
                this.setState({isBusy: false, errors: err});
                status = false;
            });
    }

    checkUserGithubAccount() {
        // userGithubAccountsExists
        this.setState({isBusy: true});
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
                        Toast.fire({
                            icon: 'error',
                            title: "Github Error: " + resp.data.error
                        });
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
                    this.setState({isBusy: false, errors: err.response.data});
                    status = false;
                },
                this
            )
            .catch((err) => {
                this.setState({isBusy: false, errors: err});
                status = false;
            });
    }

    updateUserService(e) {
        HttpClient.post("/userService", {
            [e.target.name]: e.target.checked ? 1 : 0,
        })
            .then(
                (resp) => {
                    if (e.target.name === 'wordpress_updates') {
                        Toast.fire({
                            icon: 'success',
                            title: "Successfully saved wordpress updates settings.",
                        });
                    }
                    switch (e.target.name) {
                        case "is_ds_twitter_tracking_enabled":
                            if (resp.data.twitter_accounts > 0) {
                                this.setState({
                                    userServices: resp.data.user_services,
                                });
                                if (
                                    resp.data.user_services[e.target.name] == 1
                                ) {
                                    Toast.fire({
                                        icon: 'success',
                                        title: "Service activated successfully."
                                    });
                                }
                                if (
                                    resp.data.user_services[e.target.name] == 0
                                ) {
                                    Toast.fire({
                                        icon: 'info',
                                        title: "Service deactivated successfully."
                                    });
                                }
                            } else {
                                swal.fire({
                                    iconHtml: '<img src="/images/svg/twitter.svg">',
                                    popup: "twitterAlert",
                                    showCloseButton: true,
                                    title: "Connect with Twitter",
                                    text: "Connect your Twitter account to create automatic annotations",
                                    confirmButtonClass: "rounded-pill btn btn-primary bg-primary px-4 font-weight-bold",
                                    confirmButtonText: "<a href='/socialite/twitter' class='text-white'><i class='mr-2 fa fa-twitter'> </i>" + "Connect twitter Account</a>",
                                    customClass: {
                                        popup: "popupAlert",
                                        closeButton: "closeButtonTwitterAlert",
                                    },
                                });
                            }
                            break;

                        default:
                            if (resp.data.user_services[e.target.name] == 1 && e.target.name !== 'is_ds_facebook_tracking_enabled') {
                                Toast.fire({
                                    icon: 'success',
                                    title: "Service activated successfully."
                                });
                            }
                            if (resp.data.user_services[e.target.name] == 0) {
                                Toast.fire({
                                    icon: 'info',
                                    title: "Service deactivated successfully."
                                });
                            }
                            this.setState({
                                userServices: resp.data.user_services,
                            });
                            break;
                    }

                    this.props.reloadUser();
                },
                (err) => {
                    this.setState({isBusy: false, errors: err.response.data});
                    if (err.response.status == 402) {
                        if (e.target.name === 'is_ds_google_alerts_enabled') {
                            this.props.upgradePopup('news-alert')
                        }

                        if (e.target.name === 'is_ds_keyword_tracking_enabled') {
                            this.props.upgradePopup('rank-tracking')
                        }

                        if (e.target.name === 'is_ds_weather_alerts_enabled' || e.target.name === 'is_ds_google_algorithm_updates_enabled') {
                            this.props.upgradePopup('increase-limits')
                        }

                        if (e.target.name === 'is_ds_twitter_tracking_enabled') {
                            this.props.upgradePopup('social-media')
                        }
                        if (e.target.name === 'is_ds_youtube_tracking_enabled') {
                            this.props.upgradePopup('social-media')
                        }

                        if (e.target.name === 'is_ds_apple_podcast_annotation_enabled') {
                            this.props.upgradePopup('podcast-trackers')
                        }

                        if (e.target.name === 'is_ds_github_tracking_enabled' || e.target.name === 'is_ds_bitbucket_tracking_enabled') {
                            this.props.upgradePopup('more-repositories')
                        }

                        if (e.target.name === 'is_ds_retail_marketing_enabled' || e.target.name === 'is_ds_holidays_enabled') {
                            this.props.upgradePopup('more-annotations')
                        }

                        if (e.target.name === 'is_ds_web_monitors_enabled') {
                            this.props.upgradePopup('website-monitoring-limit')
                        }

                        if (e.target.name === 'is_ds_shopify_annotation_enabled') {
                            this.props.upgradePopup('more-annotations')
                        }
                    }
                }
            )
            .catch((err) => {
                this.setState({isBusy: false, errors: err});
            });
    }

    upgradePopupForRankTracking() {
        this.props.upgradePopup('rank-tracking')
    }

    serviceStatusHandler(e) {
        if (this.props.user.price_plan.name == 'Trial Ended') {
            if (e.target.name === 'is_ds_keyword_tracking_enabled') {
                this.props.upgradePopup('rank-tracking-access')
            }
            if (e.target.name === 'is_ds_google_alerts_enabled') {
                this.props.upgradePopup('news-alert')
            }

            if (e.target.name === 'is_ds_keyword_tracking_enabled') {
                this.props.upgradePopup('rank-tracking-access')
            }

            if (e.target.name === 'is_ds_weather_alerts_enabled' || e.target.name === 'is_ds_google_algorithm_updates_enabled') {
                this.props.upgradePopup('integrations')
            }

            if (e.target.name === 'is_ds_twitter_tracking_enabled') {
                this.props.upgradePopup('social-media')
            }

            if (e.target.name === 'is_ds_facebook_tracking_enabled') {
                this.props.upgradePopup('social-media')
            }
            if (e.target.name === 'is_ds_youtube_tracking_enabled') {
                this.props.upgradePopup('social-media')
            }

            if (e.target.name === 'is_ds_apple_podcast_annotation_enabled') {
                this.props.upgradePopup('integrations')
            }

            if (e.target.name === 'is_ds_github_tracking_enabled' || e.target.name === 'is_ds_bitbucket_tracking_enabled') {
                this.props.upgradePopup('integrations')
            }

            if (e.target.name === 'is_ds_retail_marketing_enabled' || e.target.name === 'is_ds_holidays_enabled') {
                this.props.upgradePopup('integrations')
            }

            if (e.target.name === 'is_ds_web_monitors_enabled') {
                this.props.upgradePopup('website-monitoring-upgrade')
            }

            if (e.target.name === 'is_ds_shopify_annotation_enabled') {
                this.props.upgradePopup('integrations')
            }

        } else {
            if (this.props.user.price_plan.has_data_sources) {
                if (e.persist) {
                    e.persist();
                }

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
                    e.target.name == "is_ds_shopify_annotation_enabled" &&
                    e.target.checked
                ) {
                    this.sectionToggler(null);
                    this.updateUserService(e);
                } else if (
                    e.target.name == "is_ds_shopify_annotation_enabled" &&
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
                    e.target.name == "is_ds_youtube_tracking_enabled" &&
                    e.target.checked
                ) {
                    this.sectionToggler("youtube_tracking");
                    this.updateUserService(e);
                } else if (
                    e.target.name == "is_ds_youtube_tracking_enabled" &&
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
                            text: "Connect your Instagram account to create automatic annotations for new posts; when you reach a post goal or run campaigns.",
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
                            text: "Connect your Facebook account to create automatic annotations for new posts; when you reach a post goal or run campaigns.",
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
                            iconHtml: '<img src="/bitbucket-small.svg">',
                            showCloseButton: true,
                            title: "Connect with Bitbucket",
                            text: "Connect your Bitbucket account to create automatic annotations for commits",
                            confirmButtonClass: "rounded-pill btn btn-primary bg-primary px-4 font-weight-bold",
                            confirmButtonText: "<a href='/socialite/bitbucket' class='text-white'><i class='mr-2 fa fa-bitbucket'> </i>" + "Connect Bitbucket Account</a>",
                            customClass: {
                                htmlContainer: "py-3",
                            },
                            customClass: {
                                popup: "popupAlert",
                                closeButton: "closeButtonTwitterAlert",
                            },
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
                            iconHtml: '<img src="/github-small.svg">',
                            showCloseButton: true,
                            title: "Connect with Github",
                            text: "Connect your github account to create automatic annotations for commits",
                            confirmButtonClass: "rounded-pill btn btn-primary bg-primary px-4 font-weight-bold",
                            confirmButtonText: "<a href='/socialite/github' class='text-white'><i class='mr-2 fa fa-github'> </i>" + "Connect Github Account</a>",
                            customClass: {
                                htmlContainer: "py-3",
                            },
                            customClass: {
                                popup: "popupAlert",
                                closeButton: "closeButtonTwitterAlert",
                            },
                        });
                    }
                } else if (
                    e.target.name == "is_ds_github_tracking_enabled" &&
                    !e.target.checked
                ) {
                    this.sectionToggler(null);
                    this.updateUserService(e);
                }

                if (
                    e.target.name == "is_ds_twitter_tracking_enabled" &&
                    e.target.checked
                ) {
                    if (this.state.userTwitterAccountsExists) {
                        this.sectionToggler("twitter_tracking");
                        this.updateUserService(e, this);
                    } else {
                        swal.fire({
                            customClass: {
                                htmlContainer: "py-3",
                            },
                            showCloseButton: true,
                            title: "Connect with Twitter",
                            text: "Connect your Twitter account to create automatic annotations for new posts; when you reach a post goal or run campaigns.",
                            confirmButtonClass:
                                "rounded-pill btn btn-primary bg-primary px-4 font-weight-bold",
                            confirmButtonText:
                                "<a href='/socialite/twitter' class='text-white'><i class='mr-2 fa fa-twitter'> </i>" +
                                "Connect Twitter Account</a>",
                        });
                    }
                } else if (
                    e.target.name == "is_ds_twitter_tracking_enabled" &&
                    !e.target.checked
                ) {
                    this.sectionToggler(null);
                    this.updateUserService(e);
                }
                // if (e.target.name == "is_ds_twitter_tracking_enabled") {
                //     this.updateUserService(e);
                //     this.sectionToggler(
                //         e.target.checked ? "twitter_tracking" : null
                //     );
                // }
            } else {
                if (e.target.name === 'is_ds_keyword_tracking_enabled') {
                    this.props.upgradePopup('rank-tracking-access')
                }
                if (e.target.name === 'is_ds_google_alerts_enabled') {
                    this.props.upgradePopup('news-alert')
                }

                if (e.target.name === 'is_ds_keyword_tracking_enabled') {
                    this.props.upgradePopup('rank-tracking-access')
                }

                if (e.target.name === 'is_ds_weather_alerts_enabled' || e.target.name === 'is_ds_google_algorithm_updates_enabled') {
                    this.props.upgradePopup('integrations')
                }

                if (e.target.name === 'is_ds_twitter_tracking_enabled') {
                    this.props.upgradePopup('social-media')
                }
                if (e.target.name === 'is_ds_youtube_tracking_enabled') {
                    this.props.upgradePopup('social-media')
                }

                if (e.target.name === 'is_ds_apple_podcast_annotation_enabled') {
                    this.props.upgradePopup('integrations')
                }

                if (e.target.name === 'is_ds_github_tracking_enabled' || e.target.name === 'is_ds_bitbucket_tracking_enabled') {
                    this.props.upgradePopup('integrations')
                }

                if (e.target.name === 'is_ds_retail_marketing_enabled' || e.target.name === 'is_ds_holidays_enabled') {
                    this.props.upgradePopup('integrations')
                }

                if (e.target.name === 'is_ds_web_monitors_enabled') {
                    this.props.upgradePopup('website-monitoring-upgrade')
                }

                if (e.target.name === 'is_ds_shopify_annotation_enabled') {
                    this.props.upgradePopup('integrations')
                }
            }
            if (
                e.target.name == "is_ds_wordpress_enabled" &&
                e.target.checked
            ) {
                this.sectionToggler("wordpress"); // not sure about the parameter "wordpress", it was old logic
                this.updateUserService(e);
            } else if (
                e.target.name == "is_ds_wordpress_enabled" &&
                !e.target.checked
            ) {
                this.sectionToggler(null);
                this.updateUserService(e);
            }
        }
    }


    userDataSourceAddAllHandler(dataSources, dsCode = null) {
        this.setState({isBusy: true});

        HttpClient.post("/data-source/user-data-sources", {data: dataSources, ga_property_id: this.state.ga_property_id})
            .then(
                (resp) => {
                    Toast.fire({
                        icon: 'success',
                        title: "Successfully added.",
                    });
                    this.loadUserDataSources();
                },
                (err) => {
                    this.setState({isBusy: false, errors: err.response.data});
                }
            )
            .catch((err) => {
                this.setState({isBusy: false, errors: err});
            });
    }

    userDataSourceAddHandler(dataSource, gaPropertyId = null) {
        this.setState({isBusy: true});
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
            ga_property_id: gaPropertyId ? gaPropertyId : this.state.ga_property_id,
            workspace: dataSource.workspace,
        };
        HttpClient.post("/data-source/user-data-source", formData)
            .then(
                (resp) => {
                    let uds = resp.data.user_data_source;
                    let ar = this.state.userDataSources[uds.ds_code];
                    if (uds.ds_code == "wordpress_updates") {
                        Toast.fire({
                            icon: 'success',
                            title: "Successfully saved wordpress updates settings.",
                        });
                    }

                    if (uds.ds_code == "holidays") {
                        Toast.fire({
                            icon: 'success',
                            title: "Successfully saved holidays settings.",
                        });
                    }

                    if (uds.ds_code == "retail_marketings") {
                        Toast.fire({
                            icon: 'success',
                            title: "Successfully saved dates for retail marketing settings.",
                        });
                    }

                    if (uds.ds_code == "google_algorithm_update_dates") {
                        Toast.fire({
                            icon: 'success',
                            title: "Successfully saved google update settings.",
                        });
                    }

                    if (uds.ds_code == "google_algorithm_update_dates") {
                        ar = [uds];
                    } else {
                        ar.push(uds);
                    }

                    if (
                        dataSource.code == "bitbucket_tracking" ||
                        dataSource.code == "github_tracking"
                    )
                        Toast.fire({
                            icon: 'success',
                            title: "Repository Connected."
                        });
                    this.setState({
                        userDataSources: {
                            ...this.state.userDataSources,
                            [uds.ds_code]: ar,
                        },
                        isBusy: false,
                        errors: undefined,
                    });
                    this.loadUserDataSources();
                },
                (err) => {
                    this.setState({isBusy: false, errors: err.response.data});

                    if (err.response.status === 422) {
                        if (this.state.dsKey === 'is_ds_google_alerts_enabled') {
                            this.props.upgradePopup('news-alert')
                        }

                        if (this.state.dsKey === 'is_ds_keyword_tracking_enabled') {
                            this.props.upgradePopup('rank-tracking')
                        }

                        if (this.state.dsKey === 'is_ds_weather_alerts_enabled' || this.state.dsKey === 'is_ds_google_algorithm_updates_enabled') {
                            this.props.upgradePopup('increase-limits')
                        }

                        if (this.state.dsKey === 'is_ds_twitter_tracking_enabled') {
                            this.props.upgradePopup('social-media')
                        }
                        if (this.state.dsKey === 'is_ds_youtube_tracking_enabled') {
                            this.props.upgradePopup('social-media')
                        }

                        if (this.state.dsKey === 'is_ds_apple_podcast_annotation_enabled') {
                            this.props.upgradePopup('podcast-trackers')
                        }

                        if (this.state.dsKey === 'is_ds_github_tracking_enabled' || this.state.dsKey === 'is_ds_bitbucket_tracking_enabled') {
                            this.props.upgradePopup('more-repositories')
                        }

                        if (this.state.dsKey === 'is_ds_retail_marketing_enabled' || this.state.dsKey === 'is_ds_holidays_enabled') {
                            this.props.upgradePopup('more-annotations')
                        }

                        if (this.state.dsKey === 'is_ds_web_monitors_enabled') {
                            this.props.upgradePopup('website-monitoring-limit')
                        }

                        if (this.state.dsKey === 'is_ds_shopify_annotation_enabled') {
                            this.props.upgradePopup('more-annotations')
                        }
                    }
                    if (err.response.status === 400) {
                        Toast.fire({
                            icon: 'error',
                            title: err.response.data.message,
                        });
                    }
                }
            )
            .catch((err) => {
                this.setState({isBusy: false, errors: err});
            });
    }

    userDataSourceUpdateHandler(userDataSourceId, gaPropertyId) {
        this.setState({ isBusy: true });
        HttpClient.put(`/data-source/user-data-source/${userDataSourceId}`, { gaPropertyId }).then(resp => {
            this.loadUserDataSources();
        }, (err) => {
            this.setState({ isBusy: true, errors: err.response.data })
        }).catch(err => {
            this.setState({ isBusy: true, errors: err })
        })
    }

    userDataSourceDeleteHandler(userDataSourceId, dsCode) {
        this.setState({isBusy: true});
        HttpClient.delete(`/data-source/user-data-source/${userDataSourceId}`)
            .then(
                (resp) => {
                    let ar = this.state.userDataSources[dsCode];
                    if (dsCode == "wordpress_updates") {
                        Toast.fire({
                            icon: 'success',
                            title: "Successfully saved wordpress updates settings.",
                        });
                    }
                    if (dsCode == "google_algorithm_update_dates") {
                        Toast.fire({
                            icon: 'success',
                            title: "Successfully saved google update settings.",
                        });
                    }

                    let newAr = ar.filter((a) => a.id != userDataSourceId);
                    if (
                        dsCode == "bitbucket_tracking" ||
                        dsCode == "github_tracking"
                    )
                        Toast.fire({
                            icon: 'info',
                            title: "Repository Disconnected."
                        });
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
                    this.setState({isBusy: false, errors: err.response.data});
                }
            )
            .catch((err) => {
                this.setState({isBusy: false, errors: err});
            });
    }

    onUncheckAllCallback(userDataSourceIds, dsCode) {
        this.setState({isBusy: true});
        HttpClient.post(`/data-source/user-data-sources/delete`, {userDataSourceIds})
            .then(
                (resp) => {
                    Toast.fire({
                        icon: 'success',
                        title: "Successfully removed.",
                    });
                    this.loadUserDataSources();
                },
                (err) => {
                    this.setState({isBusy: false, errors: err.response.data});
                }
            )
            .catch((err) => {
                this.setState({isBusy: false, errors: err});
            });
    }

    changeShownHint(obj) {
        this.setState({showHintFor: obj});
    }

    sectionToggler(sectionName) {
        if (null == sectionName) {
            this.setState({sectionName: null});
        } else if (this.state.sectionName == sectionName) {
            this.setState({sectionName: null});
            window.scrollTo({top: 0, behavior: "smooth"});
        } else {
            this.setState({sectionName: sectionName});
            window.scrollTo({top: 0, behavior: "smooth"});
        }
    }
}

export default AppsMarket;
