import moment from 'moment';
import React from 'react';
import { Link } from 'react-router-dom';

export default function NoDataFoundPage(props) {
    if (!props.googleAccount) return null;

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
                        {
                            props.googleAccount.last_successful_use_at == null && props.googleAccount.last_unsuccessful_use_at ?
                                <div className="col-12 text-center">
                                    <p>Please wait, while we fetch data from your google accounts.</p>
                                </div>
                                : null
                        }
                        {
                            moment(props.googleAccount.last_successful_use_at) < moment(props.googleAccount.last_unsuccessful_use_at) ?
                                <div className="col-12 text-center">
                                    <p>System is unable to connect with Google to fetch Google Analytics statistics.</p>
                                </div>
                                : null
                        }
                        {
                            props.googleAccount.scopes.indexOf('https://www.googleapis.com/auth/analytics.readonly') == -1 ?
                                <div className="col-12 text-center">
                                    <p>Please provide necessary permissions while giving access to your Google Account.</p>
                                </div>
                                : null
                        }
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