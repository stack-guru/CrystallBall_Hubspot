import React from "react";
import UserAnnotationColorPicker from "../../helpers/UserAnnotationColorPickerComponent";
import DSGAUDatesSelect from "../../utils/DSGAUDatesSelect";

class GoogleUpdates extends React.Component {
    render() {
        return (
            <div className='popupContent modal-googleUpdates'>
                <div className="px-2">
                    <h2>
                        Google Updates{" "}
                        <UserAnnotationColorPicker
                            name="google_algorithm_updates"
                            value={
                                this.props.userAnnotationColors
                                    .google_algorithm_updates
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
                            name="is_ds_google_algorithm_updates_enabled"
                            onChange={
                                this.props.serviceStatusHandler
                            }
                            checked={
                                this.props.userServices
                                    .is_ds_google_algorithm_updates_enabled
                            }
                        />
                        <span className={`slider round`} />
                    </label>
                </div>
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
