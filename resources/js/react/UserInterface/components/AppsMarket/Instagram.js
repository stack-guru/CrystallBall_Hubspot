import React from "react";
import InstagramTracking from "../../utils/InstagramTracking";
import ModalHeader from "./common/ModalHeader";
import DescriptionModal from "./common/DescriptionModal";
class Instagram extends React.Component {

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
            <div className="popupContent modal-instagram">
                {(!this.props.userInstagramAccountsExists || !this.props.userServices['is_ds_instagram_tracking_enabled']) && this.state.showDescription ? 
                <DescriptionModal
                    serviceName={"Instagram"}
                    closeModal={this.props.closeModal}
                    description={"Gain valuable insights into your Instagram account with automated annotations. Track likes, comments, and follower growth to measure the impact of your content and audience engagement. Stay on top of your Instagram performance, optimize your posts, and make data-driven decisions effortlessly."}
                    changeModal={this.changeModal.bind(this)}
                    userAccountsExists={this.props.userInstagramAccountsExists}
                />
                : <>
                <ModalHeader
                    isActiveTracking={this.state.isActiveTracking}
                    userAnnotationColors={this.props.userAnnotationColors}
                    updateUserAnnotationColors={ this.props.updateUserAnnotationColors }
                    userServices={this.props.userServices}
                    serviceStatusHandler={this.props.serviceStatusHandler}
                    closeModal={this.props.closeModal}
                    serviceName={"Instagram Tracking"}
                    colorKeyName={"instagram_tracking"}
                    dsKeyName={"is_ds_instagram_tracking_enabled"}
                    creditString={`${ this.props.userDataSources.instagram_tracking?.length } / ${ !this.props.user.price_plan.instagram_credits_count ? 0 : this.props.user.price_plan.instagram_credits_count}`}
                />

                <InstagramTracking
                    serviceName={"Instagram"}
                    updateUserService={this.props.updateUserService}
                    updateTrackingStatus={this.updateTrackingStatus.bind(this)}
                    used_credits={this.props.userDataSources.instagram_tracking?.length}
                    total_credits={this.props.user.price_plan.instagram_credits_count}
                    ds_data={this.props.userDataSources.instagram_tracking}
                    onCheckCallback={this.props.userDataSourceAddHandler}
                    onUncheckCallback={this.props.userDataSourceDeleteHandler}
                    ga_property_id={this.props.ga_property_id}
                    reloadWebMonitors={this.props.reloadWebMonitors}
                    user={this.props.user}
                    loadUserDataSources={this.props.loadUserDataSources}
                    updateGAPropertyId={this.props.updateGAPropertyId}
                    serviceStatusHandler={this.props.serviceStatusHandler}
                    sectionToggler={this.props.closeModal}
                />
                </>}
            </div>
        );
    }
}

export default Instagram;
