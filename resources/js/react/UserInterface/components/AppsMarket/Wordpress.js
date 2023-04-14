import React from "react";
import ModalHeader from "./common/ModalHeader";
import DescrptionModalNormal from "./common/DescriptionModalNormal";
import HttpClient from '../../utils/HttpClient';
import Toast from "../../utils/Toast";
import IndexAPIKey from "../apiKey/IndexAPIKey";

class Wordpress extends React.Component {

    constructor() {
        super();
        this.state = {
            error: '',
            apiKeys: [],
            isRead: false,
            token_name: '',
            redirectTo: null,
            userAnnotationColors: {},
            events: [
                'Wordpress Updates',
                'Pages Created', 
                'Pages Updated', 
                'Pages Deleted',
                'Posts Created',
                'Posts Updated',
                'Posts Deleted',
            ],
        }
        this.generateAPIKey = this.generateAPIKey.bind(this)
        this.copyAccessToken = this.copyAccessToken.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    changeModal() {
        this.setState({isRead: true})
    }

    copyAccessToken() {
        let copyText = document.getElementById("input-access-token");
        copyText.select();
        copyText.setSelectionRange(0, 99999);
        document.execCommand("copy");
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    generateAPIKey() {
        if (this.props.currentPricePlan.has_api) {
            if (!this.state.isBusy) {
                this.setState({ isBusy: true });
                HttpClient({ url: `/oauth/personal-access-tokens`, baseURL: "/", method: 'post', data: { name: this.state.token_name, scopes: [] } })
                    .then(response => {
                        Toast.fire({
                            icon: 'success',
                            title: "Token generated."
                        });
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
            this.props.upgradePopup('api-upgrade')
        }
    }

    render() {
        return (
            <div className="popupContent modal-wordpressUpdates">
                { !this.state.isRead && !this.props.userServices['is_ds_wordpress_enabled'] && !(this.props.dsKeySkip === 'is_ds_wordpress_enabled') ?
                <DescrptionModalNormal
                    changeModal = {this.changeModal.bind(this)}
                    serviceName={"Wordpress"}
                    description={"Get our WP plugin installed and monitor the impact of every change on your site. View how your technical, product development, marketing, and content efforts are pulling in new deals."}
                    userServices={this.props.userServices}
                    closeModal={this.props.closeModal}

                /> :
                <>
                <ModalHeader
                    userAnnotationColors={this.props.userAnnotationColors}
                    updateUserAnnotationColors={this.props.updateUserAnnotationColors}
                    userServices={this.props.userServices}
                    serviceStatusHandler={this.props.serviceStatusHandler}
                    closeModal={this.props.closeModal}
                    serviceName={"Wordpress"}
                    colorKeyName={"wordpress"}
                    dsKeyName={"is_ds_wordpress_enabled"}
                    creditString={null}
                />

                <div className="apps-bodyContent">
                    <div className="white-box">
                        <div className="contentBox">
                            <p className="mb-0">1. Install our plugin from <a href="https://wordpress.org/plugins/crystal-ball-insight/" target="_blank">Plugins</a> market</p>
                        </div>
                        <div className="contentBox">
                            <p className="mb-0">Select events</p>

                            <div className="checkboxes">
                                {this.state.events?.map((event) => {
                                    return (
                                        <label className="themeNewCheckbox d-flex align-items-center justify-content-start textDark" key={event}>
                                            <input value={event} type="checkbox" defaultChecked={true} name='event-row' />
                                            <span>{event}</span>
                                        </label>
                                    )
                                })}
                            </div>

                        </div>
                        <div className="contentBox d-flex flex-column">
                            <p className="mb-3">2. Create API Key</p>
                            <IndexAPIKey upgradePopup={this.props.upgradePopup} currentPricePlan={this.props.currentPricePlan} formOnly={true} />
                            {/* <form className='apiKeyForm d-block' onSubmit={this.handleSubmit} encType="multipart/form-data" id="support-form-container">
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
                            </form> */}

                            {/* <div className="d-flex mb-3 tokenBox">
                                <div className="themeNewInputGroup">
                                    <input type="text" className="form-control" id="token_name" placeholder="Token name" />
                                </div>
                                <button>Generate</button>
                            </div>

                            <div class="generated_access_token themeNewInputGroup mb-3">
                                <textarea className="form-control" id="generated_access_token" placeholder="Generated access token..."></textarea>
                            </div>

                            <div class="alert alert-info" role="alert">
                                <p className="mb-0 d-flex flex-column"><span>The token will appear only once. Make sure to copy it before closing this popup</span></p>
                            </div> */}


                        </div>
                        <div className="contentBox">
                            <p className="mb-0">3. Insert API Key in the plugin’s Settings page, and you’re done!</p>
                        </div>
                        {/* <div className="checkBoxList">
                            <label className='themeNewCheckbox d-flex align-items-center justify-content-start' for='last_year_only'>
                                <input type="checkbox" id='last_year_only' onChange={(e) => {
                                    if (e.target.checked) {
                                        this.props.userDataSourceAddHandler({ code: "wordpress", name: "WordpressUpdate", country_name: null, retail_marketing_id: null, value: "last year",});
                                    } else { this.props.userDataSourceDeleteHandler(this.props.userDataSources.wordpress[0].id, "wordpress");
                                    }}}
                                    checked={ this.props.userDataSources.wordpress && this.props.userDataSources.wordpress.length > 0 }
                                    name="last_year_only"
                                />
                                <span>Show last year only</span>
                            </label>
                        </div> */}
                    </div>
                </div>
                </>
                }
            </div>
        );
    }
}

export default Wordpress;
