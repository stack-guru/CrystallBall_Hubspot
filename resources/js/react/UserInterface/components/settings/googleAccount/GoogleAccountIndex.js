import React from 'react';
import { toast } from 'react-toastify'
import { Redirect } from "react-router-dom";

import HttpClient from '../../../utils/HttpClient';
import ErrorAlert from '../../../utils/ErrorAlert'
import AdwordsClientCustomerIdSaverModal from '../../../helpers/AdwordsClientCustomerIdSaverModalComponent';
import VideoModalBox from '../../../utils/VideoModalBox';

export default class GoogleAccountIndex extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isBusy: false,
            googleAccounts: [],
            googleAnalyticsAccounts: [],
            googleAnalyticsProperties: [],
            redirectTo: null,
        }

        this.handleDelete = this.handleDelete.bind(this);
        this.fetchGAAccounts = this.fetchGAAccounts.bind(this);
        this.getGAAccounts = this.getGAAccounts.bind(this);
        this.getGoogleAccounts = this.getGoogleAccounts.bind(this);
        this.restrictionHandler = this.restrictionHandler.bind(this);

        this.handleGAADelete = this.handleGAADelete.bind(this);

        this.closeACCISModal = this.closeACCISModal.bind(this);

        this.getGAProperties = this.getGAProperties.bind(this);
    }

    componentDidMount() {
        document.title = 'Google Accounts';

        this.getGoogleAccounts();
        this.getGAAccounts();
        this.getGAProperties();

        let searchParams = new URLSearchParams(document.location.search);
        this.setState({ showACCISModal: searchParams && searchParams.has('do-refresh') && searchParams.has('google_account_id') })

        if (searchParams.has('message') && searchParams.has('success')) {
            let success = searchParams.get('success');
            let message = searchParams.get('message');
            swal("Error", message, success == "false" ? "error" : "success");
        }

        if (searchParams.has('do-refresh') && searchParams.has('google_account_id')) {
            if (searchParams.get('do-refresh') == "1") {
                this.fetchGAAccounts(searchParams.get('google_account_id'));
            }
        }
    }

    getGoogleAccounts() {
        this.setState({ isBusy: true })
        HttpClient.get('/settings/google-account').then(resp => {
            this.setState({ googleAccounts: resp.data.google_accounts, isBusy: false });
        }, (err) => {

            this.setState({ isBusy: false, errors: (err.response).data });
        }).catch(err => {

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

            this.setState({ isBusy: false, errors: (err.response).data });
        }).catch(err => {

            this.setState({ isBusy: false, errors: err });
        });
    }

    fetchGAAccounts(id) {
        this.setState({ isBusy: true });
        HttpClient.post(`/settings/google-analytics-account/google-account/${id}`).then(resp => {
            toast.success("Accounts fetched.");
            this.setState({ isBusy: false })
            this.getGAAccounts();
            this.getGAProperties();
        }, (err) => {

            this.setState({ isBusy: false, errors: (err.response).data });
        }).catch(err => {

            this.setState({ isBusy: false, errors: err });
        });
    }

    getGAAccounts() {
        this.setState({ isBusy: true });
        HttpClient.get(`/settings/google-analytics-account`).then(response => {
            this.setState({ isBusy: false, googleAnalyticsAccounts: response.data.google_analytics_accounts })
        }, (err) => {

            this.setState({ isBusy: false, errors: (err.response).data });
        }).catch(err => {

            this.setState({ isBusy: false, errors: err });
        });
    }

    restrictionHandler(e) {
        e.preventDefault();
        if (this.props.user.price_plan.ga_account_count > this.state.googleAccounts.length || this.props.user.price_plan.ga_account_count == 0) {
            window.location = "/settings/google-account/create";
        } else {
            swal("Upgrade to Pro Plan!", "Google account feature is not available in this package.", "warning").then(value => {
                this.setState({ redirectTo: '/settings/price-plans' });
            })
        }
    }

    handleGAADelete(gAAId) {
        if (!this.state.isBusy) {
            this.setState({ isBusy: true })
            HttpClient.delete(`/settings/google-analytics-account/${gAAId}`).then(response => {
                this.setState({ isBusy: false, googleAnalyticsAccounts: this.state.googleAnalyticsAccounts.filter(g => g.id !== gAAId) })
                toast.success("Account removed.");
            }, (err) => {

                this.setState({ isBusy: false, errors: (err.response).data });
            }).catch(err => {

                this.setState({ isBusy: false, errors: err });
            });
        }
    }

    handleGAPDelete(gAPId) {
        if (!this.state.isBusy) {
            this.setState({ isBusy: true })
            HttpClient.delete(`/settings/google-analytics-property/${gAPId}`).then(response => {
                this.setState({ isBusy: false, googleAnalyticsProperties: this.state.googleAnalyticsProperties.filter(g => g.id !== gAPId) })
                toast.success("Property removed.");
            }, (err) => {

                this.setState({ isBusy: false, errors: (err.response).data });
            }).catch(err => {

                this.setState({ isBusy: false, errors: err });
            });
        }
    }

    closeACCISModal() {
        this.setState({ showACCISModal: false })
    }

    getGAProperties() {
        this.setState({ isBusy: true });
        HttpClient.get(`/settings/google-analytics-property`).then(response => {
            this.setState({ isBusy: false, googleAnalyticsProperties: response.data.google_analytics_properties })
        }, (err) => {

            this.setState({ isBusy: false, errors: (err.response).data });
        }).catch(err => {

            this.setState({ isBusy: false, errors: err });
        });
    }

    render() {
        if (this.state.redirectTo) return <Redirect to={this.state.redirectTo} />
        return (
            <div className="container-xl bg-white  d-flex flex-column justify-content-center component-wrapper" >

                {/* <AdwordsClientCustomerIdSaverModal
                    show={this.state.showACCISModal}
                    dismissCallback={this.closeACCISModal}
                /> */}
                <div className="container p-5">
                    <div className="row ml-0 mr-0">
                        <div className="col-12">
                            <h2 className="heading-section gaa-title">Connect Multiple GA Accounts</h2>
                        </div>
                    </div>

                    <div className="row ml-0 mr-0">
                        <div className="col-md-12">
                            <a className="float-right" href="#" target="_blank" data-toggle="modal" data-target="#properties-video-modal">How to use the properties</a>
                        </div>
                        <VideoModalBox id="properties-video-modal" src="https://www.youtube.com/embed/4tRGhuK7ZWQ" />
                    </div>
                    <div className="row ml-0 mr-0">
                        <div className="col-12">
                            <ErrorAlert errors={this.state.errors} />
                        </div>
                    </div>
                    <div className="row ml-0 mr-0 my-5">
                        <div className="col-12 text-center text-md-right text-lg-right">
                            <a href="/settings/google-account/create"
                                onClick={this.restrictionHandler}
                                className="btn gaa-btn-primary text-white" >
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
                                            <th>Profile Image</th>
                                            <th>Google Account</th>
                                            <th>Email</th>
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
                                                    <td className="text-center">
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
                                            <th>Google Analytics Name</th>
                                            <th>Google Analytics ID</th>
                                            <th>Property Type</th>
                                            <th>Added On</th>
                                            <th>Google Account</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.googleAnalyticsAccounts.map(gAA => {
                                            return <tr key={gAA.id}>
                                                <td>{gAA.name}</td>
                                                <td>{gAA.ga_id}</td>
                                                <td>{gAA.property_type}</td>
                                                <td>{moment(gAA.created_at).format('YYYY-MM-DD HH:mm:ss')}</td>
                                                <td>{gAA.google_account.name}</td>
                                                <td className="text-center"><button className="btn btn-danger" onClick={() => this.handleGAADelete(gAA.id)}><i className="fa fa-trash-o"></i></button></td>
                                            </tr>
                                        })}
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
                                            <th>ID for API</th>
                                            <th>Analytics Accounts</th>
                                            <th>Properties &amp; Apps</th>
                                            <th>Google Account</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.googleAnalyticsProperties.map(gAP => {
                                            return <tr key={gAP.id}>
                                                <td>{gAP.id}</td>
                                                <td>{gAP.google_analytics_account.name}</td>
                                                <td>{gAP.name}</td>
                                                <td>{gAP.google_account.name}</td>
                                                <td className="text-center"><button className="btn btn-danger" onClick={() => this.handleGAPDelete(gAP.id)}><i className="fa fa-trash-o"></i></button></td>
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
