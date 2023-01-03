import React from "react";
import UserAnnotationColorPicker from "../../helpers/UserAnnotationColorPickerComponent";
import BitbucketTracking from "../../utils/BitbucketTracking";

class Bitbucket extends React.Component {
    render() {
        return (
            <div className='popupContent modal-bitbucket'>
                <div>
                    <div className="px-2">
                        <h2>
                            Bitbucket Tracking{" "}
                            <UserAnnotationColorPicker
                                name="bitbucket_tracking"
                                value={
                                    this.props.userAnnotationColors
                                        .bitbucket_tracking
                                }
                                updateCallback={
                                    this.props
                                        .updateUserAnnotationColors
                                }
                            />
                        </h2>
                    </div>
                    <div className="px-2 text-center">
                        <label className="trigger switch">
                            <input
                                type="checkbox"
                                name="is_ds_bitbucket_tracking_enabled"
                                onChange={
                                    this.props.serviceStatusHandler
                                }
                                checked={
                                    this.props.userServices
                                        .is_ds_bitbucket_tracking_enabled
                                }
                            />
                            <span className={`slider round`} />
                        </label>
                    </div>
                    <div className="list-wrapper">
                        <p
                            style={{
                                fontSize: "13px",
                            }}
                        >
                            Credits:{" "}
                            {
                                this.props.userDataSources
                                    .bitbucket_tracking?.length
                            }
                            /
                            {this.props.user.price_plan
                                .bitbucket_credits_count == -1
                                ? 0
                                : this.props.user.price_plan
                                        .bitbucket_credits_count}
                        </p>
                    </div>
                </div>
                <BitbucketTracking
                    used_credits={
                        this.props.userDataSources.bitbucket_tracking
                            ?.length
                    }
                    total_credits={
                        this.props.user.price_plan.bitbucket_credits_count
                    }
                    ds_data={this.props.userDataSources.bitbucket_tracking}
                    onCheckCallback={this.props.userDataSourceAddHandler}
                    onUncheckCallback={
                        this.props.userDataSourceDeleteHandler
                    }
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
