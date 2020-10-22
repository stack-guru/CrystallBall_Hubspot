import React from 'react';
import { Link } from 'react-router-dom';
import HttpClient from '../../utils/HttpClient';
import { toast } from "react-toastify";

class IndexAPIKey extends React.Component {

    constructor() {
        super();
        this.state = {
            error: '',
            apiKeys: []
        }
        this.generateAPIKey = this.generateAPIKey.bind(this)
    }
    componentDidMount() {
        document.title = 'API Keys';

        this.setState({ isBusy: true });
        HttpClient({ url: `/oauth/personal-access-tokens`, baseURL: "/" })
            .then(response => {
                this.setState({ isBusy: false, apiKeys: response.data });
            }, (err) => {
                console.log(err);
                this.setState({ isBusy: false, errors: (err.response).data });
            }).catch(err => {
                console.log(err)
                this.setState({ isBusy: false, errors: err });
            });
    }

    generateAPIKey() {
        this.setState({ isBusy: true });
        HttpClient({ url: `/oauth/personal-access-tokens`, baseURL: "/", method: 'post', data: { name: 'Laravel Personal Access Client', scopes: [] } })
            .then(response => {
                toast.success("Token generated.");
                let tokens = this.state.apiKeys;
                tokens.push(response.data.token);
                this.setState({ isBusy: false, apiKeys: tokens, accessToken: response.data.accessToken })
            }, (err) => {
                console.log(err);
                this.setState({ isBusy: false, errors: (err.response).data });
            }).catch(err => {
                console.log(err);
                this.setState({ isBusy: false, errors: err });
            });
    }

    render() {
        return (
            <div className="container-xl bg-white p-5 d-flex flex-column justify-content-center" style={{ minHeight: '100vh' }}>
                <section className="ftco-section  p-3 " id="inputs" style={{ minHeight: '100vh' }}>
                    <div className="container p-5">
                        <div className="row mb-5">
                            <div className="col-md-12">
                                <h2 className="heading-section">API Keys</h2>
                                <button className="btn btn-success" onClick={() => { this.generateAPIKey() }}>Generate</button>
                            </div>
                        </div>
                        {this.state.accessToken ? <div className="row">
                            <div className="col-md-12">
                                <h4 className="heading-section">New access token generated. This token can only be shown once.</h4>
                                <textarea className="form-control" value={this.state.accessToken} readOnly/>
                            </div>
                        </div>
                            : null}
                        <div className="row">
                            <div className="col-12">
                                <table className="table table-hover table-bordered">
                                    <thead>
                                        <tr>
                                            <th>Token</th>
                                            <th>Created At</th>
                                            <th>Expires At</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.apiKeys.map(apiKey => {
                                            return <tr key={apiKey.id}><td>{apiKey.id}</td><td>{apiKey.created_at}</td><td>{apiKey.expires_at}</td></tr>
                                        })}
                                    </tbody>
                                </table>
                            </div>
                            <div className="col-12"></div>
                        </div>
                    </div>
                </section>
            </div>
        );
    }

}

export default IndexAPIKey;
