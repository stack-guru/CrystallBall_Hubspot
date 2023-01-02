import React from "react";
import UserAnnotationColorPicker from "../../helpers/UserAnnotationColorPickerComponent";
import Countries from "../../utils/Countries";

class Holidays extends React.Component {
    render() {
        return (
            <div>
                <div>
                    <div>
                        <div>
                            <div className="px-2">
                                <h2>
                                Holidays{" "}
                                    <UserAnnotationColorPicker
                                        name="holidays"
                                        value={
                                            this.props.userAnnotationColors
                                                .holidays
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
                                        name="is_ds_holidays_enabled"
                                        onChange={
                                            this.props.serviceStatusHandler
                                        }
                                        checked={
                                            this.props.userServices
                                                .is_ds_holidays_enabled
                                        }
                                    />
                                    <span className={`slider round`} />
                                </label>
                            </div>
                        </div>
                    </div>
                    <Countries
                        onCheckCallback={this.props.userDataSourceAddHandler}
                        onUncheckCallback={
                            this.props.userDataSourceDeleteHandler
                        }
                        ds_data={this.props.userDataSources.holidays}
                        ga_property_id={this.props.ga_property_id}
                        user={this.props.user}
                        loadUserDataSources={this.props.loadUserDataSources}
                        updateGAPropertyId={this.props.updateGAPropertyId}
                    />
                </div>
            </div>
        );
    }
}

export default Holidays;
