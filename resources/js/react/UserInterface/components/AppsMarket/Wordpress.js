import React from "react";
import UserAnnotationColorPicker from "../../helpers/UserAnnotationColorPickerComponent";
import DSGAUDatesSelect from "../../utils/DSGAUDatesSelect";
import ModalHeader from "./common/ModalHeader";
import DescrptionModalNormal from "./common/DescriptionModalNormal";

class Wordpress extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isRead: false
        }
    }

    changeModal() {
        this.setState({isRead: true})
    }

    render() {
        return (
            <div className="popupContent modal-wordpressUpdates">
                { !this.state.isRead && !this.props.userServices['is_ds_wordpress_enabled'] ?  
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
                        <div className="contentBox d-flex flex-column">
                            <p className="mb-3">2. Create API Key</p>

                            <div className="d-flex mb-3 tokenBox">
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
                            </div>
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
