import React from "react";

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
            <div className="apps-bodyContent switch-wrapper">
                <div
                    className={`weather_alert_cities-form ${
                        this.props.showSelectedOnly ? "gray-box" : "white-box"
                    }`}
                >
                    {this.props.showSelectedOnly ? null: <h4>Select Weather Events</h4>}
                    <div className="d-flex justify-content-between align-items-center border-bottom">
                        {this.props.showSelectedOnly ? (
                            <div>
                                <p className="font-weight-bold cursor m-0">
                                    Selected Events
                                </p>
                            </div>
                        ) : (
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="check-all"
                                    onChange={this.selectAllShowing}
                                />
                                <label
                                    className="form-check-label font-weight-bold"
                                    htmlFor="check-all"
                                >
                                    Select All
                                </label>
                            </div>
                        )}
                        {this.props.showSelectedOnly ? (
                            <div>
                                <p
                                    className="font-weight-bold cursor m-0"
                                    onClick={this.clearAll}
                                >
                                    Clear All
                                </p>
                            </div>
                        ) : null}
                    </div>
                    <div className="checkbox-box mt-3">
                        {this.state.weather_alert_events.map((wAE) => {
                            if((this.props.showSelectedOnly && userOWMEvents.indexOf(wAE) === -1) || (!this.props.showSelectedOnly && userOWMEvents.indexOf(wAE) !== -1)) {
                                return null
                            }
                            return (
                                <div className="form-check wAE" key={wAE}>
                                    <input
                                        className="form-check-input"
                                        checked={
                                            userOWMEvents.indexOf(wAE) !== -1
                                        }
                                        type="checkbox"
                                        id={`checkbox-${wAE}`}
                                        onChange={this.handleClick}
                                        open_weather_map_event={wAE}
                                    />
                                    <label
                                        className="form-check-label"
                                        htmlFor={`checkbox-${wAE}`}
                                    >
                                        {wAE}
                                    </label>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }
}
