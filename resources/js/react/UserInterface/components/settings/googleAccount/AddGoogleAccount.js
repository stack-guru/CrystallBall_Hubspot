import React from 'react';
import HttpClient from './../../../utils/HttpClient';
import { toast } from 'react-toastify'
import { Redirect } from "react-router-dom";

export default class AddGoogleAccount extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isBusy: false,
            googleAccounts: [],
            googleAnalyticsAccounts: [],
            redirectTo: null,
        }

        this.handleDelete = this.handleDelete.bind(this);
        this.fetchGAAccounts = this.fetchGAAccounts.bind(this);
        this.getGAAccounts = this.getGAAccounts.bind(this);
        this.getGoogleAccounts = this.getGoogleAccounts.bind(this);
        this.restrictionHandler = this.restrictionHandler.bind(this);
    }

    componentDidMount() {
        document.title = 'Google Accounts';

        this.getGoogleAccounts();
        this.getGAAccounts();

        let searchParams = new URLSearchParams(document.location.search);
        if (searchParams.has('message') && searchParams.has('success')) {
            let success = searchParams.get('success');
            let message = searchParams.get('message');
            swal("Error", message, success == "false" ? "error" : "success");
        }
    }

    getGoogleAccounts(){
        this.setState({ isBusy: true })
        HttpClient.get('/settings/google-account').then(resp => {
            this.setState({ googleAccounts: resp.data.google_accounts, isBusy: false });
        }, (err) => {
            console.log(err);
            this.setState({ isBusy: false, errors: (err.response).data });
        }).catch(err => {
            console.log(err)
            this.setState({ isBusy: false, errors: err });
        });
    }

    handleDelete(id) {
        this.setState({ isBusy: true });
        HttpClient.delete(`/settings/google-account/${id}`).then(resp => {
            toast.success("Account removed.");
            let googleAccounts = this.state.googleAccounts;
            googleAccounts = googleAccounts.filter(ga => ga.id != id);
            this.setState({ isBusy: false, googleAccounts: googleAccounts })
        }, (err) => {
            console.log(err);
            this.setState({ isBusy: false, errors: (err.response).data });
        }).catch(err => {
            console.log(err);
            this.setState({ isBusy: false, errors: err });
        });
    }

    fetchGAAccounts(id) {
        this.setState({ isBusy: true });
        HttpClient.post(`/settings/google-analytics-account/google-account/${id}`).then(resp => {
            toast.success("Accounts fetched.");
            this.setState({ isBusy: false })
            this.getGAAccounts();
        }, (err) => {
            console.log(err);
            this.setState({ isBusy: false, errors: (err.response).data });
        }).catch(err => {
            console.log(err);
            this.setState({ isBusy: false, errors: err });
        });
    }

    getGAAccounts() {
        this.setState({ isBusy: true });
        HttpClient.get(`/settings/google-analytics-account`).then(response => {
            this.setState({ isBusy: false, googleAnalyticsAccounts:  response.data.google_analytics_accounts})
        }, (err) => {
            console.log(err);
            this.setState({ isBusy: false, errors: (err.response).data });
        }).catch(err => {
            console.log(err);
            this.setState({ isBusy: false, errors: err });
        });
    }

    restrictionHandler(e) {
        e.preventDefault();
        if (this.props.user.price_plan.price !== 0) {
            window.location = "/settings/google-account/create";
        } else {
            swal("Upgrade to Basic Plan!", "Google account feature is not available in this package.", "warning").then(value => {
                this.setState({ redirectTo: '/settings/price-plans' });
            })
        }
    }

    render() {
        if (this.state.redirectTo) return <Redirect to={this.state.redirectTo} />
        return (
            <div className="container-xl bg-white  d-flex flex-column justify-content-center component-wrapper" >

                <div className="container p-5">
                    <div className="row ml-0 mr-0">
                        <div className="col-12">
                            <h1 className="gaa-text-primary">Connect Multiple GA Accounts</h1>
                        </div>
                    </div>
                    <div className="row ml-0 mr-0 my-5">
                        <div className="col-12 text-center text-md-right text-lg-right">
                            <a href="/settings/google-account/create" onClick={this.restrictionHandler} className="btn gaa-bg-primary text-white" >
                                Connect New Account
                            </a>
                        </div>
                    </div>
                    <div className="row ml-0 mr-0">
                        <div className="col-12">
                            <div className="table-responsive">
                                <table className="table table-hover table-bordered table-striped">
                                    <thead>
                                        <tr>
                                            <th>Avatar</th>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>ID for API</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            this.state.googleAccounts.map(googleAccount => {
                                                return <tr key={googleAccount.id}>
                                                    <td><img src={googleAccount.avatar} className="social-profile-picture" /></td>
                                                    <td>{googleAccount.name}</td>
                                                    <td>{googleAccount.email}</td>
                                                    <td>{googleAccount.id}</td>
                                                    <td>
                                                        <button onClick={() => this.handleDelete(googleAccount.id)} className="btn ad-ga-action gaa-btn-danger">
                                                            <i className="fa fa-unlink mr-0 mr-md-2 mr-lg"></i>
                                                            <span className="ad-ga-action-text">Disconnect</span>
                                                        </button>
                                                        <button onClick={() => this.fetchGAAccounts(googleAccount.id)} className="btn ad-ga-action gaa-btn-primary ml-1">
                                                            <i className="fa fa-search mr-0 mr-md-2 mr-lg"></i>
                                                            <span className="ad-ga-action-text">Search Accounts</span>
                                                        </button>
                                                    </td>
                                                </tr>
                                            })
                                        }

                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="row ml-0 mr-0 mt-5">
                        <div className="col-12">
                            <div className="table-responsive">
                                <table className="table table-hover table-bordered table-striped">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Link</th>
                                            <th>Property</th>
                                            <th>Google Account</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.googleAnalyticsAccounts.map(gAA => {
                                            return <tr key={gAA.id}>
                                            <td>{gAA.name}</td>
                                            <td>{gAA.self_link}</td>
                                            <td>{gAA.property_href}</td>
                                            <td>{gAA.google_account.name}</td>
                                        </tr>
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        );
    }

}
