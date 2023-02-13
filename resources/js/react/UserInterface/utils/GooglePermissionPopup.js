import React, {Component} from 'react'

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

        let googlePermissionsHtml = "<h2>Confirm connection to:</h2>";

        googlePermissionsHtml += "<div class='contentHolder'>";

        googlePermissionsHtml += "<div class='form-check form-check-inline'>";
        googlePermissionsHtml += '<input class="form-check-input" type="checkbox" checked id="google_analytics_perm">';
        googlePermissionsHtml += '<label class="form-check-label" for="google_analytics_perm">Google Analytics</label>';
        googlePermissionsHtml += '</div>';
        googlePermissionsHtml += '<div style="font-size: 14px !important; margin-left: 20px; margin-bottom:15px;">Allows you to assign annotations to specific properties.</div>';

        googlePermissionsHtml += "<div class='form-check form-check-inline'>";
        googlePermissionsHtml += '<input class="form-check-input" type="checkbox" disabled id="google_search_console_perm">';
        googlePermissionsHtml += '<label class="form-check-label" for="google_search_console_perm">Google Search Console </label><label class="badge badge-warning badge-sm ml-2 mb-0">Coming Soon</label>';
        googlePermissionsHtml += '</div>';
        googlePermissionsHtml += '<div style="font-size: 14px !important;margin-left: 20px;margin-bottom:15px;">Provides insights on how the people found your site and converted.</div>';

        googlePermissionsHtml += "<div class='form-check form-check-inline'>";
        googlePermissionsHtml += '<div class="d-flex align-items-center"><input class="form-check-input" type="checkbox" disabled id="google_ads_perm">';
        googlePermissionsHtml += '<label class="form-check-label" for="google_ads_perm">Google Ads </label><label class="badge badge-warning badge-sm ml-2 mb-0">Coming Soon</label></div>';
        googlePermissionsHtml += '</div>';
        googlePermissionsHtml += '<div style="font-size: 14px !important;margin-left: 20px;margin-bottom:15px;">Creates automatic annotations when ads are changed.</div>';

        googlePermissionsHtml += '<div style="font-size: 14px;">';
        googlePermissionsHtml += 'See our <a href="https://www.crystalballinsight.com/privacy-policy" target="_blank" class="" style="color:blue;">privacy policy</a>';
        googlePermissionsHtml += '</div>';

        googlePermissionsHtml += "</div>";

        swal.fire({
            iconHtml: '<img src="/Google-Updates.svg">',
            html: googlePermissionsHtml,
            width: 500,
            confirmButtonClass: "m-0 p-0 border-0 rounded-0 bg-white",
            confirmButtonText: `<i class="pr-2"><img style="width: 16px; height: 16px" src="./google-small.svg" alt="icon" class="svg-inject socialImage" /></i><span>Sign in with Google</span>`,
            focusConfirm: false,
            // cancelButtonClass: "btn btn-secondary ml-5",
            showCloseButton: false,
            // showCancelButton: false,
            // cancelButtonText: 'Cancel',
            allowOutsideClick: true,
            customClass: {
                popup: "confirmConnectionTo",
                htmlContainer: "confirmConnectionToContent",
                closeButton: 'btn-closeplanAlertPopup',
            },
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
    }

    render() {
        return (
            <div>
                { this.handleLoad() }
            </div>
        )
    }
}
