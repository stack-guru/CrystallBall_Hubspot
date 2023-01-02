import React from "react";
import UserAnnotationColorPicker from "../../helpers/UserAnnotationColorPickerComponent";
import DSWebMonitorsSelect from '../../utils/DSWebMonitorsSelect';
import { UncontrolledPopover, PopoverHeader, PopoverBody } from "reactstrap";

class WebsiteMonitoring extends React.Component {
    render() {
        return (
            <div>
                <div>
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
                                    <img
                                        id="web-monitors-datasource-hint"
                                        className="hint-button-2"
                                        onClick={() => {
                                            this.props.changeShownHint(
                                                "web-monitors"
                                            );
                                        }}
                                        src="/images/info-logo.png"
                                    />
                                </h2>
                                <UncontrolledPopover
                                    trigger="legacy"
                                    placement="right"
                                    isOpen={
                                        this.props.showHintFor == "web-monitors"
                                    }
                                    target="web-monitors-datasource-hint"
                                    toggle={() => {
                                        this.props.changeShownHint(null);
                                    }}
                                >
                                    <PopoverHeader>
                                        Web Monitoring
                                    </PopoverHeader>
                                    <PopoverBody>
                                        Downtime happens even to the best of us.
                                        But it’s important to know it before
                                        customers are affected and also keep
                                        annotations on your reports. Add your
                                        website URL; we will monitor it every 1
                                        minute.
                                    </PopoverBody>
                                </UncontrolledPopover>
                            </div>
                            <div className="px-2 text-center">
                                {this.props.userServices
                                    .is_ds_web_monitors_enabled
                                    ? "ON"
                                    : "OFF"}
                                <label className="trigger switch">
                                    <input
                                        type="checkbox"
                                        name="is_ds_web_monitors_enabled"
                                        onChange={
                                            this.props.serviceStatusHandler
                                        }
                                        checked={
                                            this.props.userServices
                                                .is_ds_web_monitors_enabled
                                        }
                                    />
                                    <span
                                        className={`slider round ${
                                            this.props.userServices
                                                .is_ds_web_monitors_enabled
                                                ? "animate-pulse"
                                                : ""
                                        }`}
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
                        <div className="px-2">
                            <div className="list-wrapper">
                                <p style={{ fontSize: "13px" }}>
                                    {this.props.webMonitors.length > 0
                                        ? "Keywords:"
                                        : ""}
                                </p>
                                {this.props.webMonitors
                                    .map((wM) => wM.name)
                                    .join(", ")}
                            </div>
                        </div>
                    </div>

                    {/* <p
                        className="ds-update-text m-0 pb-3 px-2 text-right"
                        style={{ fontSize: "13px" }}
                        onClick={() => {
                            this.props.sectionToggler("web_monitors");
                        }}
                    >
                        {this.props.sectionName == "web_monitors"
                            ? "Hide"
                            : "Configure Monitors"}
                    </p> */}


                            <DSWebMonitorsSelect
                                onCheckCallback={this.props.userDataSourceAddHandler}
                                onUncheckCallback={
                                    this.props.userDataSourceDeleteHandler
                                }
                                ga_property_id={this.props.ga_property_id}
                                reloadWebMonitors={this.props.reloadWebMonitors}
                            />

                </div>
            </div>
        );
    }
}

export default WebsiteMonitoring;
