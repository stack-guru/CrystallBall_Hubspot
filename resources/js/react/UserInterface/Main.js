import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';

import Sidebar from "./layout/Sidebar";
import Header from "./layout/Header";
import Index from "./components/Index";
import Footer from "./layout/Footer"

import AnnotationsCreate from './components/annotations/CreateAnnotation';
import AnnotationsUpdate from './components/annotations/EditAnnotation';
import AnnotationsIndex from './components/annotations/IndexAnnotation';

import 'react-toastify/dist/ReactToastify.css';
import './Main.css';

class Main extends React.Component {

    constructor() {
        super();
    }

    render() {
        return (
            <div className="layout-wrapper" style={{ margin: '0%', }}>
                <ToastContainer />
                <Router>
                    <div className="sidebar">
                        <Sidebar />
                    </div>

                    <div className="page-container">
                        <div className="header navbar">
                            <Header />
                        </div>


                        <main className="main-content bgc-grey-100">
                            <Switch>
                                <Route exact path="/dashboard" refresh={true}>
                                    <Index />
                                </Route>
                                <Route exact path="/annotation" refresh={true}>
                                    <AnnotationsIndex />
                                </Route>
                                <Route exact path="/annotation/create" refresh={true}>
                                    <AnnotationsCreate />
                                </Route>
                                {/*/${id}*/}
                                <Route exact path="/annotation/:id?/edit" refresh={true}
                                    render={(routeParams) => <AnnotationsUpdate routeParams={routeParams} />} />
                            </Switch>

                        </main>
                        <Footer />
                    </div>
                </Router>
            </div>
        )
    }
}
export default Main;

if (document.getElementById('ui')) {
    ReactDOM.render(<Main />, document.getElementById('ui'));
}
