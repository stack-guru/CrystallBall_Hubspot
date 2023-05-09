import React from "react";
import TwitterTracking from "../../utils/TwitterTracking";
import DescrptionModalNormal from "./common/DescriptionModalNormal";
import ModalHeader from "./common/ModalHeader";

class Twitter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isRead: false,
        }
    }

    changeModal() {
        this.setState({isRead: true})
    }

    render() {
        return (
            <div className='popupContent modal-twitter'>
                { !this.state.isRead && !this.props.userServices['is_ds_twitter_tracking_enabled'] && !(this.props.dsKeySkip === 'is_ds_twitter_tracking_enabled')?
                <DescrptionModalNormal
                    changeModal = {this.changeModal.bind(this)}
                    serviceName={"Twitter Tracking"}
                    description={`Here is an automation tool designed to see your Twitter stats. See your numbers on likes, retweets, and impressions on a single dashboard. Switch on and add your page link to get started.`}
                    userServices={this.props.userServices}
                    closeModal={this.props.closeModal}

                /> :
                <>
                <ModalHeader
                    description={'Trigger latest 100 tweets from account timeline'}
                    userAnnotationColors={this.props.userAnnotationColors}
                    updateUserAnnotationColors={ this.props.updateUserAnnotationColors }
                    userServices={this.props.userServices}
                    serviceStatusHandler={this.props.serviceStatusHandler}
                    closeModal={this.props.closeModal}
                    serviceName={"Twitter Tracking"}
                    colorKeyName={"twitter_tracking"}
                    dsKeyName={"is_ds_twitter_tracking_enabled"}
                    creditString={`${ this.props.userDataSources.twitter_tracking?.length } / ${ this.props.user.price_plan.twitter_credits_count == -1 ? 0 : this.props.user.price_plan.twitter_credits_count}`}
                />

                <TwitterTracking />
                </>
                }


            </div>
        );
    }
}

export default Twitter;
