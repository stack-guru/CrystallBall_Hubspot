import React from 'react';
import { Link } from 'react-router-dom';

export default function NoDataFoundPage(props) {
    return <div className="container-xl bg-white anno-container  d-flex flex-column justify-content-center component-wrapper" >
        <section className="ftco-section" id="inputs">
            <div className="container-xl pt-4">
                <div id="dashboard-index-container">
                    <div className="row">
                        <div className="col-12 text-center">
                            <h3>No data found</h3>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 text-center">
                            <p>Please make sure that Search Console sites are properly fetched</p>
                        </div>
                    </div>
                    {/* <div className="row">
                        <div className="col-12 text-center">
                            <a href="/settings/google-account/create"><img src="/images/connect-google-analytics.png" width="400" height="auto" /></a>
                        </div>
                    </div> */}
                </div>
            </div>

        </section>
    </div >;
}