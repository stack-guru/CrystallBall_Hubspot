import React from "react";
import UserAnnotationColorPicker from "../../helpers/UserAnnotationColorPickerComponent";
import DSGAUDatesSelect from "../../utils/DSGAUDatesSelect";
import DSRMDatesSelect from "../../utils/DSRMDatesSelect";

class RetailMarketingDates extends React.Component {
    render() {
        return (
            <div className='popupContent modal-retailMrketingDates'>
                <div>
                    <div className="px-2">
                        <h2>
                            Retail Marketing Dates{" "}
                            <UserAnnotationColorPicker
                                name="retail_marketings"
                                value={
                                    this.props.userAnnotationColors
                                        .retail_marketings
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
                                name="is_ds_retail_marketing_enabled"
                                onChange={
                                    this.props.serviceStatusHandler
                                }
                                checked={
                                    this.props.userServices
                                        .is_ds_retail_marketing_enabled
                                }
                            />
                            <span className={`slider round`} />
                        </label>
                    </div>
                </div>
                <DSRMDatesSelect
                    onCheckCallback={this.props.userDataSourceAddHandler}
                    onUncheckCallback={
                        this.props.userDataSourceDeleteHandler
                    }
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
