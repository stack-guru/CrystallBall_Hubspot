import React from "react";
import UserAnnotationColorPicker from "../../helpers/UserAnnotationColorPickerComponent";
import FacebookTracking from "../../utils/FacebookTracking";
import ModalHeader from "./common/ModalHeader";
import DescriptionModal from "./common/DescriptionModal";
class Facebook extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            isActiveTracking: false,
            showDescription: true
        }
    }

    updateTrackingStatus = status => {
        this.setState({ isActiveTracking: status })
    }

    changeModal = () => {
        this.setState({ showDescription: false })
    }

    render() {
        return (
            <div className="popupContent modal-facebook">
                {(!this.props.userFacebookAccountsExists || !this.props.userServices['is_ds_facebook_tracking_enabled']) && this.state.showDescription ?
                <DescriptionModal
                    serviceName={"Facebook"}
                    closeModal={this.props.closeModal}
                    description={"With our automation tool, track and optimize your Facebook post/Ads performance effortlessly. Set custom thresholds for engagement metrics and unlock automated annotations when goals are met. Gain valuable insights, improve social strategies, and make data-driven decisions for better traffic and leads."}
                    changeModal={this.changeModal.bind(this)}
                    userAccountsExists={this.props.userFacebookAccountsExists}
                    connectText={`Connect your Facebook account to create automatic annotations for new posts; when you reach a post goal or run campaigns.`}
                />
                : <>
                <ModalHeader
                    isActiveTracking={this.state.isActiveTracking}
                    userAnnotationColors={this.props.userAnnotationColors}
                    updateUserAnnotationColors={ this.props.updateUserAnnotationColors }
                    userServices={this.props.userServices}
                    serviceStatusHandler={this.props.serviceStatusHandler}
                    closeModal={this.props.closeModal}
                    serviceName={"Facebook Tracking"}
                    colorKeyName={"facebook_tracking"}
                    dsKeyName={"is_ds_facebook_tracking_enabled"}
                    creditString={`${ this.props.userDataSources.facebook_tracking?.length } / ${ !this.props.user.price_plan.facebook_credits_count ? 0 : this.props.user.price_plan.facebook_credits_count}`}
                />

                <FacebookTracking
                    serviceName={"Facebook"}
                    updateUserService={this.props.updateUserService}
                    updateTrackingStatus={this.updateTrackingStatus.bind(this)}
                    onCheckCallback={this.props.userDataSourceAddHandler}
                    sectionToggler={this.props.closeModal}
                    onUncheckCallback={this.props.userDataSourceDeleteHandler}
                    ga_property_id={this.props.ga_property_id}
                    reloadWebMonitors={this.props.reloadWebMonitors}
                    user={this.props.user}
                    loadUserDataSources={this.props.loadUserDataSources}
                    updateGAPropertyId={this.props.updateGAPropertyId}
                    serviceStatusHandler={this.props.serviceStatusHandler}
                />
                </>}
            </div>
        );
    }
}

export default Facebook;
