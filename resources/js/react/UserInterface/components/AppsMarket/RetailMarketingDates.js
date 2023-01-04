import React from "react";
import UserAnnotationColorPicker from "../../helpers/UserAnnotationColorPickerComponent";
import DSGAUDatesSelect from "../../utils/DSGAUDatesSelect";
import DSRMDatesSelect from "../../utils/DSRMDatesSelect";
import ModalHeader from "./common/ModalHeader";

class RetailMarketingDates extends React.Component {
    render() {
        return (
            <div className="popupContent modal-retailMrketingDates">
                <ModalHeader
                    userAnnotationColors={this.props.userAnnotationColors}
                    updateUserAnnotationColors={
                        this.props.updateUserAnnotationColors
                    }
                    userServices={this.props.userServices}
                    serviceStatusHandler={this.props.serviceStatusHandler}
                    closeModal={this.props.closeModal}
                    serviceName={"Retail Marketing Dates"}
                    colorKeyName={"retail_marketings"}
                    dsKeyName={"is_ds_retail_marketing_enabled"}
                    creditString={null}
                />

                <DSRMDatesSelect
                    onCheckCallback={this.props.userDataSourceAddHandler}
                    onUncheckCallback={this.props.userDataSourceDeleteHandler}
                    ds_data={this.props.userDataSources.retail_marketings}
                    ga_property_id={this.props.ga_property_id}
                    user={this.props.user}
                    loadUserDataSources={this.props.loadUserDataSources}
                    updateGAPropertyId={this.props.updateGAPropertyId}
                />
            </div>
        );
    }
}

export default RetailMarketingDates;
