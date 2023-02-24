import React from "react";
import UserAnnotationColorPicker from "../../helpers/UserAnnotationColorPickerComponent";
import AddKeyword from "../../utils/AddKeyword";
import DSWebMonitorsSelect from "../../utils/DSWebMonitorsSelect";
import EditKeyword from "../../utils/EditKeyword";
import ManageKeywords from "../../utils/ManageKeywords";
import ModalHeader from "./common/ModalHeader";
import DescrptionModalNormal from "./common/DescriptionModalNormal";

class RankTracking extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isRead: false,
            isActiveTracking: false,
        }
    }

    changeModal() {
        this.setState({isRead: true})
    }

    updateTrackingStatus = status => {
        this.setState({ isActiveTracking: status })
    }
    componentDidMount() {
        this.props.addKeywordToggler();
    }
    render() {
        return (
            <div className="popupContent modal-rankTracking">
                { !this.state.isRead && !this.props.userServices['is_ds_keyword_tracking_enabled'] && !(this.props.dsKeySkip === 'is_ds_keyword_tracking_enabled') ?
                <DescrptionModalNormal
                    changeModal = {this.changeModal.bind(this)}
                    serviceName={"Rank Tracking"}
                    description={"Track daily changes of your target keywords in your target area for your business or competitors."}
                    userServices={this.props.userServices}
                    closeModal={this.props.closeModal}

                /> :
                <>
                <ModalHeader
                    userAnnotationColors={this.props.userAnnotationColors}
                    updateUserAnnotationColors={
                        this.props.updateUserAnnotationColors
                    }
                    isActiveTracking={this.state.isActiveTracking}
                    userServices={this.props.userServices}
                    serviceStatusHandler={this.props.serviceStatusHandler}
                    closeModal={this.props.closeModal}
                    serviceName={"Rank Tracking"}
                    colorKeyName={"keyword_tracking"}
                    dsKeyName={"is_ds_keyword_tracking_enabled"}
                    creditString={`${this.props.totalDfsKeywordCreditsUsed}/
                    ${
                        this.props.user.price_plan.keyword_tracking_count == -1
                            ? 0
                            : this.props.user.price_plan.keyword_tracking_count
                    }`}
                />
                <div className="apps-bodyContent">
                    {/* <p
                        className="ds-update-text m-0 px-2 text-right"
                        onClick={() => this.props.manageKeywordShow(true)}
                    >
                        Manage Keywords
                    </p> */}
                    <div className="white-box">
                        {this.props.editKeyword ? (
                            <EditKeyword
                                keyword_id={this.props.editKeyword_keyword_id}
                                total_credits={
                                    this.props.user.price_plan
                                        .keyword_tracking_count
                                }
                                used_credits={
                                    this.props.totalDfsKeywordCreditsUsed
                                }
                                keyword_configuration_id={
                                    this.props
                                        .editKeyword_keyword_configuration_id
                                }
                                addKeywordCallback={
                                    this.props.addKeywordToggler
                                }
                            />
                        ) : (
                            <AddKeyword
                                used_credits={
                                    this.props.totalDfsKeywordCreditsUsed
                                }
                                total_credits={
                                    this.props.user.price_plan
                                        .keyword_tracking_count
                                }
                                updateTrackingStatus={this.updateTrackingStatus.bind(this)}
                                updateUserService={this.props.updateUserService}
                                onAddCallback={this.props.keywordAddHandler}
                                ga_property_id={this.props.ga_property_id}
                                reloadWebMonitors={this.props.reloadWebMonitors}
                                user={this.props.user}
                                loadKeywordsCallback={
                                    this.props.loadKeywordTrackingKeywords
                                }
                                loadUserDataSources={
                                    this.props.loadUserDataSources
                                }
                                updateGAPropertyId={
                                    this.props.updateGAPropertyId
                                }
                            />
                        )}
                    </div>

                    {/* {this.props.manage_keyword_show == true ? ( */}
                    {this.props.editKeyword ? null : (
                        <div className="white-box">
                            <ManageKeywords
                                keywords={this.props.dfsKeywords}
                                loadKeywordsCallback={
                                    this.props.loadKeywordTrackingKeywords
                                }
                                editKeywordCallback={
                                    this.props.editKeywordToggler
                                }
                                closeManageKeywordPopup={() => {
                                    this.props.manage_keyword_popup_handler();
                                    this.props.manageKeywordShow(false);
                                }}
                            />
                        </div>
                    )}
                    {/* ) : null} */}
                </div>
                </>
                }
            </div>
        );
    }
}

export default RankTracking;
