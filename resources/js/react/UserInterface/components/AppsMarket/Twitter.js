import React from "react";
import TwitterTracking from "../../utils/TwitterTracking";
import DescrptionModalNormal from "./common/DescriptionModalNormal";
import ModalHeader from "./common/ModalHeader";

class Twitter extends React.Component {
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
            <div className='popupContent modal-twitter'>
                {(!this.props.userTwitterAccountsExists || !this.props.userServices['is_ds_twitter_tracking_enabled']) && this.state.showDescription ? 
                <DescrptionModalNormal
                    changeModal = {this.changeModal.bind(this)}
                    serviceName={"Twitter Tracking"}
                    description={`Here is an automation tool designed to see your Twitter stats. See your numbers on likes, retweets, and impressions on a single dashboard. Switch on and add your page link to get started.`}
                    userServices={this.props.userServices}
                    closeModal={this.props.closeModal}
                    userAccountsExists={this.props.userTwitterAccountsExists}

                /> :
                <>
                <ModalHeader
                    isActiveTracking={this.state.isActiveTracking}
                    description={'Trigger latest 100 tweets from account timeline'}
                    userAnnotationColors={this.props.userAnnotationColors}
                    updateUserAnnotationColors={ this.props.updateUserAnnotationColors }
                    userServices={this.props.userServices}
                    serviceStatusHandler={this.props.serviceStatusHandler}
                    closeModal={this.props.closeModal}
                    serviceName={"Twitter Tracking"}
                    colorKeyName={"twitter_tracking"}
                    dsKeyName={"is_ds_twitter_tracking_enabled"}
                    creditString={`${ this.props.userDataSources.twitter_tracking?.length } / ${ !this.props.user.price_plan.twitter_credits_count ? 0 : this.props.user.price_plan.twitter_credits_count}`}
                />

                <TwitterTracking 
                    updateUserService={this.props.updateUserService}
                    updateTrackingStatus={this.updateTrackingStatus.bind(this)}
                    used_credits={this.props.userDataSources.twitter_tracking?.length}
                    total_credits={this.props.user.price_plan.twitter_credits_count}
                    ds_data={this.props.userDataSources.twitter_tracking}
                    onCheckCallback={this.props.userDataSourceAddHandler}
                    onUncheckCallback={this.props.userDataSourceDeleteHandler}
                    ga_property_id={this.props.ga_property_id}
                    reloadWebMonitors={this.props.reloadWebMonitors}
                    user={this.props.user}
                    loadUserDataSources={this.props.loadUserDataSources}
                    updateGAPropertyId={this.props.updateGAPropertyId}
                />
                </>
                }


            </div>
        );
    }
}

export default Twitter;
