import React from "react";
import UserAnnotationColorPicker from "../../helpers/UserAnnotationColorPickerComponent";
import FacebookTracking from "../../utils/FacebookTracking";
import ModalHeader from "./common/ModalHeader";
import DescriptionModalForGTM from "./common/DescriptionModalForGTM";
class GoogleTagManager extends React.Component {

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
            <div className="popupContent modal-google-tag-manager">
                {(!this.props.userFacebookAccountsExists || !this.props.userServices['is_ds_google_tag_manager_enabled']) && this.state.showDescription ?
                <DescriptionModalForGTM
                    name={"GTM"}
                    serviceName={"Google Tag Manager"}
                    closeModal={this.props.closeModal}
                    description={"Effortlessly track your GTM updates. Our system instantly adds annotations for each new tag you publish, keeping your analytics organized and up-to-date."}
                    changeModal={this.changeModal.bind(this)}
                    userAccountsExists={this.props.userFacebookAccountsExists}
                    connectText={`Connect your Google Tag Manager account to create automatic annotations for new verisons; when you reach a post goal or run campaigns..`}
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

export default GoogleTagManager;
