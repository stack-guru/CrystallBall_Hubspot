import React from "react";
import UserAnnotationColorPicker from "../../helpers/UserAnnotationColorPickerComponent";
import DSGoogleAlertsSelect from "../../utils/DSGoogleAlertsSelect";
import ModalHeader from "./common/ModalHeader";

class NewsAlerts extends React.Component {
    render() {
        return (
            <div className="popupContent modal-newsAlerts">
                <ModalHeader
                    userAnnotationColors={this.props.userAnnotationColors}
                    updateUserAnnotationColors={
                        this.props.updateUserAnnotationColors
                    }
                    userServices={this.props.userServices}
                    serviceStatusHandler={this.props.serviceStatusHandler}
                    closeModal={this.props.closeModal}

                    serviceName={"News Alerts"}
                    colorKeyName={"google_alerts"}
                    dsKeyName={"is_ds_google_alerts_enabled"}
                    creditString={
                        this.props.userDataSources.google_alert_keywords
                            ? `${
                                  this.props.userDataSources
                                      .google_alert_keywords.length
                              } / ${
                                  this.props.user.price_plan
                                      .google_alert_keyword_count > 0
                                      ? this.props.user.price_plan
                                            .google_alert_keyword_count
                                      : 0
                              }`
                            : null
                    }
                />

                <DSGoogleAlertsSelect
                    onCheckCallback={this.props.userDataSourceAddHandler}
                    onUncheckCallback={this.props.userDataSourceDeleteHandler}
                    ds_data={this.props.userDataSources.google_alert_keywords}
                    ga_property_id={this.props.ga_property_id}
                    user={this.props.user}
                    loadUserDataSources={this.props.loadUserDataSources}
                    updateGAPropertyId={this.props.updateGAPropertyId}
                />
            </div>
        );
    }
}

export default NewsAlerts;
