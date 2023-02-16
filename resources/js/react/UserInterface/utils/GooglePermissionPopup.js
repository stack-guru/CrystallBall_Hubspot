import React, { Component } from 'react'

export default class GooglePermissionPopup extends Component {

    constructor(props) {
        super(props)
        this.state = {};
        this.handleLoad = this.handleLoad.bind(this);
    }

    handleLoad() {

        /*
        * Show permissions popup
        * */

        let googlePermissionsHtml = "<div class='contentHolder'>";
        googlePermissionsHtml += '<h2>Let’s connect your Google Account</h2>';
        googlePermissionsHtml += '<p>Connect your google account to see all your data at one place, be able to filter data by property, see anomalies and analyze your data better</p>';
        googlePermissionsHtml += "</div>";

        swal.fire({
            iconHtml: '<figure class="m-0"><img src="/images/google-account.svg"></figure>',
            html: googlePermissionsHtml,
            width: 500,
            // confirmButtonClass: "m-0 p-0 border-0 rounded-0 bg-white",
            confirmButtonText: `Connect Google Account`,
            focusConfirm: false,
            // cancelButtonClass: "btn btn-secondary ml-5",
            showCloseButton: false,
            // showCancelButton: false,
            // cancelButtonText: 'Cancel',
            allowOutsideClick: true,
            backdrop: true,
            customClass: {
                popup: "confirmConnectionTo",
                htmlContainer: "confirmConnectionToContent",
                closeButton: 'btn-closeplanAlertPopup',
            },
        }).then(value => {
            if (value.isConfirmed) {
                let query_string_obj = {
                    'google_analytics_perm': document.getElementById('google_analytics_perm') ? document.getElementById('google_analytics_perm').checked : true,
                    'google_search_console_perm': document.getElementById('google_search_console_perm') ? document.getElementById('google_search_console_perm').checked : true,
                    'google_ads_perm': document.getElementById('google_ads_perm') ? document.getElementById('google_ads_perm').checked : true,
                }
                let query_string = new URLSearchParams(query_string_obj).toString();
                // Save pathname in this storage without domain name
                localStorage.setItem("frontend_redirect_to", window.location.pathname);
                window.location = "/settings/google-account/create?" + query_string;
            }
        });
    }

    render() {
        return (
            <div>
                {this.handleLoad()}
            </div>
        )
    }
}
