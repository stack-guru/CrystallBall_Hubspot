import React from "react";
import TwitterTracking from "../../utils/TwitterTracking";
import ModalHeader from "./common/ModalHeader";

class Twitter extends React.Component {
    render() {
        return (
            <div className='popupContent modal-CreateAnnotation'>
                <ModalHeader
                    description={'Trigger latest 100 tweets from account timeline'}
                    userAnnotationColors={this.props.userAnnotationColors}
                    updateUserAnnotationColors={ this.props.updateUserAnnotationColors }
                    userServices={this.props.userServices}
                    serviceStatusHandler={this.props.serviceStatusHandler}
                    closeModal={this.props.closeModal}
                    serviceName={"Create Annotation"}
                    colorKeyName={"Create_annotation"}
                    dsKeyName={"is_ds_create_annotation_enabled"}
                    creditString={'∞'}
                />

                <TwitterTracking />
            </div>
        );
    }
}

export default Twitter;
