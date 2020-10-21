import React from 'react';
import ReactDOM from 'react-dom';
import Sidebar from "./layout/sidebar";
import Header from "./layout/header";
import Index from "./Components/index";
import Footer from "./layout/footer"
import {BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";
import Annotations from './components/annotations/index';



 class Main extends React.Component{

    constructor() {
        super();
    }

render() {
        return(
            <div className="layout-wrapper" style={{margin: '0%',}}>

                <Router>
                <div className="sidebar">
                    <Sidebar/>
                </div>

                <div className="page-container">
                    <div className="header navbar">
                        <Header/>
                    </div>


                    <main className="main-content bgc-grey-100">
                        <Switch>
                            <Route exact path="/dashboard" refresh={true}>
                                <Index/>
                            </Route>
                            <Route exact path="/annotation" refresh={true}>
                                <Annotations/>
                            </Route>
                        </Switch>

                    </main>
                    <Footer/>
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
