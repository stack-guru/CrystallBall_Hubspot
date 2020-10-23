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
    baseURL: "/",
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
        window.alert("Unkown API triggered. See console for more information.");
    }

    if (error.response.status === 405) {
        console.log(error);
        window.alert("Invalid method tried for a route. See console for more information.");
    }

    if (error.response.status === 422) {
        console.log(error);
        window.alert("Unprocessible request.");
    }

    return Promise.reject(error);
});

export default axiosInst;
