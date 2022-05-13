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

                                /*
                                * Show permissions popup
                                * */

                                let googlePermissionsHtml = "<div class='text-center font-weight-bold'>Confirm the tools you'd like to activate</div>";

                                googlePermissionsHtml += "<div class='text-left my-4'>";

                                googlePermissionsHtml += "<div class='form-check form-check-inline'>";
                                googlePermissionsHtml += '<input class="form-check-input" type="checkbox" id="google_analytics_perm">';
                                googlePermissionsHtml += '<label class="form-check-label" for="google_analytics_perm">Access to Google Analytics <i class="fa fa-exclamation-circle"></i></label>';
                                googlePermissionsHtml += '</div>';

                                googlePermissionsHtml += "<div class='form-check form-check-inline mt-2'>";
                                googlePermissionsHtml += '<input class="form-check-input" type="checkbox" id="google_search_console_perm">';
                                googlePermissionsHtml += '<label class="form-check-label" for="google_search_console_perm">Access to Google Search Console <i class="fa fa-exclamation-circle"></i></label>';
                                googlePermissionsHtml += '</div>';

                                googlePermissionsHtml += "<div class='form-check form-check-inline mt-2'>";
                                googlePermissionsHtml += '<input class="form-check-input" type="checkbox" id="google_ads_perm">';
                                googlePermissionsHtml += '<label class="form-check-label" for="google_ads_perm">Access to Google Ads <i class="fa fa-exclamation-circle"></i></label>';
                                googlePermissionsHtml += '</div>';

                                googlePermissionsHtml += '<div class="mt-4">';
                                googlePermissionsHtml += '<a href="https://www.crystalballinsight.com/privacy-policy" target="_blank" class="">See our privacy policy</a>';
                                googlePermissionsHtml += '</div>';

                                googlePermissionsHtml += "</div>";

                                swal.fire({
                                    html: googlePermissionsHtml,
                                    width: 500,
                                    confirmButtonClass: "btn btn-primary",
                                    cancelButtonClass: "btn btn-secondary",
                                    confirmButtonText: "Connect",
                                    showCloseButton: true,
                                    showCancelButton: true,
                                    cancelButtonText: 'Cancel',
                                    allowOutsideClick: false
                                }).then(value => {
                                    if (value.isConfirmed) {
                                        let query_string_obj = {
                                            'google_analytics_perm': document.getElementById('google_analytics_perm').checked,
                                            'google_search_console_perm': document.getElementById('google_search_console_perm').checked,
                                            'google_ads_perm': document.getElementById('google_ads_perm').checked,
                                        }
                                        let query_string = new URLSearchParams(query_string_obj).toString();
                                        // Save pathname in this storage without domain name
                                        localStorage.setItem("frontend_redirect_to", window.location.pathname);
                                        window.location = "/settings/google-account/create?" + query_string;
                                    }
                                });
                            
                            }} href="#"><img src="/images/connect-google-analytics.svg" href="#" width="400" height="auto" /></a>

                            {/* <a onClick={(e) => {
                                e.persist();
                                callmiddle(e, (e) => {
                      
                                    localStorage.setItem("frontend_redirect_to", window.location.pathname);
                                });
                            }} href="/settings/google-account/create"><img src="/images/connect-google-analytics.svg" href="/settings/google-account/create" width="400" height="auto" /></a> */}
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
    </div >;
}