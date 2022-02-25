import React from 'react';
import { Link } from 'react-router-dom';
import { callmiddle } from '../../../helpers/CommonFunctions';

export default function NoGoogleAccountConnectedPage(props) {
    return <div className="container-xl bg-white anno-container  d-flex flex-column justify-content-center component-wrapper" >
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
                            <a onClick={(e) => {
                                e.persist();
                                callmiddle(e, (e) => {
                                    // Save pathname in this storage without domain name
                                    localStorage.setItem("frontend_redirect_to", "/dashboard/search-console");
                                });
                            }} href="/settings/google-account/create"><img src="/images/connect-google-analytics.png" href="/settings/google-account/create" width="400" height="auto" /></a>
                        </div>
                    </div>
                </div>
            </div>

        </section>
    </div >;
}