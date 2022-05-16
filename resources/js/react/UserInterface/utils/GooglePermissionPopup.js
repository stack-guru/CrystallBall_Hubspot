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

        let googlePermissionsHtml = "<div class='text-center font-weight-bold'>Confirm connection to:</div>";

        googlePermissionsHtml += "<div class='text-left my-4'>";

        googlePermissionsHtml += "<div class='form-check form-check-inline'>";
        googlePermissionsHtml += '<input class="form-check-input" type="checkbox" id="google_analytics_perm">';
        googlePermissionsHtml += '<label class="form-check-label" for="google_analytics_perm">Google Analytics</label>';
        googlePermissionsHtml += '</div>';
        googlePermissionsHtml += '<div style="font-size: 14px !important;margin-left: 20px;">Allows you to assign annotations to specific properties.</div>';

        googlePermissionsHtml += "<div class='form-check form-check-inline mt-2'>";
        googlePermissionsHtml += '<input class="form-check-input" type="checkbox" id="google_search_console_perm">';
        googlePermissionsHtml += '<label class="form-check-label" for="google_search_console_perm">Google Search Console </label>';
        googlePermissionsHtml += '</div>';
        googlePermissionsHtml += '<div style="font-size: 14px !important;margin-left: 20px;">Provides insights on how the people found your site and converted.</div>';

        googlePermissionsHtml += "<div class='form-check form-check-inline mt-2'>";
        googlePermissionsHtml += '<input class="form-check-input" type="checkbox" id="google_ads_perm">';
        googlePermissionsHtml += '<label class="form-check-label" for="google_ads_perm">Google Ads </label>';
        googlePermissionsHtml += '</div>';
        googlePermissionsHtml += '<div style="font-size: 14px !important;margin-left: 20px;">Creates automatic annotations when ads are changed.</div>';

        googlePermissionsHtml += '<div class="mt-4">';
        googlePermissionsHtml += 'See our <a href="https://www.crystalballinsight.com/privacy-policy" target="_blank" class="">privacy policy</a>';
        googlePermissionsHtml += '</div>';

        googlePermissionsHtml += "</div>";

        swal.fire({
            html: googlePermissionsHtml,
            width: 500,
            confirmButtonClass: "btn btn-primary",
            cancelButtonClass: "btn btn-secondary ml-5",
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
    }

    render() {
        return (
            <div>
                { this.handleLoad() }
            </div>
        )
    }
}
