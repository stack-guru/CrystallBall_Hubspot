import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';

import HttpClient from "./utils/HttpClient";

import Sidebar from "./layout/Sidebar";
import Header from "./layout/Header";
import Index from "./components/Index";
import Footer from "./layout/Footer"

import AnnotationsCreate from './components/annotations/CreateAnnotation';
import AnnotationsUpdate from './components/annotations/EditAnnotation';
import IndexAnnotations from './components/annotations/IndexAnnotation';
import AnnotationsUpload from './components/annotations/UploadAnnotation';
import PricingPlans from './components/pricingPlans/IndexPricingPlans';

import 'react-toastify/dist/ReactToastify.css';
import './Main.css';
import IndexAPIKey from './components/apiKey/IndexAPIKey';

class Main extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            user: undefined
        }
    }


    componentWillMount() {
        HttpClient.get('/user')
            .then(response => {
                this.setState({ user: response.data.user });
            }, (err) => {
                console.log(err);
                this.setState({ isBusy: false, errors: (err.response).data });
            }).catch(err => {
                console.log(err)
                this.setState({ isBusy: false, errors: err });
            });
    }

    render() {
        return (
            <React.Fragment>
                <ToastContainer />
                <Router>
                    <div className="sidebar">
                        <Sidebar />
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
                                    <IndexAPIKey />
                                </Route>
                                <Route exact path="/annotation/upload" refresh={true}>
                                    <AnnotationsUpload />
                                </Route>
                                <Route exact path="/choose-plan" refresh={true}>
                                    <PricingPlans />
                                </Route>
                            </Switch>

                        </main>
                        <Footer />
                    </div>
                </Router>

            </React.Fragment >
        )
    }
}
export default Main;

if (document.getElementById('ui')) {
    ReactDOM.render(<Main />, document.getElementById('ui'));
}
