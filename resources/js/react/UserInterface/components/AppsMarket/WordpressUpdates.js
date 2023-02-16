import React from "react";
import UserAnnotationColorPicker from "../../helpers/UserAnnotationColorPickerComponent";
import DSGAUDatesSelect from "../../utils/DSGAUDatesSelect";
import ModalHeader from "./common/ModalHeader";
import DescrptionModalNormal from "./common/DescriptionModalNormal";

class WordpressUpdates extends React.Component {
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
                { !this.state.isRead && !this.props.userServices['is_ds_wordpress_updates_enabled'] && !(this.props.dsKeySkip === 'is_ds_wordpress_updates_enabled') ?
                <DescrptionModalNormal
                    changeModal = {this.changeModal.bind(this)}
                    serviceName={"Wordpress Updates"}
                    description={"WordPress Core Updates Our automated annotation feature will inform you when a new version, Security, or Maintenance Release of WordPress is available."}
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
                    serviceName={"Wordpress Updates"}
                    colorKeyName={"wordpress_updates"}
                    dsKeyName={"is_ds_wordpress_updates_enabled"}
                    creditString={null}
                />

                <div className="apps-bodyContent">
                    <div className="white-box">
                        <div className="checkBoxList">
                            <label className='themeNewCheckbox d-flex align-items-center justify-content-start' for='last_year_only'>
                                <input type="checkbox" id='last_year_only' onChange={(e) => {
                                    if (e.target.checked) {
                                        this.props.userDataSourceAddHandler({
                                            code: "wordpress_updates",
                                            name: "WordpressUpdate",
                                            country_name: null,
                                            retail_marketing_id: null,
                                            value: "last year",
                                        });
                                    } else {
                                        this.props.userDataSourceDeleteHandler(
                                            this.props.userDataSources
                                                .wordpress_updates[0].id,
                                            "wordpress_updates"
                                        );
                                    }}}
                                    checked={
                                        this.props.userDataSources
                                            .wordpress_updates &&
                                        this.props.userDataSources.wordpress_updates
                                            .length > 0
                                    }
                                    name="last_year_only"
                                />
                                <span>Show last year only</span>
                            </label>
                        </div>
                    </div>
                </div>
                </>
                }
            </div>
        );
    }
}

export default WordpressUpdates;
