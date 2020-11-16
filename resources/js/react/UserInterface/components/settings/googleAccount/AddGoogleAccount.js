import React from 'react';
import { Link } from 'react-router-dom';
import HttpClient from './../../../utils/HttpClient';
export default class AddGoogleAccount extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isBusy: false,
            google_accounts: []
        }
    }


    componentDidMount() {

        this.setState({ isBusy: true })
        HttpClient.get('/settings/google-account').then(resp => {
            this.setState({ google_accounts: resp.data.google_accounts, isBusy: false });
        }, (err) => {
            console.log(err);
            this.setState({ isBusy: false, errors: (err.response).data });
        }).catch(err => {
            console.log(err)
            this.setState({ isBusy: false, errors: err });
        });
    }

    render() {
        return (
            <div className="container-xl bg-white  d-flex flex-column justify-content-center component-wrapper" >

                <div className="container p-5">
                    <div className="row ml-0 mr-0 my-5">
                        <div className="col-12 text-right">
                            <a href="/settings/google-account/create" className="btn gaa-bg-primary text-white" >
                                Connect New Account
                            </a>
                        </div>
                    </div>
                    <div className="row ml-0 mr-0">
                        <div className="col-12">
                            <table className="table table-hover table-bordered table-striped">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.state.google_accounts.map(googleAccount => {
                                            return <tr key={googleAccount.id}>
                                                <td><img src={googleAccount.avatar} className="social-profile-picture" /></td>
                                                <td>{googleAccount.name}</td>
                                                <td>{googleAccount.email}</td>
                                                <td></td>
                                            </tr>
                                        })
                                    }

                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </div>
        );
    }

}
