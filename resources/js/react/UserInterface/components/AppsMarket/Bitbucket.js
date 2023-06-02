import React from "react";
import UserAnnotationColorPicker from "../../helpers/UserAnnotationColorPickerComponent";
import BitbucketTracking from '../../utils/BitBucketTracking'
import ModalHeader from "./common/ModalHeader";
import DescrptionModal from "./common/DescriptionModal";

class Bitbucket extends React.Component {

    constructor(props) {
        super(props);

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
            <div className="popupContent modal-bitbucket">
                {(!this.props.userBitbucketAccountsExists || !this.props.userServices['is_ds_bitbucket_tracking_enabled']) && this.state.showDescription ? 
                <DescrptionModal
                serviceName={"Bitbucket"}
                closeModal={this.props.closeModal}
                description={"Track and monitor your Bitbucket projects effortlessly with our automation tool. Stay updated on every project completion or modification with basic details. Bitbucket Tracking watches every commit made to your specified repository, ensuring you never miss a beat."}
                changeModal={this.changeModal.bind(this)}
                userAccountsExists={this.props.userBitbucketAccountsExists}
                />
                : <>
                <ModalHeader
                    isActiveTracking={this.state.isActiveTracking}
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
                    updateUserService={this.props.updateUserService}
                    updateTrackingStatus={this.updateTrackingStatus.bind(this)}
                    used_credits={this.props.userDataSources.bitbucket_tracking?.length}
                    total_credits={this.props.user.price_plan.bitbucket_credits_count}
                    ds_data={this.props.userDataSources.bitbucket_tracking}
                    onCheckCallback={this.props.userDataSourceAddHandler}
                    onUncheckCallback={this.props.userDataSourceDeleteHandler}
                    userDataSourceUpdateHandler={this.props.userDataSourceUpdateHandler}
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

export default Bitbucket;
