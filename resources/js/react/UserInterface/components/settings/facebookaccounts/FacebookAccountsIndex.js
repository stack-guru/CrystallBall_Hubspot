import React from 'react';
import Toast from "../../../utils/Toast";
import { Redirect } from "react-router-dom";

import HttpClient from '../../../utils/HttpClient';
import ErrorAlert from '../../../utils/ErrorAlert'
// import AdwordsClientCustomerIdSaverModal from '../../../helpers/AdwordsClientCustomerIdSaverModalComponent';
import VideoModalBox from '../../../utils/VideoModalBox';
import GooglePermissionPopup from '../../../utils/GooglePermissionPopup';


export default class FacebookAccountsIndex extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isBusy: false,
            errors: [],
            facebookAccounts: [],
            redirectTo: null,
        }

        this.getFacebookAccounts = this.getFacebookAccounts.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleConnectFacebookAccount = this.handleConnectFacebookAccount.bind(this);

    }

    componentDidMount() {
        document.title = 'Manage Facebook Accounts';

        this.getFacebookAccounts();
    }

    render() {
        return (

            <div className="container-xl bg-white  d-flex flex-column justify-content-center component-wrapper" >

                <div className="container p-5">
                    <div className="row ml-0 mr-0">
                        <div className="col-12">
                            <h2 className="heading-section gaa-title">Connect Multiple Facebook Accounts</h2>
                        </div>
                    </div>

                    <div className="row ml-0 mr-0">
                        <div className="col-12">
                            <ErrorAlert errors={this.state.errors} />
                        </div>
                    </div>
                    <div className="row ml-0 mr-0 my-5">
                        <div className="col-12 text-center text-md-right text-lg-right">
                            <a href="#"
                                onClick={this.handleConnectFacebookAccount}
                                className="btn gaa-btn-primary text-white" >
                                Connect New Facebook Account
                            </a>
                        </div>
                    </div>
                    <div className="row ml-0 mr-0">
                        <div className="col-12">
                            <div className="table-responsive">
                                <table className="table table-hover gaa-hover table-bordered">
                                    <thead>
                                        <tr>
                                            <th className="col-1">Profile Image</th>
                                            <th>Facebook Account</th>
                                            <th>Email</th>
                                            <th className="col-4">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            this.state.facebookAccounts.map(facebookAccount => {
                                                return <tr key={facebookAccount.id}>
                                                    <td><img src={facebookAccount.facebook_avatar_url} className="social-profile-picture" /></td>
                                                    <td>
                                                        {facebookAccount.name}<br />
                                                    </td>
                                                    <td>{facebookAccount.facebook_user_email}</td>
                                                    <td className="text-center">
                                                        <button onClick={() => this.handleDelete(facebookAccount.id)} className="btn ad-ga-action gaa-btn-danger">
                                                            <i className="fa fa-unlink mr-0 mr-md-2 mr-lg"></i>
                                                            <span className="ad-ga-action-text">Disconnect</span>
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
                </div>

            </div>
        );
    }

    getFacebookAccounts() {
        this.setState({ isBusy: true })
        HttpClient.get('/settings/facebook-accounts').then(resp => {
            this.setState({ facebookAccounts: resp.data.facebook_accounts, isBusy: false });
        }, (err) => {
            this.setState({ isBusy: false, errors: (err.response).data });
        }).catch(err => {
            this.setState({ isBusy: false, errors: err });
        });
    }

    handleConnectFacebookAccount(){
        swal.fire({
            customClass: {
                htmlContainer: "py-3",
            },
            showCloseButton: true,
            title: "Connect with Facebook",
            text: "Connect your Facebook account to create automatic annotations for new posts; when you reach a post goal or run campaigns.",
            confirmButtonClass: "rounded-pill btn btn-primary bg-primary px-4 font-weight-bold",
            confirmButtonText: "<a href='/socialite/facebook' class='text-white'><i class='mr-2 fa fa-facebook'> </i>" + "Connect Facebook Account</a>",
        })
    }

    handleDelete(id) {
        this.setState({ isBusy: true });
        HttpClient.delete(`/settings/facebook-account/${id}`).then(resp => {
            Toast.fire({
                icon: 'success',
                title: "Account removed.",
            });
            let facebookAccounts = this.state.facebookAccounts;
            facebookAccounts = facebookAccounts.filter(ga => ga.id != id);
            this.setState({ isBusy: false, facebookAccounts: facebookAccounts })
        }, (err) => {
            this.setState({ isBusy: false, errors: (err.response).data });
        }).catch(err => {
            this.setState({ isBusy: false, errors: err });
        });
    }

}
