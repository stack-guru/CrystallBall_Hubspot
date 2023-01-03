import React from "react";
import UserAnnotationColorPicker from "../../helpers/UserAnnotationColorPickerComponent";
import DSWebMonitorsSelect from '../../utils/DSWebMonitorsSelect';

class WebsiteMonitoring extends React.Component {
    render() {
        return (
            <div className='popupContent modal-websiteMonitoring'>
                <div>
                    <div>
                        <div className="px-2">
                            <h2>
                                Website Monitoring{" "}
                                <UserAnnotationColorPicker
                                    name="web_monitors"
                                    value={
                                        this.props.userAnnotationColors
                                            .web_monitors
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
                                    name="is_ds_web_monitors_enabled"
                                    onChange={this.props.serviceStatusHandler}
                                    checked={
                                        this.props.userServices
                                            .is_ds_web_monitors_enabled
                                    }
                                />
                                <span
                                    className={`slider round`}
                                />
                            </label>
                        </div>
                    </div>
                    {this.props.webMonitors ? (
                        <div className="px-2">
                            <div className="list-wrapper">
                                <p
                                    style={{
                                        fontSize: "13px",
                                    }}
                                >
                                    Credits: {this.props.webMonitors.length}
                                    /
                                    {this.props.user.price_plan
                                        .web_monitor_count > 0
                                        ? this.props.user.price_plan
                                                .web_monitor_count
                                        : 0}
                                </p>
                            </div>
                        </div>
                    ) : null}
                </div>
                <DSWebMonitorsSelect
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

export default WebsiteMonitoring;
