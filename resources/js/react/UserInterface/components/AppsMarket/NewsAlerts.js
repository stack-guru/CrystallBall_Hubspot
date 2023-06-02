import React from "react";
import UserAnnotationColorPicker from "../../helpers/UserAnnotationColorPickerComponent";
import DSGoogleAlertsSelect from "../../utils/DSGoogleAlertsSelect";
import ModalHeader from "./common/ModalHeader";
import DescrptionModalNormal from "./common/DescriptionModalNormal";
class NewsAlerts extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isRead: false
        }
    }

    changeModal() {
        this.setState({isRead: true})
    }

    render() {
        return (
            <div className="popupContent modal-newsAlerts">
                { !this.state.isRead && !this.props.userServices['is_ds_google_alerts_enabled'] && !(this.props.dsKeySkip === 'is_ds_google_alerts_enabled') ?
                <DescrptionModalNormal
                    changeModal = {this.changeModal.bind(this)}
                    serviceName={"News Alerts"}
                    description={"Stay informed with real-time content updates. Crystal Ball automatically adds annotations based on your custom search terms, including web pages, articles, blogs, and research. Set keywords like https://www.your-domain.com/ and your company name. Our system performs daily searches at midnight, keeping you in the loop."}
                    userServices={this.props.userServices}
                    closeModal={this.props.closeModal}

                /> :
                <>
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
                    reloadWebMonitors={this.props.reloadWebMonitors}
                />
                </>
                }
            </div>
        );
    }
}

export default NewsAlerts;
