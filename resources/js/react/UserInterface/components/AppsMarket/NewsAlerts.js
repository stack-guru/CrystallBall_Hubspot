import React from "react";
import UserAnnotationColorPicker from "../../helpers/UserAnnotationColorPickerComponent";
import DSGoogleAlertsSelect from "../../utils/DSGoogleAlertsSelect";

class NewsAlerts extends React.Component {
    render() {
        return (
            <div>
                <div>
                    <div>
                        <div>
                            <div className="px-2">
                                <h2>
                                News Alerts{" "}
                                    <UserAnnotationColorPicker
                                        name="google_alerts"
                                        value={
                                            this.props.userAnnotationColors
                                                .google_alerts
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
                                        name="is_ds_google_alerts_enabled"
                                        onChange={
                                            this.props.serviceStatusHandler
                                        }
                                        checked={
                                            this.props.userServices
                                                .is_ds_google_alerts_enabled
                                        }
                                    />
                                    <span className={`slider round`} />
                                </label>
                            </div>
                        </div>
                        {this.props.userDataSources.google_alert_keywords ? (
                            <div className="px-2">
                                <div className="list-wrapper">
                                    <p
                                        style={{
                                            fontSize: "13px",
                                        }}
                                    >
                                        Credits:{" "}
                                        {
                                            this.props.userDataSources
                                                .google_alert_keywords.length
                                        }
                                        /
                                        {this.props.user.price_plan
                                            .google_alert_keyword_count > 0
                                            ? this.props.user.price_plan
                                                  .google_alert_keyword_count
                                            : 0}
                                    </p>
                                </div>
                            </div>
                        ) : null}
                    </div>
                    <DSGoogleAlertsSelect
                        onCheckCallback={this.props.userDataSourceAddHandler}
                        onUncheckCallback={
                            this.props.userDataSourceDeleteHandler
                        }
                        ds_data={
                            this.props.userDataSources.google_alert_keywords
                        }
                        ga_property_id={this.props.ga_property_id}
                        user={this.props.user}
                        loadUserDataSources={this.props.loadUserDataSources}
                        updateGAPropertyId={this.props.updateGAPropertyId}
                    />
                </div>
            </div>
        );
    }
}

export default NewsAlerts;
