import React from "react";
import UserAnnotationColorPicker from "../../helpers/UserAnnotationColorPickerComponent";
import BitbucketTracking from "../../utils/BitbucketTracking";
import GithubTracking from "../../utils/GithubTracking";
import ModalHeader from "./common/ModalHeader";

class Github extends React.Component {
    render() {
        return (
            <div className="popupContent modal-github">
                <ModalHeader
                    userAnnotationColors={this.props.userAnnotationColors}
                    updateUserAnnotationColors={
                        this.props.updateUserAnnotationColors
                    }
                    userServices={this.props.userServices}
                    serviceStatusHandler={this.props.serviceStatusHandler}
                    closeModal={this.props.closeModal}
                    serviceName={"Github Tracking"}
                    colorKeyName={"github_tracking"}
                    dsKeyName={"is_ds_github_tracking_enabled"}
                    creditString={`${
                        this.props.userDataSources.github_tracking?.length
                    }
                        /
                        ${
                            this.props.user.price_plan.github_credits_count ==
                            -1
                                ? 0
                                : this.props.user.price_plan
                                      .github_credits_count
                        }`}
                />

                <GithubTracking
                    used_credits={
                        this.props.userDataSources.github_tracking?.length
                    }
                    total_credits={
                        this.props.user.price_plan.github_credits_count
                    }
                    ds_data={this.props.userDataSources.github_tracking}
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

export default Github;
