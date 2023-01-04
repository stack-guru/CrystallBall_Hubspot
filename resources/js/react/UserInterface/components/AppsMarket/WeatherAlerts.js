import React from "react";
import UserAnnotationColorPicker from "../../helpers/UserAnnotationColorPickerComponent";
import DSOWMCitiesSelect from "../../utils/DSOWMCitiesSelect";
import DSOWMEventsSelect from "../../utils/DSOWMEventsSelect";
import DSWebMonitorsSelect from "../../utils/DSWebMonitorsSelect";
import ModalHeader from "./common/ModalHeader";

class WeatherAlerts extends React.Component {
    render() {
        return (
            <div className='popupContent modal-weatherAlerts'>
                <ModalHeader
                    userAnnotationColors={this.props.userAnnotationColors}
                    updateUserAnnotationColors={
                        this.props.updateUserAnnotationColors
                    }
                    userServices={this.props.userServices}
                    serviceStatusHandler={this.props.serviceStatusHandler}
                    closeModal={this.props.closeModal}

                    serviceName={"Weather Alerts"}
                    colorKeyName={"weather_alerts"}
                    dsKeyName={"is_ds_weather_alerts_enabled"}
                    creditString={`${
                        this.props.userDataSources
                            .open_weather_map_cities?.length
                    }
                    /
                    ${this.props.user.price_plan?.owm_city_count > 0
                        ? this.props.user.price_plan?.owm_city_count
                        : 0}`}
                />

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
        );
    }
}

export default WeatherAlerts;
