import React from "react";
import UserAnnotationColorPicker from "../../helpers/UserAnnotationColorPickerComponent";
import DSOWMCitiesSelect from "../../utils/DSOWMCitiesSelect";
import DSOWMEventsSelect from "../../utils/DSOWMEventsSelect";
import DSWebMonitorsSelect from "../../utils/DSWebMonitorsSelect";

class WeatherAlerts extends React.Component {
    render() {
        return (
            <div>
                <div>
                    <div>
                        <div>
                            <div className="px-2">
                                <h2>
                                    Weather Alerts{" "}
                                    <UserAnnotationColorPicker
                                        name="weather_alerts"
                                        value={
                                            this.props.userAnnotationColors
                                                .weather_alerts
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
                                        name="is_ds_weather_alerts_enabled"
                                        onChange={
                                            this.props.serviceStatusHandler
                                        }
                                        checked={
                                            this.props.userServices
                                                .is_ds_weather_alerts_enabled
                                        }
                                    />
                                    <span className={`slider round`} />
                                </label>
                            </div>
                        </div>
                        {this.props.userDataSources.open_weather_map_cities ? (
                            <div className="px-2">
                                <div className="list-wrapper">
                                    <p
                                        style={{
                                            fontSize: "13px",
                                        }}
                                    >
                                        Credits:{" "}
                                        {
                                            this.props.userDataSources
                                                .open_weather_map_cities.length
                                        }
                                        /
                                        {this.props.user.price_plan
                                            .owm_city_count > 0
                                            ? this.props.user.price_plan
                                                  .owm_city_count
                                            : 0}
                                    </p>
                                </div>
                            </div>
                        ) : null}
                    </div>

                    <DSOWMEventsSelect
                        onCheckCallback={this.props.userDataSourceAddHandler}
                        onUncheckCallback={
                            this.props.userDataSourceDeleteHandler
                        }
                        ds_data={
                            this.props.userDataSources.open_weather_map_events
                        }
                    />

                    <DSOWMCitiesSelect
                        onCheckCallback={this.props.userDataSourceAddHandler}
                        onUncheckCallback={
                            this.props.userDataSourceDeleteHandler
                        }
                        ds_data={
                            this.props.userDataSources.open_weather_map_cities
                        }
                        ga_property_id={this.props.ga_property_id}
                        reloadWebMonitors={this.props.reloadWebMonitors}
                        user={this.props.user}
                        loadUserDataSources={this.props.loadUserDataSources}
                        updateGAPropertyId={this.props.updateGAPropertyId}
                    />
                </div>
            </div>
        );
    }
}

export default WeatherAlerts;
