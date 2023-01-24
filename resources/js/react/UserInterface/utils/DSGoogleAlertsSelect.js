import React from "react";
import { Popover, PopoverBody } from "reactstrap";
import GoogleAnalyticsPropertySelect from "./GoogleAnalyticsPropertySelect";

export default class DSGoogleAlertsSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isBusy: false,
            errors: "",
            keyword: "",
            activeDeletePopover: "",
        };

        this.addKeyword = this.addKeyword.bind(this);
        this.deleteKeyword = this.deleteKeyword.bind(this);
    }

    addKeyword(e) {
        this.setState({ keyword: "" });
        this.props.onCheckCallback({
            code: "google_alert_keywords",
            name: "GoogleAlertKeyword",
            country_name: null,
            retail_marketing_id: null,
            open_weather_map_event: null,
            value: e.target.getAttribute("value"),
        });
    }

    deleteKeyword(e) {
        this.props.onUncheckCallback(
            e.target.getAttribute("user_data_source_id"),
            "google_alert_keywords"
        );
    }

    render() {
        return (
            <div className="apps-bodyContent">
                <div className="white-box">
                    <h4>Add keywords:</h4>
                    <div className="d-flex align-items-center">
                        <div className="input-group search-input-box">
                            <input
                                type="text"
                                className="form-control search-input themeNewInput"
                                placeholder="Add keywords to get alerted"
                                value={this.state.keyword}
                                name="keyword"
                                onChange={(e) =>
                                    this.setState({
                                        [e.target.name]:
                                            e.target.value.toLowerCase(),
                                    })
                                }
                                onKeyUp={(e) => {
                                    if (e.keyCode === 13) {
                                        e.persist();
                                        this.addKeyword(e);
                                    }
                                }}
                            />
                            <div className="input-group-append">
                                <i className="ti-plus"></i>
                            </div>
                        </div>
                        <span className="betweentext">for</span>
                        <GoogleAnalyticsPropertySelect
                            className="themeNewselect"
                            name="ga_property_id"
                            id="ga_property_id"
                            currentPricePlan={this.props.user.price_plan}
                            value={this.props.ga_property_id}
                            onChangeCallback={(gAP) => {
                                if (gAP.target.value == "") {
                                    this.props.updateGAPropertyId(null);
                                    this.props.loadUserDataSources(null);
                                    this.props.reloadWebMonitors(null);
                                } else {
                                    this.props.updateGAPropertyId(
                                        gAP.target.value
                                    );
                                    this.props.loadUserDataSources(
                                        gAP.target.value
                                    );
                                    this.props.reloadWebMonitors(
                                        gAP.target.value
                                    );
                                }
                            }}
                            components={{
                                DropdownIndicator: () => null,
                                IndicatorSeparator: () => null,
                            }}
                            placeholder="Select GA Properties"
                            isClearable={true}
                        />
                    </div>
                </div>
                <div className="gray-box">
                    <h4>
                        Active keywords: <span>(Click to remove)</span>
                    </h4>
                    <div className="d-flex keywordTags">
                        {this.props.ds_data?.map((gAK) => {
                            return (
                                <>
                                    <button
                                        onClick={() =>
                                            this.setState({
                                                activeDeletePopover: gAK.id,
                                            })
                                        }
                                        id={"gAK-" + gAK.id}
                                        type="button"
                                        className="keywordTag"
                                        key={gAK.id}
                                        user_data_source_id={gAK.id}
                                    >
                                        <span
                                            style={{ background: "#2d9cdb" }}
                                            className="dot"
                                        ></span>
                                        {gAK.value}
                                    </button>

                                    <Popover
                                        placement="top"
                                        target={"gAK-" + gAK.id}
                                        isOpen={
                                            this.state.activeDeletePopover ===
                                            gAK.id
                                        }
                                    >
                                        <PopoverBody web_monitor_id={gAK.id}>
                                            Are you sure you want to remove "
                                            {gAK.value}"?.
                                        </PopoverBody>
                                        <button
                                            onClick={this.deleteKeyword}
                                            key={gAK.id}
                                            user_data_source_id={gAK.id}
                                        >
                                            Yes
                                        </button>
                                        <button
                                            onClick={() =>
                                                this.setState({
                                                    activeDeletePopover: null,
                                                })
                                            }
                                        >
                                            No
                                        </button>
                                    </Popover>
                                </>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }
}
