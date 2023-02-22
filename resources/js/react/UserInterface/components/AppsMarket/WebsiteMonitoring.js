import React from "react";
import UserAnnotationColorPicker from "../../helpers/UserAnnotationColorPickerComponent";
import DSWebMonitorsSelect from "../../utils/DSWebMonitorsSelect";
import ModalHeader from "./common/ModalHeader";
import DescrptionModalNormal from "./common/DescriptionModalNormal";

class WebsiteMonitoring extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isRead: false,
            isActiveTracking: false,
        }
    }

    changeModal() {
        this.setState({isRead: true})
    }
    
    updateTrackingStatus = status => {
        this.setState({ isActiveTracking: status })
    }

    render() {
        return (
            <div className="popupContent modal-websiteMonitoring">
                { (!this.state.isRead && !this.props.userServices['is_ds_web_monitors_enabled']) && !(this.props.dsKeySkip === 'is_ds_web_monitors_enabled') ?
                <DescrptionModalNormal
                    changeModal = {this.changeModal.bind(this)}
                    serviceName={"Website Monitoring"}
                    description={"Downtime happens even to the best of us. But it’s important to know it before customers are affected and also keep annotations on your reports. Add your website URL; we will monitor it every 1 minute."}
                    userServices={this.props.userServices}
                    closeModal={this.props.closeModal}

                /> :
                <>
                <ModalHeader
                    userAnnotationColors={this.props.userAnnotationColors}
                    isActiveTracking={this.state.isActiveTracking}
                    updateUserAnnotationColors={
                        this.props.updateUserAnnotationColors
                    }
                    userServices={this.props.userServices}
                    serviceStatusHandler={this.props.serviceStatusHandler}
                    closeModal={this.props.closeModal}
                    serviceName={"Website Monitoring"}
                    colorKeyName={"web_monitors"}
                    dsKeyName={"is_ds_web_monitors_enabled"}
                    creditString={`${this.props.webMonitors.length}
                    /
                    ${
                        this.props.user.price_plan.web_monitor_count > 0
                            ? this.props.user.price_plan.web_monitor_count
                            : 0
                    }`}
                />

                <DSWebMonitorsSelect
                    updateTrackingStatus={this.updateTrackingStatus.bind(this)}
                    updateUserService={this.props.updateUserService}
                    onCheckCallback={this.props.userDataSourceAddHandler}
                    onUncheckCallback={this.props.userDataSourceDeleteHandler}
                    ga_property_id={this.props.ga_property_id}
                    reloadWebMonitors={this.props.reloadWebMonitors}
                    user={this.props.user}
                    loadUserDataSources={this.props.loadUserDataSources}
                    updateGAPropertyId={this.props.updateGAPropertyId}
                    upgradePopup={this.props.upgradePopup}
                />
                </>
                }
            </div>
        );
    }
}

export default WebsiteMonitoring;
