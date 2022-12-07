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
        // swal.fire("Error!", "The given data was invalid.", "warning");
    }

    if (error.response.status === 455) {
        console.log(error);
        // swal.fire(
        //     "To add more users, please upgrade your account!",
        //     "Multiple users are not available in this plan.",
        //     "warning"
        // );

        const accountNotLinkedHtml = '' +
            '<div class="">' +
            '<img src="/images/banners/user_limit_banner.jpg" class="img-fluid">' +
            '</div>'

        swal.fire({
            html: accountNotLinkedHtml,
            width: 700,
            customClass: {
                popup: 'bg-light-red pb-5',
                htmlContainer: 'm-0',
            },
            confirmButtonClass: "rounded-pill btn btn-primary bg-primary px-4 font-weight-bold",
            confirmButtonText: "Upgrade Now" + "<i class='ml-2 fa fa-caret-right'> </i>",

        }).then(value => {
            window.location.href = "/settings/price-plans";
            // <Redirect to="/settings/price-plans"/>
            // this.setState({redirectTo: "/settings/price-plans"});
        });


        // swal.fire(
        //     {
        //         icon: 'warning',
        //         title: 'To add more users, please upgrade your account',
        //         confirmButtonText: "<a href='/settings/price-plans' style='color:white;'> Upgrade </a>"
        //     }
        // );
        // "To add more users, please upgrade your account.",
        //     "Multiple users are not available in this plan.",
        //     "error";
    }

    return Promise.reject(error);
});

export default axiosInst;
