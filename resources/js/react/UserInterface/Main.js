import React from 'react';
import { Switch, Route, Redirect } from "react-router-dom";
import * as PusherPushNotifications from "@pusher/push-notifications-web";

import HttpClient from "./utils/HttpClient";

import Sidebar from "./layout/Sidebar";
import Header from "./layout/Header";
import Footer from "./layout/Footer"

import AnnotationsCreate from './components/annotations/CreateAnnotation';
import AnnotationsUpdate from './components/annotations/EditAnnotation';
import IndexAnnotations from './components/annotations/IndexAnnotation';
import AnnotationsUpload from './components/annotations/UploadAnnotation';
import IndexPricingPlans from './components/settings/pricingPlans/IndexPricingPlans';
import Settings from './components/settings/IndexSettings';
import Profile from './components/settings/Profile';
import PaymentHistory from './components/settings/pricingPlans/PaymentHistory';
import Accounts from './components/settings/Accounts';
import FacebookAccounts from './components/settings/facebookaccounts/FacebookAccountsIndex';
import UserDevices from './components/settings/devices/UserDevicesIndex';
import DataSourceIndex from "./components/DataSource/DataSourceIndex";
import IndexAPIKey from './components/apiKey/IndexAPIKey';
import CreatePayment from './components/settings/pricingPlans/CreatePayment';
import IntegrationsIndex from "./components/integrations/IntegrationsIndex";
import MyIntegrationsIndex from "./components/integrations/MyIntegrationsIndex";
import SupportIndex from './components/support/supportIndex';
import IndexUsers from './components/settings/user/IndexUsers';
import CreateUser from './components/settings/user/CreateUser';
import EditUser from './components/settings/user/EditUser';
import IndexNotificationSettings from "./components/NotificationSettings/IndexNotificationSettingsComponent";
import AnalyticsAndBusinessIntelligenceIndex from './components/analyticsAndBusinessIntelligence/Index';
import CreatePaymentDetail from './components/settings/CreatePaymentDetail';
import StartupChecklist from './helpers/StartupChecklist';
import UserStartupConfigurationModal from './helpers/UserStartupConfigurationModal';
import AddNewPasswordModal from './helpers/AddNewPasswordModal';
import InterfaceTour from './helpers/InterfaceTour';
import IndexDashboard from './components/dashboard/IndexDashboard';
import IndexAnalytics from './components/dashboard/analytics/IndexAnalytics';
import IndexSearchConsole from './components/dashboard/searchConsole/IndexSearchConsole';
import SiteRenamedTopNotice from './utils/SiteRenamedTopNotice';
import PromotionPopup from './utils/PromotionPopup';
import UserRegistrationOffer from './utils/UserRegistrationOffer';
import TimerPromotionPopup from './utils/TimerPromotionPopup';
import CustomPricePlan from './components/settings/pricingPlans/CustomPricePlan'
import AppsMarket from './components/AppsMarket/AppsMarket'
import AppsModal from './components/AppsMarket/AppsModal';
import ModalHeader from './components/AppsMarket/common/ModalHeader';
import { Modal, ModalBody } from 'reactstrap';

class Main extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            user: undefined,
            showStartupConfiguration: false,
            showInterfaceTour: false,
            showPasswordPopup: false,
            showDataSourceTour: false,
            showPromotionPopup: false,
            showTimerPromotionPopup: false,
            mKeyAnnotation: '',
            showUpgradePopup: false,
            upgradePopupType: '',
        }
        this.loadUser = this.loadUser.bind(this)

        // this.toggleStartupConfiguration = this.toggleStartupConfiguration.bind(this);
        this.toggleInterfaceTour = this.toggleInterfaceTour.bind(this);
        this.toggleDataSourceTour = this.toggleDataSourceTour.bind(this);
        this.togglePromotionPopup = this.togglePromotionPopup.bind(this);
        this.toggleTimerPromotionPopup = this.toggleTimerPromotionPopup.bind(this);
        this.extendTrial = this.extendTrial.bind(this);
    }

    toggleStartupConfiguration() { this.setState({ showStartupConfiguration: !this.state.showStartupConfiguration, showInterfaceTour: !this.state.showInterfaceTour }); }
    toggleInterfaceTour(keepInterfaceTour = false) {
        // If the user has alive registration offers and interface tour is showing
        if (this.state.user.user_registration_offers.length && this.state.showInterfaceTour) {
            setTimeout(() => { this.setState({ showTimerPromotionPopup: true }); }, 60000);
        }
        this.setState({ showInterfaceTour: !this.state.showInterfaceTour, showDataSourceTour: !this.state.showDataSourceTour });
        this.loadUser(false, keepInterfaceTour, false);
    }
    toggleDataSourceTour() { this.setState({ showDataSourceTour: !this.state.showDataSourceTour }); this.loadUser(false, false, false); }
    togglePromotionPopup() { this.setState({ showPromotionPopup: !this.state.showPromotionPopup }); }
    toggleTimerPromotionPopup() { this.setState({ showTimerPromotionPopup: !this.state.showTimerPromotionPopup }); }

    extendTrial() {
        HttpClient.post('extend-trial')
            .then(response => {
                swal.fire(
                    "Extended",
                    response.data.message,
                    "success"
                );
                this.loadUser();
            });
    }

    render() {
        if (this.state.user == undefined) return null;

        if ([
            "/settings",
            "/settings/price-plans",
            "/settings/price-plans/payment",
            "/settings/payment-history",
            "/settings/payment-detail/create",
        ].indexOf(this.props.location.pathname) == -1 && this.state.user.price_plan.name == "Trial Ended") {
            return <Redirect to={"/settings/price-plans"} />
        }

        if (["/settings/change-password"].indexOf(this.props.location.pathname) == -1 && this.state.user.do_require_password_change == true) {
            return <Redirect to={"/settings/change-password"} />
        }
        return (

            <React.Fragment>
                <div className="sidebar">
                    {/* <UserStartupConfigurationModal isOpen={this.state.showStartupConfiguration} toggleShowTour={this.toggleStartupConfiguration} /> */}
                    <AddNewPasswordModal show={this.state.showPasswordPopup} user={this.state.user} />

                    {/* <InterfaceTour isOpen={this.state.showInterfaceTour} toggleShowTour={this.toggleInterfaceTour} /> */}

                    {/*<UserStartupConfigurationModal closeModal={() => this.setState({showStartupConfiguration: false})} isOpen={this.state.showStartupConfiguration} user={this.state.user} />*/}

                    <Sidebar openAnnotationPopup={(mka) => { this.setState({ mKeyAnnotation: mka }); }} user={this.state.user} reloadUser={this.loadUser} toggleInterfaceTour={this.toggleInterfaceTour} />
                </div>
                {/* <PromotionPopup show={this.state.showPromotionPopup} togglePopupCallback={this.togglePromotionPopup} promotionLink="https://appsumo.8odi.net/crystal-ball" promotionImage="/images/crystal-ball-promotion.jpg" /> */}
                <div className="page-container">
                    <SiteRenamedTopNotice show={true} />
                    {this.state.user.user_registration_offers.map(uRO => <React.Fragment key={uRO.id}>
                        <TimerPromotionPopup show={this.state.showTimerPromotionPopup} togglePopupCallback={this.toggleTimerPromotionPopup} promotionLink="/settings/price-plans" promotionImage="/images/50-off-24-hours.jpg" userRegistrationOffer={uRO} />
                        <UserRegistrationOffer userRegistrationOffer={uRO} show={!!uRO} />
                    </React.Fragment>)}
                    <div className="header navbar">
                        <Header user={this.state.user} extendTrial={this.extendTrial} />
                    </div>
                    <main className="main-content bgc-grey-100">
                        <Switch>
                            <Route exact path="/ga-accounts" refresh={true}>
                                <IndexDashboard upgradePopup={(popupType) => this.setState({showUpgradePopup: true, upgradePopupType: popupType})} user={this.state.user} />
                            </Route>
                            <Route exact path="/settings/analytics-accounts" refresh={true}>
                                <IndexDashboard upgradePopup={(popupType) => this.setState({showUpgradePopup: true, upgradePopupType: popupType})} user={this.state.user} />
                            </Route>
                            <Route exact path="/dashboard/analytics" refresh={true}>
                                <IndexAnalytics upgradePopup={(popupType) => this.setState({showUpgradePopup: true, upgradePopupType: popupType})} user={this.state.user} />
                            </Route>
                            <Route exact path="/dashboard/search-console" refresh={true}>
                                <IndexSearchConsole upgradePopup={(popupType) => this.setState({showUpgradePopup: true, upgradePopupType: popupType})} user={this.state.user} />
                            </Route>

                            <Route exact path="/annotation" refresh={true}>
                                <IndexAnnotations upgradePopup={(popupType) => this.setState({showUpgradePopup: true, upgradePopupType: popupType})} openAnnotationPopup={(mka) => {this.setState({mKeyAnnotation: mka});}} user={this.state.user} mKeyAnnotation={this.state.mKeyAnnotation} />
                            </Route>
                            <Route exact path="/annotation/create" refresh={true}>
                                <AnnotationsCreate upgradePopup={(popupType) => this.setState({showUpgradePopup: true, upgradePopupType: popupType})} currentPricePlan={this.state.user.price_plan} />
                            </Route>
                            <Route exact path="/annotation/:id?/edit" refresh={true} render={(routeParams) =>
                                <AnnotationsUpdate upgradePopup={(popupType) => this.setState({showUpgradePopup: true, upgradePopupType: popupType})} routeParams={routeParams} currentPricePlan={this.state.user.price_plan} />}
                            >
                            </Route>
                            <Route exact path="/api-key" refresh={true}>
                                <IndexAPIKey upgradePopup={(popupType) => this.setState({showUpgradePopup: true, upgradePopupType: popupType})} currentPricePlan={this.state.user.price_plan} />
                            </Route>
                            <Route exact path="/annotation/upload" refresh={true}>
                                <AnnotationsUpload upgradePopup={(popupType) => this.setState({showUpgradePopup: true, upgradePopupType: popupType})} currentPricePlan={this.state.user.price_plan} />
                            </Route>
                            <Route exact path="/data-source" refresh={true}>
                                <AppsMarket upgradePopup={(popupType) => this.setState({showUpgradePopup: true, upgradePopupType: popupType})} user={this.state.user} reloadUser={this.loadUser} showDataSourceTour={this.state.showDataSourceTour} toggleDataSourceTour={this.toggleDataSourceTour} />
                                {/* <DataSourceIndex user={this.state.user} reloadUser={this.loadUser} showDataSourceTour={this.state.showDataSourceTour} toggleDataSourceTour={this.toggleDataSourceTour} /> */}
                            </Route>
                            <Route exact path="/data-source-old" refresh={true}>
                                <DataSourceIndex upgradePopup={(popupType) => this.setState({showUpgradePopup: true, upgradePopupType: popupType})} user={this.state.user} reloadUser={this.loadUser} showDataSourceTour={this.state.showDataSourceTour} toggleDataSourceTour={this.toggleDataSourceTour} />
                            </Route>
                            <Route exact path="/integrations" refresh={true}>
                                <IntegrationsIndex upgradePopup={(popupType) => this.setState({showUpgradePopup: true, upgradePopupType: popupType})} user={this.state.user} />
                            </Route>
                            <Route exact path="/my-integrations" refresh={true}>
                                <MyIntegrationsIndex upgradePopup={(popupType) => this.setState({showUpgradePopup: true, upgradePopupType: popupType})} user={this.state.user} />
                            </Route>
                            <Route exact path="/analytics-and-business-intelligence" refresh={true}>
                                <AnalyticsAndBusinessIntelligenceIndex upgradePopup={(popupType) => this.setState({showUpgradePopup: true, upgradePopupType: popupType})} user={this.state.user} />
                            </Route>
                            <Route exact path="/notifications" refresh={true}>
                                <IndexNotificationSettings upgradePopup={(popupType) => this.setState({showUpgradePopup: true, upgradePopupType: popupType})} user={this.state.user} reloadUser={this.loadUser} />
                            </Route>
                            <Route exact path="/settings" refresh={true}>
                                <Settings upgradePopup={(popupType) => this.setState({showUpgradePopup: true, upgradePopupType: popupType})} user={this.state.user} />
                            </Route>
                            <Route exact path="/settings/profile" refresh={true}>
                                <Profile upgradePopup={(popupType) => this.setState({showUpgradePopup: true, upgradePopupType: popupType})} user={this.state.user} reloadUser={this.loadUser} />
                            </Route>
                            <Route exact path="/settings/price-plans" refresh={true}>
                                <IndexPricingPlans upgradePopup={(popupType) => this.setState({showUpgradePopup: true, upgradePopupType: popupType})} user={this.state.user} />
                            </Route>
                            <Route exact path="/settings/price-plans/payment" refresh={true}>
                                <CreatePayment upgradePopup={(popupType) => this.setState({showUpgradePopup: true, upgradePopupType: popupType})} user={this.state.user} />
                            </Route>
                            <Route exact path="/settings/payment-history" refresh={true}>
                                <PaymentHistory upgradePopup={(popupType) => this.setState({showUpgradePopup: true, upgradePopupType: popupType})} user={this.state.user} />
                            </Route>
                            <Route exact path="/settings/payment-detail/create" refresh={true}>
                                <CreatePaymentDetail upgradePopup={(popupType) => this.setState({showUpgradePopup: true, upgradePopupType: popupType})} user={this.state.user} />
                            </Route>
                            <Route exact path="/accounts" refresh={true}>
                                <Accounts upgradePopup={(popupType) => this.setState({showUpgradePopup: true, upgradePopupType: popupType})} user={this.state.user} reloadUser={this.loadUser} />
                            </Route>
                            <Route exact path="/settings/facebook-accounts" refresh={true}>
                                <FacebookAccounts upgradePopup={(popupType) => this.setState({showUpgradePopup: true, upgradePopupType: popupType})} user={this.state.user} reloadUser={this.loadUser} />
                            </Route>
                            <Route exact path="/settings/devices" refresh={true}>
                                <UserDevices upgradePopup={(popupType) => this.setState({showUpgradePopup: true, upgradePopupType: popupType})} user={this.state.user} reloadUser={this.loadUser} />
                            </Route>
                            <Route exact path="/settings/support" refresh={true}>
                                <SupportIndex upgradePopup={(popupType) => this.setState({showUpgradePopup: true, upgradePopupType: popupType})} user={this.state.user} />
                            </Route>
                            <Route exact path="/settings/user" refresh={true}>
                                <IndexUsers upgradePopup={(popupType) => this.setState({showUpgradePopup: true, upgradePopupType: popupType})} user={this.state.user} />
                            </Route>
                            <Route exact path="/settings/user/create" refresh={true}>
                                <CreateUser upgradePopup={(popupType) => this.setState({showUpgradePopup: true, upgradePopupType: popupType})} user={this.state.user} />
                            </Route>
                            <Route exact path="/settings/user/:id?/edit" refresh={true}
                                render={(routeParams) => <EditUser upgradePopup={(popupType) => this.setState({showUpgradePopup: true, upgradePopupType: popupType})} routeParams={routeParams} />}
                            />
                            <Route exact path="/settings/custom-price-plan/:code?" refresh={true} render={(routeParams) =>
                                <CustomPricePlan upgradePopup={(popupType) => this.setState({showUpgradePopup: true, upgradePopupType: popupType})} routeParams={routeParams} currentPricePlan={this.state.user.price_plan} user={this.state.user} />}
                            ></Route>
                        </Switch>
                    </main>
                    <Footer />
                </div>

                {this.state.mKeyAnnotation === 'manual' ?
                    <AppsModal isOpen={this.state.mKeyAnnotation === 'manual' || this.state.mKeyAnnotation === 'upload'} popupSize={'md'} toggle={(mka = '') => { this.setState({ mKeyAnnotation: mka, }); }}>
                        <AnnotationsCreate upgradePopup={(popupType) => this.setState({showUpgradePopup: true, upgradePopupType: popupType})} togglePopup={(mka) => { this.setState({ mKeyAnnotation: mka, }); }} currentPricePlan={this.state.user.price_plan} />
                    </AppsModal>
                    :
                    this.state.mKeyAnnotation === 'upload' ?
                        <AppsModal popupSize={'md csvupload'} isOpen={this.state.mKeyAnnotation === 'manual' || this.state.mKeyAnnotation === 'upload'} toggle={(mka = '') => { this.setState({ mKeyAnnotation: mka, }); }}>
                            <AnnotationsUpload togglePopup={(mka) => { this.setState({ mKeyAnnotation: mka, }); }} currentPricePlan={this.state.user.price_plan} />
                        </AppsModal>
                        :
                        null}

                <Modal isOpen={this.state.showUpgradePopup} centered className="gaUpgradePopup" toggle={() => this.setState({showUpgradePopup: false, upgradePopupType: ''})}>
                    <button onClick={() => this.setState({showUpgradePopup: false, upgradePopupType: ''})} class="btn-closeUpgradePopup"><img src="images/close.svg" alt="close icon" /></button>
                    {this.props.upgradePopupType === 'api-upgrade' ? <ga-upgrade-popup
                        heading={`<h1>Upgrade to access <span>API Functionality</span></h1>`}
                        subHeading={`<p>and get access to all amazing features</p>`}
                        bannerImg="/images/apiFunctionality.svg"
                    >
                    </ga-upgrade-popup> : null}

                    {this.props.upgradePopupType === 'news-alert' ? <ga-upgrade-popup
                        heading={`<h1>Increase your credits limits to add more <span>News Alerts</span></h1>`}
                        subHeading={`<p>Upgrade to get access to all amazing features</p>`}
                        bannerImg="/images/news-upgrade.svg"
                    >
                    </ga-upgrade-popup> : null}

                    {this.props.upgradePopupType === 'rank-tracking-access' ? <ga-upgrade-popup
                        heading={`<h1>Upgrade to access <span>Rank Tracking (SERP)</span></h1>`}
                        subHeading={`<p>and get access to all amazing features</p>`}
                        bannerImg="/images/rank-tracking-upgrade.svg"
                    >
                    </ga-upgrade-popup> : null}

                    {this.props.upgradePopupType === 'rank-tracking' ? <ga-upgrade-popup
                        heading={`<h1>Increase your credits limits to add more <span>Rank Trackers</span></h1>`}
                        subHeading={`<p>Upgrade to get access to all amazing features</p>`}
                        bannerImg="/images/rank-tracking-upgrade.svg"
                    >
                    </ga-upgrade-popup> : null}

                    {this.props.upgradePopupType === 'website-monitoring-upgrade' ? <ga-upgrade-popup
                        heading={`<h1>Upgrade today to add <span>Website Monitors</span></h1>`}
                        subHeading={`<p>and get access to all amazing features</p>`}
                        bannerImg="/images/web-monitor-upgrade.svg"
                    >
                    </ga-upgrade-popup> : null}

                    {this.props.upgradePopupType === 'website-monitoring-limit' ? <ga-upgrade-popup
                        heading={`<h1>Increase your credits limits to add more <span>Website Monitors</span></h1>`}
                        subHeading={`<p>Upgrade to get access to all amazing features</p>`}
                        bannerImg="/images/web-monitor-limit-increase.svg"
                    >
                    </ga-upgrade-popup> : null}

                    {this.props.upgradePopupType === 'add-more-than-one-property' ? <ga-upgrade-popup
                        heading={`<h1>Upgrade to add <span>more than one</span> property</h1>`}
                        subHeading={`<p>and get access to all amazing features</p>`}
                        bannerImg="/images/more-property-upgrade.svg"
                    >
                    </ga-upgrade-popup> : null}

                    {this.props.upgradePopupType === 'add-more-property' ? <ga-upgrade-popup
                        heading={`<h1>Upgrade today to add <span>more properties</span></h1>`}
                        subHeading={`<p>and get access to all amazing features</p>`}
                        bannerImg="/images/more-property-upgrade.svg"
                    >
                    </ga-upgrade-popup> : null}

                    {this.props.upgradePopupType === 'more-users' ? <ga-upgrade-popup
                        heading={`<h1>Upgrade today and add <span>more users</span> to your company account</h1>`}
                        subHeading={`<p>and get access to all amazing features</p>`}
                        bannerImg="/images/more-users.svg"
                    >
                    </ga-upgrade-popup> : null}

                    {this.props.upgradePopupType === 'more-annotations' ? <ga-upgrade-popup
                        heading={`<h1>Upgrade today to add <span>more annotations</span></h1>`}
                        subHeading={`<p>and get access to all amazing features</p>`}
                        bannerImg="/images/more-annotations.svg"
                    >
                    </ga-upgrade-popup> : null}

                    {this.props.upgradePopupType === 'integrations' ? <ga-upgrade-popup
                        heading={`<h1>Upgrade today to access <span>integrations</span></h1>`}
                        subHeading={`<p>and get access to all amazing features</p>`}
                        bannerImg="/images/more-integrations.svg"
                    >
                    </ga-upgrade-popup> : null}

                    {this.props.upgradePopupType === 'get-notifications' ? <ga-upgrade-popup
                        heading={`<h1>Upgrade today to <span>get notifications</span> via Email, SMS, and Push</h1>`}
                        subHeading={`<p>and get access to all amazing features</p>`}
                        bannerImg="/images/get-notifications.svg"
                    >
                    </ga-upgrade-popup> : null}

                    {this.props.upgradePopupType === 'podcast-trackers' ? <ga-upgrade-popup
                        heading={`<h1>Upgrade to add more <span>Podcast Trackers</span></h1>`}
                        subHeading={`<p>and get access to all amazing features</p>`}
                        bannerImg="/images/podcast-trackers.svg"
                    >
                    </ga-upgrade-popup> : null}

                    {this.props.upgradePopupType === 'increase-limits' ? <ga-upgrade-popup
                        heading={`<h1>You’ve reached your plan limits! Upgrade to  <span>increase limits</span></h1>`}
                        subHeading={`<p>and get access to all amazing features</p>`}
                        bannerImg="/images/increase-limits.svg"
                    >
                    </ga-upgrade-popup> : null}

                    {this.props.upgradePopupType === 'more-repositories' ? <ga-upgrade-popup
                        heading={`<h1>Upgrade today to track  <span>more repositories</span></h1>`}
                        subHeading={`<p>and get access to all amazing features</p>`}
                        bannerImg="/images/more-repositories.svg"
                    >
                    </ga-upgrade-popup> : null}

                    {this.props.upgradePopupType === 'social-media' ? <ga-upgrade-popup
                        heading={`<h1>Upgrade today to access  <span>social media</span> tracking and insights</h1>`}
                        subHeading={`<p>and get access to all amazing features</p>`}
                        bannerImg="/images/social-media.svg"
                    >
                    </ga-upgrade-popup> : null}

                    {this.props.upgradePopupType === 'ads-trackers' ? <ga-upgrade-popup
                        heading={`<h1>Upgrade today to add more  <span>Ads Trackers</span></h1>`}
                        subHeading={`<p>and get access to all amazing features</p>`}
                        bannerImg="/images/trackers-ads.svg"
                    >
                    </ga-upgrade-popup> : null}



                </Modal>
            </React.Fragment>
        )
    }

    componentDidMount() {
        const { SVGInjector } = window.SVGInjector
        SVGInjector(document.getElementsByClassName('inject-me'), {
            cacheRequests: false,
            evalScripts: 'once',
            httpRequestWithCredentials: false,
            renumerateIRIElements: false
        })

        let loader = document.getElementById("loader");
        loader.classList.remove("fadeOut")
        this.loadUser();

        window.beamsTokenProvider = new PusherPushNotifications.TokenProvider({
            url: "/beaming/auth",
            queryParams: {
                // someQueryParam: "parameter-content", // URL query params your auth endpoint needs
            },
            headers: {
                // someHeader: "header-content", // Headers your auth endpoint needs
            },
        });
        window.beamsClient = new PusherPushNotifications.Client({
            instanceId: process.env.MIX_PUSHER_BEAMS_INSTANCE_ID || '4d56d4d5-c518-4c90-81ca-9de8913194bc',
        });
    }

    loadUser(keepStartupConfiguration = false, keepInterfaceTour = false, keepDataSourceTour = false) {
        HttpClient.get('/user')
            .then(response => {
                this.setState({
                    user: response.data.user,
                    // These states were in use when user startup configuration wizard was enabled
                    showStartupConfiguration: response.data.user.show_configuration_message,
                    showPasswordPopup: response.data.user.show_password_message,
                    // showInterfaceTour: keepInterfaceTour ? true : (response.data.user.startup_configuration_showed_at !== null && response.data.user.last_login_at == null),
                    // showDataSourceTour: keepDataSourceTour ? true : (response.data.user.startup_configuration_showed_at !== null && response.data.user.last_login_at !== null && response.data.user.data_source_tour_showed_at == null),
                    showInterfaceTour: keepInterfaceTour ? true : (response.data.user.last_login_at == null),
                    showDataSourceTour: keepDataSourceTour ? true : (response.data.user.last_login_at !== null && response.data.user.data_source_tour_showed_at == null),
                });
                loader.classList.add("fadeOut");

                if (response.data.user.last_login_at == null) {
                    gtag('event', 'conversion', { 'send_to': 'AW-645973826/wQD3CJnzvugBEMKOg7QC' });
                    ga('send', {
                        hitType: 'event',
                        eventCategory: 'SignUp',
                        eventAction: 'SignUp',
                        eventLabel: 'SignUp'
                    });
                    fpr("referral", {
                        uid: "{{ Auth::user()->id }}"
                    })
                }

                if (response.data.user.price_plan.name == 'Free') {
                    setTimeout(() => { this.setState({ showPromotionPopup: true }); }, 5000);
                }
            }, (err) => {
                this.setState({ isBusy: false, errors: (err.response).data });
            }).catch(err => {
                this.setState({ isBusy: false, errors: err });
            });
    }

    componentDidUpdate(prevProps) {
        if (this.props.location !== prevProps.location) {
            this.onRouteChanged();
        }
    }

    onRouteChanged() {
        window.scrollTo(0, 0);
        let anchors = document.getElementsByTagName("a");
        for (var i = 0; i < anchors.length; ++i) {
            if (anchors[i].parentElement.localName == "li") {
                anchors[i].classList.remove("link-active")
                anchors[i].parentElement.classList.remove("link-active")
            } else {
                anchors[i].classList.remove("link-active")
            }
        }
        for (var i = 0; i < anchors.length; ++i) {
            if (anchors[i].href == window.location.href) {
                if (anchors[i].parentElement.localName == "li") {
                    anchors[i].classList.add("link-active")
                    anchors[i].parentElement.classList.add("link-active")
                } else {
                    anchors[i].classList.add("link-active")
                }
            }
        }
    }
}
export default Main;
