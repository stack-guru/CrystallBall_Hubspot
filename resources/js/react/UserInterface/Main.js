import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import HttpClient from "./utils/HttpClient";

import Sidebar from "./layout/Sidebar";
import Header from "./layout/Header";
import Index from "./components/Index";
import Footer from "./layout/Footer"

import AnnotationsCreate from './components/annotations/CreateAnnotation';
import AnnotationsUpdate from './components/annotations/EditAnnotation';
import IndexAnnotations from './components/annotations/IndexAnnotation';
import AnnotationsUpload from './components/annotations/UploadAnnotation';
import PricingPlans from './components/settings/pricingPlans/IndexPricingPlans';
import Settings from './components/settings/IndexSettings';
import ChangePassword from './components/settings/ChangePassword';
import PaymentHistory from './components/settings/pricingPlans/PaymentHistory';

import 'react-toastify/dist/ReactToastify.css';
import './Main.css';
import IndexAPIKey from './components/apiKey/IndexAPIKey';
import CreatePayment from './components/settings/pricingPlans/CreatePayment';

class Main extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            user: undefined
        }
    }


    componentDidMount() {

        let loader = document.getElementById("loader");
        loader.classList.remove("fadeOut")
        HttpClient.get('/user')
            .then(response => {
                this.setState({ user: response.data.user });
                loader.classList.add("fadeOut")

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
                            <Route exact path="/settings" refresh={true}>
                                <Settings user={this.state.user} />
                            </Route>
                            <Route exact path="/settings/change-password" refresh={true}>
                                <ChangePassword />
                            </Route>
                            <Route exact path="/settings/price-plans" refresh={true}>
                                <PricingPlans currentPricePlan={this.state.user.price_plan} />
                            </Route>
                            <Route exact path="/settings/price-plans/payment" refresh={true}>
                                <CreatePayment user={this.state.user} />
                            </Route>
                            <Route exact path="/settings/payment-history" refresh={true}>
                                <PaymentHistory user={this.state.user} />
                            </Route>
                        </Switch>

                    </main>
                    <Footer />
                </div>

            </React.Fragment>

        )
    }
}
export default Main;
