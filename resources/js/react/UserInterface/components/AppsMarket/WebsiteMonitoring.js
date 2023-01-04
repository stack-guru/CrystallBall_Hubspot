import React from "react";
import UserAnnotationColorPicker from "../../helpers/UserAnnotationColorPickerComponent";
import DSWebMonitorsSelect from "../../utils/DSWebMonitorsSelect";
import ModalHeader from "./common/ModalHeader";

class WebsiteMonitoring extends React.Component {
    render() {
        return (
            <div className="popupContent modal-websiteMonitoring">
                <ModalHeader
                    userAnnotationColors={this.props.userAnnotationColors}
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

export default WebsiteMonitoring;
