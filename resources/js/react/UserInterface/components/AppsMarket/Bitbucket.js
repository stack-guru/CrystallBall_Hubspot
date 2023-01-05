import React from "react";
import UserAnnotationColorPicker from "../../helpers/UserAnnotationColorPickerComponent";
import BitbucketTracking from "../../utils/BitbucketTracking";
import ModalHeader from "./common/ModalHeader";

class Bitbucket extends React.Component {
    render() {
        return (
            <div className="popupContent modal-bitbucket">
                <ModalHeader
                    userAnnotationColors={this.props.userAnnotationColors}
                    updateUserAnnotationColors={ this.props.updateUserAnnotationColors }
                    userServices={this.props.userServices}
                    serviceStatusHandler={this.props.serviceStatusHandler}
                    closeModal={this.props.closeModal}
                    serviceName={"Bitbucket Tracking"}
                    colorKeyName={"bitbucket_tracking"}
                    dsKeyName={"is_ds_bitbucket_tracking_enabled"}
                    creditString={`${ this.props.userDataSources.bitbucket_tracking?.length } / ${ this.props.user.price_plan.bitbucket_credits_count == -1 ? 0 : this.props.user.price_plan.bitbucket_credits_count }`}/>

                <BitbucketTracking
                    used_credits={this.props.userDataSources.bitbucket_tracking?.length}
                    total_credits={this.props.user.price_plan.bitbucket_credits_count}
                    ds_data={this.props.userDataSources.bitbucket_tracking}
                    onCheckCallback={this.props.userDataSourceAddHandler}
                    onUncheckCallback={this.props.userDataSourceDeleteHandler}
                    ga_property_id={this.props.ga_property_id}
                    reloadWebMonitors={this.props.reloadWebMonitors}
                    user={this.props.user}
                    loadUserDataSources={this.props.loadUserDataSources}
                    updateGAPropertyId={this.props.updateGAPropertyId}
                />
            </div>
        );
    }
}

export default Bitbucket;
