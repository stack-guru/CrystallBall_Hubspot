import React from "react";
import UserAnnotationColorPicker from "../../helpers/UserAnnotationColorPickerComponent";
import DSGoogleAlertsSelect from "../../utils/DSGoogleAlertsSelect";

class NewsAlerts extends React.Component {
    render() {
        return (
            <div className='popupContent modal-newsAlerts'>
                <div className="apps-modalHead">
                    <div className='d-flex justify-content-start align-items-center'>
                        <h2>News Alerts</h2>
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
                        {
                            this.props.userDataSources.google_alert_keywords ? (
                                <span className='text-credits'>Credits: <span>{this.props.userDataSources.google_alert_keywords.length} / {this.props.user.price_plan.google_alert_keyword_count > 0 ? this.props.user.price_plan.google_alert_keyword_count : 0}</span></span>
                            ) : null
                        }
                    </div>
                    <span className='btn-close'>
                        <svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 7.50031L16.0003 0.5L18 2.49969L10.9997 9.5L18 16.5003L16.0003 18.5L9 11.4997L1.99969 18.5L0 16.5003L7.00031 9.5L0 2.49969L1.99969 0.5L9 7.50031Z" fill="#666666"/>
                        </svg>
                    </span>
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
        );
    }
}

export default NewsAlerts;
