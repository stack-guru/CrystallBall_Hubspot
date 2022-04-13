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
import ChangePassword from './components/settings/ChangePassword';
import PaymentHistory from './components/settings/pricingPlans/PaymentHistory';
import GoogleAccountIndex from './components/settings/googleAccount/GoogleAccountIndex';
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
import InterfaceTour from './helpers/InterfaceTour';
import IndexDashboard from './components/dashboard/IndexDashboard';
import IndexAnalytics from './components/dashboard/analytics/IndexAnalytics';
import IndexSearchConsole from './components/dashboard/searchConsole/IndexSearchConsole';
import SiteRenamedTopNotice from './utils/SiteRenamedTopNotice';
import { IsDomain } from './helpers/CommonFunctions';
import PromotionPopup from './utils/PromotionPopup';
import UserRegistrationOffer from './utils/UserRegistrationOffer';
import TimerPromotionPopup from './utils/TimerPromotionPopup';

class Main extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            user: undefined,
            showStartupConfiguration: false,
            showInterfaceTour: false,
            showDataSourceTour: false,
            showPromotionPopup: false,
            showTimerPromotionPopup: false
        }
        this.loadUser = this.loadUser.bind(this)

        // this.toggleStartupConfiguration = this.toggleStartupConfiguration.bind(this);
        this.toggleInterfaceTour = this.toggleInterfaceTour.bind(this);
        this.toggleDataSourceTour = this.toggleDataSourceTour.bind(this);
        this.togglePromotionPopup = this.togglePromotionPopup.bind(this);
        this.toggleTimerPromotionPopup = this.toggleTimerPromotionPopup.bind(this);
    }

    // toggleStartupConfiguration() { this.setState({ showStartupConfiguration: !this.state.showStartupConfiguration, showInterfaceTour: !this.state.showInterfaceTour }); }
    toggleInterfaceTour(keepInterfaceTour = false) { this.setState({ showInterfaceTour: !this.state.showInterfaceTour, showDataSourceTour: !this.state.showDataSourceTour }); this.loadUser(false, keepInterfaceTour, false); }
    toggleDataSourceTour() { this.setState({ showDataSourceTour: !this.state.showDataSourceTour }); this.loadUser(false, false, false); }
    togglePromotionPopup() { this.setState({ showPromotionPopup: !this.state.showPromotionPopup }); }
    toggleTimerPromotionPopup() { this.setState({ showTimerPromotionPopup: !this.state.showTimerPromotionPopup }); }

    render() {
        if (this.state.user == undefined) return null;

        if (["/settings/price-plans", "/settings/price-plans/payment"].indexOf(this.props.location.pathname) == -1 && this.state.user.price_plan.name == "Trial Ended") {
            return <Redirect to={"/settings/price-plans"} />
        }

        if (["/settings/change-password"].indexOf(this.props.location.pathname) == -1 && this.state.user.do_require_password_change == true) {
            return <Redirect to={"/settings/change-password"} />
        }

        return (

            <React.Fragment>
                <div className="sidebar">
                    {/* <UserStartupConfigurationModal isOpen={this.state.showStartupConfiguration} toggleShowTour={this.toggleStartupConfiguration} /> */}
                    <InterfaceTour isOpen={this.state.showInterfaceTour} toggleShowTour={this.toggleInterfaceTour} />

                    <Sidebar user={this.state.user} reloadUser={this.loadUser} toggleInterfaceTour={this.toggleInterfaceTour} />
                </div>
                {/* <PromotionPopup show={this.state.showPromotionPopup} togglePopupCallback={this.togglePromotionPopup} promotionLink="https://appsumo.8odi.net/crystal-ball" promotionImage="/images/crystal-ball-promotion.jpg" /> */}
                <div className="page-container">
                    <SiteRenamedTopNotice show={IsDomain('app.gaannotations.com') || IsDomain('localhost')} />
                    {this.state.user.user_registration_offers.map(uSC => <React.Fragment key={uSC.id}>
                        <TimerPromotionPopup show={this.state.showTimerPromotionPopup} togglePopupCallback={this.toggleTimerPromotionPopup} promotionLink="/settings/price-plans" promotionImage="/images/50-off-24-hours.jpg" coupon={uSC} />
                        <UserRegistrationOffer coupon={uSC} />
                    </React.Fragment>)}
                    <div className="header navbar">
                        <Header user={this.state.user} />
                    </div>
                    <main className="main-content bgc-grey-100">
                        <Switch>
                            <Route exact path="/analytics" refresh={true}>
                                <IndexDashboard user={this.state.user} />
                            </Route>
                            <Route exact path="/dashboard/analytics" refresh={true}>
                                <IndexAnalytics user={this.state.user} />
                            </Route>
                            <Route exact path="/dashboard/search-console" refresh={true}>
                                <IndexSearchConsole user={this.state.user} />
                            </Route>

                            <Route exact path="/annotation" refresh={true}>
                                <IndexAnnotations user={this.state.user} />
                            </Route>
                            <Route exact path="/annotation/create" refresh={true}>
                                <AnnotationsCreate currentPricePlan={this.state.user.price_plan} />
                            </Route>
                            <Route exact path="/annotation/:id?/edit" refresh={true} render={(routeParams) =>
                                <AnnotationsUpdate routeParams={routeParams} currentPricePlan={this.state.user.price_plan} />}
                            >
                            </Route>
                            <Route exact path="/api-key" refresh={true}>
                                <IndexAPIKey currentPricePlan={this.state.user.price_plan} />
                            </Route>
                            <Route exact path="/annotation/upload" refresh={true}>
                                <AnnotationsUpload currentPricePlan={this.state.user.price_plan} />
                            </Route>
                            <Route exact path="/data-source" refresh={true}>
                                <DataSourceIndex user={this.state.user} reloadUser={this.loadUser} showDataSourceTour={this.state.showDataSourceTour} toggleDataSourceTour={this.toggleDataSourceTour} />
                            </Route>
                            <Route exact path="/integrations" refresh={true}>
                                <IntegrationsIndex user={this.state.user} />
                            </Route>
                            <Route exact path="/my-integrations" refresh={true}>
                                <MyIntegrationsIndex user={this.state.user} />
                            </Route>
                            <Route exact path="/analytics-and-business-intelligence" refresh={true}>
                                <AnalyticsAndBusinessIntelligenceIndex user={this.state.user} />
                            </Route>
                            <Route exact path="/notifications" refresh={true}>
                                <IndexNotificationSettings user={this.state.user} reloadUser={this.loadUser} />
                            </Route>
                            <Route exact path="/settings" refresh={true}>
                                <Settings user={this.state.user} />
                            </Route>
                            <Route exact path="/settings/change-password" refresh={true}>
                                <ChangePassword user={this.state.user} reloadUser={this.loadUser} />
                            </Route>
                            <Route exact path="/settings/price-plans" refresh={true}>
                                <IndexPricingPlans user={this.state.user} />
                            </Route>
                            <Route exact path="/settings/price-plans/payment" refresh={true}>
                                <CreatePayment user={this.state.user} />
                            </Route>
                            <Route exact path="/settings/payment-history" refresh={true}>
                                <PaymentHistory user={this.state.user} />
                            </Route>
                            <Route exact path="/settings/payment-detail/create" refresh={true}>
                                <CreatePaymentDetail user={this.state.user} />
                            </Route>
                            <Route exact path="/settings/google-account" refresh={true}>
                                <GoogleAccountIndex user={this.state.user} reloadUser={this.loadUser} />
                            </Route>
                            <Route exact path="/settings/support" refresh={true}>
                                <SupportIndex user={this.state.user} />
                            </Route>
                            <Route exact path="/settings/user" refresh={true}>
                                <IndexUsers user={this.state.user} />
                            </Route>
                            <Route exact path="/settings/user/create" refresh={true}>
                                <CreateUser user={this.state.user} />
                            </Route>
                            <Route exact path="/settings/user/:id?/edit" refresh={true}
                                render={(routeParams) => <EditUser routeParams={routeParams} />}
                            />
                        </Switch>
                    </main>
                    <Footer />
                </div>
                {/* <StartupChecklist lastStartupConfigurationShowedAt={this.state.user.startup_configuration_showed_at} /> */}
            </React.Fragment>

        )
    }

    componentDidMount() {

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
            instanceId: process.env.MIX_PUSHER_BEAMS_INSTANCE_ID,
        });
    }

    loadUser(keepStartupConfiguration = false, keepInterfaceTour = false, keepDataSourceTour = false) {
        HttpClient.get('/user')
            .then(response => {
                this.setState({
                    user: response.data.user,
                    // These states were in use when user startup configuration wizard was enabled
                    // showStartupConfiguration: keepStartupConfiguration ? true : (response.data.user.startup_configuration_showed_at == null),
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
                }

                if (response.data.user.price_plan.name == 'Free') {
                    setTimeout(() => { this.setState({ showPromotionPopup: true }); }, 5000);
                }

                if (response.data.user.user_registration_offers.length) {
                    setTimeout(() => { this.setState({ showTimerPromotionPopup: true }); }, 60000);
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
