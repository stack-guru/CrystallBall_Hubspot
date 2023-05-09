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

        console.log(this.props.userDataSources)
        return (
            <div className="popupContent modal-facebook">
                {(!this.props.userFacebookAccountsExists || !this.props.userServices['is_ds_facebook_tracking_enabled']) && this.state.showDescription ? 
                <DescriptionModal
                    serviceName={"Facebook"}
                    closeModal={this.props.closeModal}
                    description={"For every project completed or modified on Facebook, our automation tool enables you to monitor basic with basic details. Facebook Tracking watches every commit on your provided repository."}
                    changeModal={this.changeModal.bind(this)}
                    userAccountsExists={this.props.userFacebookAccountsExists}
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
                    updateUserService={this.props.updateUserService}
                    updateTrackingStatus={this.updateTrackingStatus.bind(this)}
                    used_credits={this.props.userDataSources.facebook_tracking?.length}
                    total_credits={this.props.user.price_plan.facebook_credits_count}
                    ds_data={this.props.userDataSources.facebook_tracking}
                    onCheckCallback={this.props.userDataSourceAddHandler}
                    onUncheckCallback={this.props.userDataSourceDeleteHandler}
                    ga_property_id={this.props.ga_property_id}
                    reloadWebMonitors={this.props.reloadWebMonitors}
                    user={this.props.user}
                    loadUserDataSources={this.props.loadUserDataSources}
                    updateGAPropertyId={this.props.updateGAPropertyId}
                />
                </>}
            </div>
        );
    }
}

export default Facebook;
