import React from "react";
import UserAnnotationColorPicker from "../../helpers/UserAnnotationColorPickerComponent";
import AddKeyword from "../../utils/AddKeyword";
import DSWebMonitorsSelect from "../../utils/DSWebMonitorsSelect";
import ManageKeywords from "../../utils/ManageKeywords";

class RankTracking extends React.Component {
    render() {
        return (
            <div className='popupContent modal-rankTracking'>
                <div className="px-2">
                    <h2>
                        Rank Tracking{" "}
                        <UserAnnotationColorPicker
                            name="keyword_tracking"
                            value={
                                this.props.userAnnotationColors
                                    .keyword_tracking
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
                            name="is_ds_keyword_tracking_enabled"
                            onChange={
                                this.props.serviceStatusHandler
                            }
                            checked={
                                this.props.userServices
                                    .is_ds_keyword_tracking_enabled
                            }
                        />
                        <span className={`slider round`} />
                    </label>
                </div>
                <div className="px-2">
                    <div className="list-wrapper">
                        <p
                            style={{
                                fontSize: "13px",
                            }}
                        >
                            Credits:{" "}
                            {this.props.totalDfsKeywordCreditsUsed}/
                            {this.props.user.price_plan
                                .keyword_tracking_count == -1
                                ? 0
                                : this.props.user.price_plan
                                        .keyword_tracking_count}
                        </p>
                    </div>
                </div>
                <p className="ds-update-text m-0 px-2 text-right" onClick={() => this.props.manageKeywordShow(true)}>Manage Keywords</p>
                <AddKeyword
                    used_credits={this.props.totalDfsKeywordCreditsUsed}
                    total_credits={
                        this.props.user.price_plan.keyword_tracking_count
                    }
                    onAddCallback={this.props.keywordAddHandler}
                    ga_property_id={this.props.ga_property_id}
                    reloadWebMonitors={this.props.reloadWebMonitors}
                    user={this.props.user}
                    loadUserDataSources={this.props.loadUserDataSources}
                    updateGAPropertyId={this.props.updateGAPropertyId}
                />

                {this.props.manage_keyword_show == true ? (
                    <ManageKeywords
                        keywords={this.props.dfsKeywords}
                        loadKeywordsCallback={
                            this.props.loadKeywordTrackingKeywords
                        }
                        editKeywordCallback={this.props.editKeywordToggler}
                        closeManageKeywordPopup={() => {
                            this.props.manage_keyword_popup_handler();
                            this.props.manageKeywordShow(false);
                        }}
                    />
                ) : null}

                {this.props.editKeyword ? (
                    <EditKeyword
                        keyword_id={this.props.editKeyword_keyword_id}
                        total_credits={
                            this.props.user.price_plan
                                .keyword_tracking_count
                        }
                        used_credits={this.props.totalDfsKeywordCreditsUsed}
                        keyword_configuration_id={
                            this.props.editKeyword_keyword_configuration_id
                        }
                    />
                ) : null}
            </div>
        );
    }
}

export default RankTracking;
