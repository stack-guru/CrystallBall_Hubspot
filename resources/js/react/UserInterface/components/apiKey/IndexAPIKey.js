import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Container } from 'reactstrap';
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
        if (this.props.currentPricePlan.has_api) {
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
        } else {
            const accountNotLinkedHtml = '' +
                '<div class="">' +
                '<img src="/images/api-upgrade-modal.png" class="img-fluid">' +
                '</div>'

            swal.fire({
                html: accountNotLinkedHtml,
                width: 1000,
                showCancelButton: true,
                showCloseButton: true,
                customClass: {
                    popup: "themePlanAlertPopup",
                    htmlContainer: "themePlanAlertPopupContent",
                    closeButton: 'btn-closeplanAlertPopup',
                },
                cancelButtonClass: "btn-bookADemo",
                cancelButtonText: "Book a Demo",
                confirmButtonClass: "btn-subscribeNow",
                confirmButtonText: "Subscribe now",

            }).then(value => {
                if (value.isConfirmed) window.location.href = '/settings/price-plans'
            });
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
            <div id="apiKeyPage" className="apiKeyPage pageWrapper">
                <Container>
                    <div className="pageHeader apiKeyPageHead d-flex justify-content-between align-items-center">
                        <h2 className="pageTitle d-flex">API Keys{/* <UserAnnotationColorPicker name="api" value={this.state.userAnnotationColors.api} updateCallback={this.updateUserAnnotationColors} /> */}</h2>
                        <a className='btn-theme-outline' href="/documentation" target="_blank">
                            <i><img src={'/icon-document.svg'} alt={'icon'} className="svg-inject" /></i>
                            <span>See documentation</span>
                        </a>
                    </div>

                    <form className='apiKeyForm d-block' onSubmit={this.handleSubmit} encType="multipart/form-data" id="support-form-container">
                        <h3>Generate token</h3>
                        <div className="inputplusbutton d-flex">
                            <div className="themeNewInputGroup themeNewInputStyle">
                                <input placeholder='Token name' type="text" className="form-control" name="token_name" onChange={this.handleChange} value={this.state.token_name} />
                            </div>
                            <button className="btn-theme-success" onClick={(ev) => {ev.preventDefault(); this.generateAPIKey() }}>Generate</button>
                        </div>
                        <div className="themeNewInputGroup mb-4 position-relative">
                            <textarea name="details" className="form-control" placeholder='Generated access token...' value={this.state.accessToken} readOnly id="input-access-token" />
                            <button className="btn-theme-outline-sm" onClick={(ev) => {ev.preventDefault(); this.copyAccessToken() }}>
                                <i><img src={'/icon-copy.svg'} alt={'icon'} className="svg-inject" /></i>
                                <span>Copy</span>
                            </button>
                        </div>
                        <div className='alert alert-info border-0'>
                            <i><img src={'/icon-info.svg'} alt={'icon'} className="svg-inject" /></i>
                            <span>The token will appear only once. Make sure to copy it before leaving this page</span>
                        </div>
                    </form>

                    <div className="postKeys">
                        <h3>Past keys</h3>
                        <div className="postKeysItems">
                            {this.state.apiKeys.map(apiKey => {
                                return (<ul className="postKeyItem" key={apiKey.id}>
                                    <li className='align-align-items-start'>
                                        <h6>{apiKey.name}</h6>
                                        <div class="dropup">
                                            <button className="dropdown-toggle" type="button" id="dropdownMenu2" data-toggle="dropdown" ariaHaspopup="true" ariaExpanded="false">
                                                <i><img src={'/icon-elipsis-v.svg'} alt={'icon'} className="svg-inject" /></i>
                                            </button>
                                            <div className="dropdown-menu" aria-labelledby="dropdownMenu2">
                                                <a className="text-danger" type="button" onClick={this.handleDelete} data-token-id={apiKey.id}>Delete</a>
                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <span>
                                            <span>Created At</span>
                                            <span>{moment(apiKey.created_at).format("YYYY-MM-DD")}</span>
                                        </span>
                                        <span>
                                            <span>Expires At</span>
                                            <span>{moment(apiKey.expires_at).format("YYYY-MM-DD")}</span>
                                        </span>
                                    </li>
                                </ul>)
                            })}
                        </div>
                    </div>
                </Container>
            </div>
        );
    }

}

export default IndexAPIKey;
