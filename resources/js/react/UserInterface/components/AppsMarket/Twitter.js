import React from "react";
import TwitterTracking from "../../utils/TwitterTracking";
import ModalHeader from "./common/ModalHeader";

class Twitter extends React.Component {
    render() {
        return (
            <div className='popupContent modal-twitter'>
                <ModalHeader
                    userAnnotationColors={this.props.userAnnotationColors}
                    updateUserAnnotationColors={
                        this.props.updateUserAnnotationColors
                    }
                    userServices={this.props.userServices}
                    serviceStatusHandler={this.props.serviceStatusHandler}
                    closeModal={this.props.closeModal}

                    serviceName={"Twitter Tracking"}
                    colorKeyName={"twitter_tracking"}
                    dsKeyName={"is_ds_twitter_tracking_enabled"}
                    creditString={'∞'}
                />

                <TwitterTracking />
            </div>
        );
    }
}

export default Twitter;
