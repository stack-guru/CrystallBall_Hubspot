import React from "react";
import UserAnnotationColorPicker from "../../helpers/UserAnnotationColorPickerComponent";
import DSOWMCitiesSelect from "../../utils/DSOWMCitiesSelect";
import DSOWMEventsSelect from "../../utils/DSOWMEventsSelect";
import DSWebMonitorsSelect from "../../utils/DSWebMonitorsSelect";
import ModalHeader from "./common/ModalHeader";
import DescrptionModalNormal from "./common/DescriptionModalNormal";

class WeatherAlerts extends React.Component {
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
            <div className="popupContent modal-weatherAlerts">
                { !this.state.isRead && !this.props.userServices['is_ds_weather_alerts_enabled'] && !(this.props.dsKeySkip === 'is_ds_weather_alerts_enabled') ?
                <DescrptionModalNormal
                    changeModal = {this.changeModal.bind(this)}
                    serviceName={"Weather Alerts"}
                    description={"Weather disrupts the operating and financial performance of 70% of businesses worldwide. Add automated annotations for the location you operate"}
                    userServices={this.props.userServices}
                    closeModal={this.props.closeModal}

                /> :
                <>
                <ModalHeader
                    userAnnotationColors={this.props.userAnnotationColors}
                    updateUserAnnotationColors={
                        this.props.updateUserAnnotationColors
                    }
                    isActiveTracking={this.state.isActiveTracking}
                    userServices={this.props.userServices}
                    serviceStatusHandler={this.props.serviceStatusHandler}
                    closeModal={this.props.closeModal}
                    serviceName={"Weather Alerts"}
                    colorKeyName={"weather_alerts"}
                    dsKeyName={"is_ds_weather_alerts_enabled"}
                    creditString={`${
                        this.props.userDataSources.open_weather_map_cities
                            ?.length
                    }
                    /
                    ${
                        this.props.user.price_plan?.owm_city_count > 0
                            ? this.props.user.price_plan?.owm_city_count
                            : 0
                    }`}
                />

                <div className="apps-bodyContent grid2layout">
                    <div className="column">
                        <DSOWMEventsSelect onCheckCallback={this.props.userDataSourceAddHandler } onUncheckCallback={this.props.userDataSourceDeleteHandler } ds_data={this.props.userDataSources.open_weather_map_events }/>
                        <DSOWMCitiesSelect 
                            updateTrackingStatus={this.updateTrackingStatus.bind(this)}
                            updateUserService={this.props.updateUserService}
                            onCheckCallback={this.props.userDataSourceAddHandler } onUncheckCallback={this.props.userDataSourceDeleteHandler } ds_data={this.props.userDataSources.open_weather_map_cities } ga_property_id={this.props.ga_property_id} reloadWebMonitors={this.props.reloadWebMonitors} user={this.props.user} loadUserDataSources={this.props.loadUserDataSources} updateGAPropertyId={this.props.updateGAPropertyId}/>
                    </div>
                    <div className="column">
                        <DSOWMEventsSelect onCheckCallback={this.props.userDataSourceAddHandler} onUncheckCallback={this.props.userDataSourceDeleteHandler } ds_data={this.props.userDataSources.open_weather_map_events } showSelectedOnly={true}/>
                        <DSOWMCitiesSelect 
                                updateTrackingStatus={this.updateTrackingStatus.bind(this)}
                                updateUserService={this.props.updateUserService}
                                onCheckCallback={ this.props.userDataSourceAddHandler } onUncheckCallback={ this.props.userDataSourceDeleteHandler } ds_data={ this.props.userDataSources.open_weather_map_cities } ga_property_id={this.props.ga_property_id} reloadWebMonitors={this.props.reloadWebMonitors} user={this.props.user} loadUserDataSources={this.props.loadUserDataSources} updateGAPropertyId={this.props.updateGAPropertyId} showSelectedOnly={true}/>
                    </div>
                </div>
                </>
                }
            </div>
        );
    }
}

export default WeatherAlerts;
