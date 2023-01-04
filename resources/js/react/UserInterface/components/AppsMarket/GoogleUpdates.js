import React from "react";
import UserAnnotationColorPicker from "../../helpers/UserAnnotationColorPickerComponent";
import DSGAUDatesSelect from "../../utils/DSGAUDatesSelect";
import ModalHeader from "./common/ModalHeader";

class GoogleUpdates extends React.Component {
    render() {
        return (
            <div className='popupContent modal-googleUpdates'>
                <ModalHeader
                    userAnnotationColors={this.props.userAnnotationColors}
                    updateUserAnnotationColors={
                        this.props.updateUserAnnotationColors
                    }
                    userServices={this.props.userServices}
                    serviceStatusHandler={this.props.serviceStatusHandler}
                    closeModal={this.props.closeModal}
                    serviceName={"Google Updates"}
                    colorKeyName={"google_algorithm_updates"}
                    dsKeyName={"is_ds_google_algorithm_updates_enabled"}
                    creditString={null}
                />

                <DSGAUDatesSelect
                    onCheckCallback={this.props.userDataSourceAddHandler}
                    onUncheckCallback={
                        this.props.userDataSourceDeleteHandler
                    }
                    ds_data={
                        this.props.userDataSources
                            .google_algorithm_update_dates
                    }
                    ga_property_id={this.props.ga_property_id}
                    user={this.props.user}
                    loadUserDataSources={this.props.loadUserDataSources}
                    updateGAPropertyId={this.props.updateGAPropertyId}
                />
            </div>
        );
    }
}

export default GoogleUpdates;
