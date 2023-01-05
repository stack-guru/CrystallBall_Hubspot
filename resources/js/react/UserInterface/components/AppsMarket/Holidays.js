import React from "react";
import UserAnnotationColorPicker from "../../helpers/UserAnnotationColorPickerComponent";
import Countries from "../../utils/Countries";
import ModalHeader from "./common/ModalHeader";

class Holidays extends React.Component {
    render() {
        return (
            <div className='popupContent modal-holidays'>
                <ModalHeader
                    userAnnotationColors={this.props.userAnnotationColors}
                    updateUserAnnotationColors={this.props.updateUserAnnotationColors}
                    userServices={this.props.userServices}
                    serviceStatusHandler={this.props.serviceStatusHandler}
                    closeModal={this.props.closeModal}

                    serviceName={"Holidays"}
                    colorKeyName={"holidays"}
                    dsKeyName={"is_ds_holidays_enabled"}
                    creditString={null}
                />


                <Countries
                    onCheckCallback={this.props.userDataSourceAddHandler}
                    onUncheckCallback={this.props.userDataSourceDeleteHandler}
                    ds_data={this.props.userDataSources.holidays}
                    ga_property_id={this.props.ga_property_id}
                    user={this.props.user}
                    loadUserDataSources={this.props.loadUserDataSources}
                    updateGAPropertyId={this.props.updateGAPropertyId}
                />
            </div>
        );
    }
}

export default Holidays;
