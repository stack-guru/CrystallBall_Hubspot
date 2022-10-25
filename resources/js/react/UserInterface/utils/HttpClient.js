import axios from "axios";

const CancelToken = axios.CancelToken;
const source = CancelToken.source();

axios.defaults.xsrfHeaderName = "X-CSRFToken";
axios.defaults.headers.common = {
    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
    'Accept': 'application/json',
    'Content-Type': 'application/json',
}
axios.defaults.xsrfCookieName = 'XSRF-TOKEN';
axios.defaults.trailingSlash = false;

let axiosInst = axios.create({
    baseURL: "/ui/",
    responseType: "json",
    cancelToken: source.token
});


// Add a response interceptor
axiosInst.interceptors.response.use(function (response) {
    // Do something with response data
    return response;
}, function (error) {

    if (error.response.status === 401) {
        if (window.location.pathname !== "/") {
            window.alert("Not logged in. We are redirecting you to the login page. You may login with an account and try the operation again.");
            window.location.pathname = "/";
        }
    }

    if (error.response.status === 403) {
        console.log(error);
        window.alert("You tried to perform an operation you are not authorized of. See console for more information.");
    }

    if (error.response.status === 404) {
        console.log(error);
        swal.fire("Error!", "Not found.", "error");
    }

    if (error.response.status === 405) {
        console.log(error);
        window.alert("Invalid method tried for a route. See console for more information.");
    }

    if (error.response.status === 422) {
        console.log(error);
        swal.fire("Error!", "Unprocessible request.", "error");
    }

    if (error.response.status === 455) {
        console.log(error);

        let features = [
            [
                "Chrome Extension",
                "Data Studio Connector",
                "Users",
                "Connect Google Analytics Accounts",
                "CSV Upload",
                "API",
                "Zapier Integrations",
                "Notifications"
            ],
            [
                "Automations Instagram",
                "Automations Twitter",
                "Automations TikTok",
                "Automations Podcast",
                "Automations Facebook",
                "Automations Rank Tracking",
                "Automations Website Monitoring",
                "and more...",
            ]
        ];

        let featuresHTML = '';

        features.forEach(list => {
            featuresHTML += '<div class="m-2">';
            list.forEach(feature => {
                featuresHTML += '<div class="d-flex">';
                featuresHTML += '<img src="/images/icons/green-tick-round.png" style="width: 20px;height: 20px;margin: 5px;" >';
                featuresHTML += `<p>${feature}</p>`;
                featuresHTML += '</div>';
            });
            featuresHTML += '</div>';
        });

        const accountNotLinkedHtml = '' +
            '<div>' +
                '<img src="/images/imgpopup.png" class="img-fluid">' +
                '<div class="bg-light p-3">' +

                    '<h3  class=" text-black mt-2" style="margin-top:1.5rem!important;margin-right:1.5rem!important;margin-left:1.5rem!important;">To add more users, please Upgrade your account </h3>' +

                    '<p style="line-height:23px; color: rgba(153,153,153,1.7) !important;font-family: \'Roboto\', sans-serif;" class="px-5 text-dark"> Upgrade today to access all the premium features </p>' +

                    '<div class="m-5 p-5 d-flex">' + featuresHTML + '</div>' +

                '</div>' +
            '</div>';
        /*
        * Show new google analytics account popup
        * */
        swal.fire({
            html: accountNotLinkedHtml,
            width: 700,
            customClass: {
                popup: 'bg-light pb-5',
                htmlContainer: 'm-0',
            },
            confirmButtonClass: "rounded-pill btn btn-primary bg-primary px-4 font-weight-bold",
            confirmButtonText: "<a href='/settings/price-plans' style='color:white;'> Upgrade </a>"

        }).then(value => {
            if (value.isConfirmed) {
                this.setState({ isPermissionPopupOpened: true });
            }
        });

    }

    return Promise.reject(error);
});

export default axiosInst;
