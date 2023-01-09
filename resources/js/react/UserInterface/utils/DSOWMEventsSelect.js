import React, { useState } from "react";

export default class DSOWMEventsSelect extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            weather_alert_events: [
                "Clear",
                "Clouds",
                "Coastal event",
                "Drizzle",
                "Dust",
                "Duststorm (sandstorm)",
                "Earthquake",
                "Fog",
                "Freezing rain",
                "Frost",
                "Haze",
                "Heavy storm",
                "Huracán",
                "Icing",
                "Mist",
                "Moderate snow-ice warning",
                "Moderate Wind warning",
                "Rain",
                "Sand",
                "Smoke",
                "Snow",
                "Snow storm",
                "Tornado",
                "Widespread icy surfaces",
                "Winter Storm Warning",
            ],
            isBusy: false,
            show: false,
            errors: "",
        };

        this.handleClick = this.handleClick.bind(this);
        this.selectAllShowing = this.selectAllShowing.bind(this);
        this.clearAll = this.clearAll.bind(this);
    }

    handleClick(e) {
        if (e.target.checked) {
            this.props.onCheckCallback({
                code: "open_weather_map_events",
                name: "OpenWeatherMapEvent",
                country_name: null,
                retail_marketing_id: null,
                open_weather_map_event: e.target.getAttribute(
                    "open_weather_map_event"
                ),
            });
        } else {
            this.props.onUncheckCallback(
                e.target.id,
                "open_weather_map_events"
            );
        }
    }

    selectAllShowing(e) {
        if (e.target.checked) {
            let userOWMEvents = Array.from(
                new Set(
                    this.props.ds_data.map((ds) => ds.open_weather_map_event)
                )
            );
            this.state.weather_alert_events
                .filter((owmEvent) => userOWMEvents.indexOf(owmEvent) == -1)
                .forEach((owmEvent) => {
                    this.props.onCheckCallback({
                        code: "open_weather_map_events",
                        name: "OpenWeatherMapEvent",
                        country_name: null,
                        open_weather_map_event: owmEvent,
                    });
                });
        }
    }

    clearAll(e) {
        let userDSEvents = this.props.ds_data.map((ds) => ds.id);
        userDSEvents.forEach((owmEvent, index) => {
            this.props.onUncheckCallback(
                userDSEvents[index],
                "open_weather_map_events"
            );
        });
    }

    render() {
        let userOWMEvents = this.props.ds_data.map(
            (ds) => ds.open_weather_map_event
        );
        let userDSEvents = this.props.ds_data.map((ds) => ds.id);

        return (
            <div
                className={`weather_alert_cities-form ${
                    this.props.showSelectedOnly ? "gray-box" : "white-box"
                }`}
            >
                {this.props.showSelectedOnly ? null:
                    <h4 className="collapseable d-flex justify-content-between" onClick={() => this.setState({show: !this.state.show})}>
                        <span>Select Events</span>
                        <i className="fa fa-angle-down"></i>
                    </h4>
                }
                { (this.state.show || this.props.showSelectedOnly) ? <>
                    <div className="d-flex flex-column border-bottom pb-3 mb-3">
                        {this.props.showSelectedOnly ? (
                            <div className="boxTitleBtn d-flex justify-content-between">
                                <h4 className="mb-0">Selected Events</h4>
                                <span className="btn-clearAll" onClick={this.clearAll}>Clear All</span>
                            </div>
                        ) : (
                            <div className="checkBoxList">
                                <label className="themeNewCheckbox d-flex align-items-center justify-content-start" htmlFor="check-all">
                                    <input type="checkbox" id="check-all" onChange={this.selectAllShowing}/>
                                    <span>Select All</span>
                                </label>
                            </div>
                        )}
                    </div>
                    <div className="checkBoxList">
                        {this.state.weather_alert_events.map((wAE) => {
                            if((this.props.showSelectedOnly && userOWMEvents.indexOf(wAE) === -1) || (!this.props.showSelectedOnly && userOWMEvents.indexOf(wAE) !== -1)) {
                                return null
                            }
                            return (
                                <label className="themeNewCheckbox d-flex align-items-center justify-content-start" htmlFor={`checkbox-${wAE}`} key={wAE}>
                                    <input checked={userOWMEvents.indexOf(wAE) !== -1} type="checkbox" id={`checkbox-${wAE}`} onChange={this.handleClick} open_weather_map_event={wAE}/>
                                    <span>{wAE}</span>
                                </label>
                            );
                        })}
                    </div>
                </> : null }
            </div>
        );
    }
}
