import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import HttpClient from '../../utils/HttpClient';
import { toast } from "react-toastify";
import ErrorAlert from '../../utils/ErrorAlert';
import UserAnnotationColorPicker from '../../helpers/UserAnnotationColorPickerComponent';

class IndexAPIKey extends React.Component {

    constructor() {
        super();
        this.state = {
            error: '',
            apiKeys: [],
            token_name: '',
            redirectTo: null,
            userAnnotationColors: {},
        }
        this.generateAPIKey = this.generateAPIKey.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleDelete = this.handleDelete.bind(this)
        this.copyAccessToken = this.copyAccessToken.bind(this)

        this.updateUserAnnotationColors = this.updateUserAnnotationColors.bind(this);
        this.loadUserAnnotationColors = this.loadUserAnnotationColors.bind(this);
    }

    componentDidMount() {
        document.title = 'API Keys';

        this.setState({ isBusy: true });
        HttpClient({ url: `/oauth/personal-access-tokens`, baseURL: "/" })
            .then(response => {
                this.setState({ isBusy: false, apiKeys: response.data });
            }, (err) => {

                this.setState({ isBusy: false, errors: (err.response).data });
            }).catch(err => {

                this.setState({ isBusy: false, errors: err });
            });

        this.loadUserAnnotationColors();
    }

    copyAccessToken() {
        let copyText = document.getElementById("input-access-token");
        copyText.select();
        copyText.setSelectionRange(0, 99999);
        document.execCommand("copy");
    }

    generateAPIKey() {
        if (this.props.currentPricePlan.has_api == 0) {
            swal("Upgrade to Basic Plan!", "API feature is not available in this package.", "warning").then(value => {
                this.setState({ redirectTo: '/settings/price-plans' });
            })
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

                        this.setState({ isBusy: false, errors: (err.response).data });
                    }).catch(err => {

                        this.setState({ isBusy: false, errors: err });
                    });
            }
        }
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    handleDelete(e) {
        let tokenId = e.target.getAttribute('data-token-id');
        if (!this.state.isBusy && tokenId) {
            this.setState({ isBusy: true });
            HttpClient({ url: `/oauth/personal-access-tokens/${tokenId}`, baseURL: "/", method: 'delete' })
                .then(response => {
                    toast.error("Token removed.");
                    let tokens = this.state.apiKeys;
                    tokens = tokens.filter(t => t.id !== tokenId);
                    this.setState({ isBusy: false, apiKeys: tokens })
                }, (err) => {

                    this.setState({ isBusy: false, errors: (err.response).data });
                }).catch(err => {

                    this.setState({ isBusy: false, errors: err });
                });
        }
    }

    loadUserAnnotationColors() {
        if (!this.state.isLoading) {
            this.setState({ isLoading: true });
            HttpClient.get(`/data-source/user-annotation-color`).then(resp => {
                this.setState({ isLoading: false, userAnnotationColors: resp.data.user_annotation_color });
            }, (err) => {
                this.setState({ isLoading: false, errors: (err.response).data });
            }).catch(err => {
                this.setState({ isLoading: false, errors: err });
            })
        }
    }

    updateUserAnnotationColors(userAnnotationColors) {
        this.setState({ userAnnotationColors: userAnnotationColors });
    }

    render() {
        if (this.state.redirectTo) return <Redirect to={this.state.redirectTo} />
        return (
            <div className="container-xl bg-white  d-flex flex-column justify-content-center component-wrapper" >
                <section className="ftco-section " id="inputs" >
                    <div className="container p-5">
                        <div className="row mb-5">
                            <div className="col-md-12">
                                <h2 className="heading-section gaa-title">API Keys <UserAnnotationColorPicker name="api" value={this.state.userAnnotationColors.api} updateCallback={this.updateUserAnnotationColors} /></h2>
                                <sub className="float-right"><a href="/documentation" target="_blank">Check documentation</a></sub>
                            </div>
                            <div className="col-md-12">
                                <ErrorAlert errors={this.state.errors} />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-4">
                                <label>Token Name:</label>
                                <input type="text" className="form-control" name="token_name" onChange={this.handleChange} value={this.state.token_name} />
                            </div>
                            <div className="col-md-4">
                                <label>Access Token:</label>
                                <textarea className="form-control" value={this.state.accessToken} readOnly id="input-access-token" />
                                <label className="text-danger">Token will only appear here, once.</label>
                            </div>
                            <div className="col-md-4">
                                <br />
                                <br />
                                <button className="btn btn-success" onClick={() => { this.generateAPIKey() }}>Generate</button>
                                <button className="ml-3 btn btn-info" onClick={() => { this.copyAccessToken() }}>Copy</button>
                            </div>
                        </div>

                        <div className="row mt-5">
                            <div className="col-12">
                                <table className="table table-hover table-bordered table-striped">
                                    <thead>
                                        <tr>
                                            <th>Token Name</th>
                                            <th>Created At</th>
                                            <th>Expires At</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.apiKeys.map(apiKey => {
                                            return <tr key={apiKey.id}>
                                                <td>
                                                    {apiKey.name}
                                                </td>
                                                <td>
                                                    {moment(apiKey.created_at).format("YYYY-MM-DD")}
                                                </td>
                                                <td>
                                                    {moment(apiKey.expires_at).format("YYYY-MM-DD")}
                                                </td>
                                                <td className="text-center">
                                                    <button className="btn gaa-btn-danger btn-sm" type="button" onClick={this.handleDelete} data-token-id={apiKey.id}><i className="fa fa-trash"></i></button>
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
