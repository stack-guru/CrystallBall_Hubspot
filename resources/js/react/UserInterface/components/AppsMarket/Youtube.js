import React from "react";
import ModalHeader from "./common/ModalHeader";
import DescrptionModalNormal from "./common/DescriptionModalNormal";
import YoutubeTracking from "../../utils/YoutubeTracking";

class Youtube extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isRead: false,
            youtubeMonitor: [],
            isActiveTracking: false
        }
    }

    changeModal() {
        this.setState({isRead: true})
    }

    updateTrackingStatus = status => {
        this.setState({ isActiveTracking: status })
    }

    render() {
        return (
            <div className='popupContent modal-apple'>
                { !this.state.isRead && !this.props.userServices['is_ds_youtube_tracking_enabled'] && !(this.props.dsKeySkip === 'is_ds_youtube_tracking_enabled')?
                <DescrptionModalNormal
                    changeModal = {this.changeModal.bind(this)}
                    serviceName={"Youtube"}
                    description={`Staying on top of the latest content and tracking changes to Youtube Monitors can be a challenge\n
                    Simply search for a channel or add a URL, and we'll automatically create annotations in your GA4 environment every time there is a new episode. This means you'll have a clear picture of what's new and how it's impacting your audience, all in one place.`}
                    userServices={this.props.userServices}
                    closeModal={this.props.closeModal}

                /> :
                <>
                <ModalHeader
                    isActiveTracking={this.state.isActiveTracking}
                    userAnnotationColors={this.props.userAnnotationColors}
                    updateUserAnnotationColors={ this.props.updateUserAnnotationColors }
                    userServices={this.props.userServices}
                    serviceStatusHandler={this.props.serviceStatusHandler}
                    closeModal={this.props.closeModal}
                    serviceName={"Youtube"}
                    colorKeyName={"youtube_tracking"}
                    dsKeyName={"is_ds_youtube_tracking_enabled"}

                    // get monitors data to update
                    creditString={`${ this.state.youtubeMonitor?.length } / ${ (this.props.user.price_plan.youtube_credits_count * 1) == -1 ? 0 : this.props.user.price_plan.youtube_credits_count}`}
                />

                <YoutubeTracking
                    user={this.props.user}
                    updateUserService={this.props.updateUserService}
                    onUncheckCallback={this.props.userDataSourceDeleteHandler}
                    updateTrackingStatus={this.updateTrackingStatus.bind(this)}
                    upgradePopup={this.props.upgradePopup}
                    limitReached={(this.state.youtubeMonitor?.length >= (this.props.user.price_plan.youtube_credits_count * 1)) && (this.props.user.price_plan.youtube_credits_count * 1) > 0}
                    existingMonitor={this.state.youtubeMonitor}
                    updateGAPropertyId={this.props.updateGAPropertyId}
                    gaPropertyId={this.props.ga_property_id}
                    serviceStatusHandler={this.props.serviceStatusHandler}
                    loadUserDataSources={this.props.loadUserDataSources}
                />
                </>
                }
            </div>
        );
    }
}

export default Youtube;
