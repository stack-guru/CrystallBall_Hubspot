import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { callmiddle } from '../../../helpers/CommonFunctions';

export default class NoGoogleAccountConnectedPage extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isPermissionPopupOpened: false,
        };
    }

    render() {
        return (
            <div>
                <div className="container-xl bg-white anno-container  d-flex flex-column justify-content-center component-wrapper" >
                    <section className="ftco-section" id="inputs">
                        <div className="container-xl pt-4">
                            <div id="dashboard-index-container">
                                <div className="row">
                                    <div className="col-12 text-center">
                                        <h3>Connect to Google Analytics</h3>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12 text-center">
                                        <p>to get data on your visitors’ behavior and know how to optimize for better results</p>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12 text-center">
                                        <a onClick={(e) => { this.setState({ isPermissionPopupOpened: true }) }} href="#"><img src="/images/connect-google-analytics.svg" href="#" width="400" height="auto" /></a>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12">
                                        <p className="text-center gaa-text-primary">This page is on Beta</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </section>
                </div >
                {
                    this.state.isPermissionPopupOpened ? <GooglePermissionPopup /> : ''
                }
            </div>
        )
    }
}