import React from 'react';
import { Link } from 'react-router-dom';
import HttpClient from '../../utils/HttpClient';
import { toast } from "react-toastify";

class IndexAPIKey extends React.Component {

    constructor() {
        super();
        this.state = {
            error: '',
            apiKeys: [],
            token_name: ''
        }
        this.generateAPIKey = this.generateAPIKey.bind(this)
        this.handleChange = this.handleChange.bind(this)
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
        if (this.props.currentPricePlan.has_api == 0) {
            swal("Want premium plan!", "API feature is not available in this package.", "warning")
        } else {
            if (!this.state.isBusy) {
                this.setState({ isBusy: true });
                HttpClient({ url: `/oauth/personal-access-tokens`, baseURL: "/", method: 'post', data: { name: this.state.token_name, scopes: [] } })
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
        }
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    render() {

        return (
            <div className="container-xl bg-white  d-flex flex-column justify-content-center component-wrapper" >
                <section className="ftco-section " id="inputs" >
                    <div className="container p-5">
                        <div className="row mb-5">
                            <div className="col-md-12">
                                <h2 className="heading-section gaa-title">API Keys</h2>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-4">
                                <label>Token Name:</label>
                                <input type="text" className="form-control" name="token_name" onChange={this.handleChange} value={this.state.token_name} />
                            </div>
                            <div className="col-md-4">
                                <label>Access Token:</label>
                                <textarea className="form-control" value={this.state.accessToken} readOnly />
                                <label className="text-danger">Token will only appear here, once.</label>
                            </div>
                            <div className="col-1">
                                <br />
                                <br />
                                <button className="btn btn-success" onClick={() => { this.generateAPIKey() }}>Generate</button>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-12">
                                <table className="table table-hover table-bordered table-striped">
                                    <thead>
                                        <tr>
                                            <th>Token</th>
                                            <th>Created At</th>
                                            <th>Expires At</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.apiKeys.map(apiKey => {
                                            return <tr key={apiKey.id}><td>{apiKey.id}</td>
                                                <td>
                                                    {moment(apiKey.created_at).format("YYYY-MM-DD")}
                                                </td>
                                                <td>
                                                    {moment(apiKey.expires_at).format("YYYY-MM-DD")}
                                                </td>
                                            </tr>
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
