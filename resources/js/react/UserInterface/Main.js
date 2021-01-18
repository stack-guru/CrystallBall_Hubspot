import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';

import HttpClient from "./utils/HttpClient";

import './Sidebarjs.js';
import Sidebar from "./layout/Sidebar";
import Header from "./layout/Header";
import Footer from "./layout/Footer"

import './Main.css';

import Index from "./components/Index";
import AnnotationsCreate from './components/annotations/CreateAnnotation';
import AnnotationsUpdate from './components/annotations/EditAnnotation';
import IndexAnnotations from './components/annotations/IndexAnnotation';
import AnnotationsUpload from './components/annotations/UploadAnnotation';
import PricingPlans from './components/settings/pricingPlans/IndexPricingPlans';
import Settings from './components/settings/IndexSettings';
import ChangePassword from './components/settings/ChangePassword';
import PaymentHistory from './components/settings/pricingPlans/PaymentHistory';
import GoogleAccount from './components/settings/googleAccount/AddGoogleAccount';
import DataSourceIndex from "./components/DataSource/DataSourceIndex";
import IndexAPIKey from './components/apiKey/IndexAPIKey';
import CreatePayment from './components/settings/pricingPlans/CreatePayment';
import IntegrationsIndex from "./components/integrations/IntegrationsIndex";
import SupportIndex from './components/support/supportIndex';
import IndexUsers from './components/settings/user/IndexUsers';
import CreateUser from './components/settings/user/CreateUser';
import EditUser from './components/settings/user/EditUser';

class Main extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            user: undefined
        }
        this.loadUser = this.loadUser.bind(this)
    }


    componentDidMount() {

        let loader = document.getElementById("loader");
        loader.classList.remove("fadeOut")
        this.loadUser();
    }

    loadUser() {
        HttpClient.get('/user')
            .then(response => {
                this.setState({ user: response.data.user });
                loader.classList.add("fadeOut")

                if (response.data.user.last_login_at == null) {
                    fbq('track', 'CompleteRegistration');
                    gtag('event', 'conversion', { 'send_to': 'AW-645973826/wQD3CJnzvugBEMKOg7QC' });
                    ga('send', {
                        hitType: 'event',
                        eventCategory: 'SignUp',
                        eventAction: 'SignUp',
                        eventLabel: 'SignUp'
                    });
                }
            }, (err) => {
                console.log(err);
                this.setState({ isBusy: false, errors: (err.response).data });
            }).catch(err => {
                console.log(err)
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

    render() {
        if (this.state.user == undefined) return null;
        return (

            <React.Fragment>

                <div className="sidebar">
                    <Sidebar user={this.state.user} />
                </div>

                <div className="page-container">
                    <div className="header navbar">
                        <Header user={this.state.user} />
                    </div>


                    <main className="main-content bgc-grey-100">
                        <Switch>
                            <Route exact path="/dashboard" refresh={true}>
                                <Index />
                            </Route>
                            <Route exact path="/annotation" refresh={true}>
                                <IndexAnnotations />
                            </Route>
                            <Route exact path="/annotation/create" refresh={true}>
                                <AnnotationsCreate />
                            </Route>
                            <Route exact path="/annotation/:id?/edit" refresh={true}
                                render={(routeParams) => <AnnotationsUpdate routeParams={routeParams} />} />
                            <Route exact path="/api-key" refresh={true}>
                                <IndexAPIKey currentPricePlan={this.state.user.price_plan} />
                            </Route>
                            <Route exact path="/annotation/upload" refresh={true}>
                                <AnnotationsUpload />
                            </Route>
                            <Route exact path="/data-source" refresh={true}>
                                <DataSourceIndex user={this.state.user} reloadUser={this.loadUser} />
                            </Route>
                            <Route exact path="/integrations" refresh={true}>
                                <IntegrationsIndex user={this.state.user} />
                            </Route>
                            <Route exact path="/settings" refresh={true}>
                                <Settings user={this.state.user} />
                            </Route>
                            <Route exact path="/settings/change-password" refresh={true}>
                                <ChangePassword />
                            </Route>
                            <Route exact path="/settings/price-plans" refresh={true}>
                                <PricingPlans user={this.state.user} />
                            </Route>
                            <Route exact path="/settings/price-plans/payment" refresh={true}>
                                <CreatePayment user={this.state.user} />
                            </Route>
                            <Route exact path="/settings/payment-history" refresh={true}>
                                <PaymentHistory user={this.state.user} />
                            </Route>
                            <Route exact path="/settings/google-account" refresh={true}>
                                <GoogleAccount user={this.state.user} />
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

            </React.Fragment>

        )
    }
}
export default Main;
