import React from "react";
import UserAnnotationColorPicker from "../../helpers/UserAnnotationColorPickerComponent";
import DSGAUDatesSelect from "../../utils/DSGAUDatesSelect";
import DSRMDatesSelect from "../../utils/DSRMDatesSelect";
import ModalHeader from "./common/ModalHeader";
import DescrptionModalNormal from "./common/DescriptionModalNormal";

class RetailMarketingDates extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isRead: false,
            isActiveTracking: false
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
            <div className="popupContent modal-retailMrketingDates">
                { !this.state.isRead && !this.props.userServices['is_ds_retail_marketing_enabled'] && !(this.props.dsKeySkip === 'is_ds_retail_marketing_enabled') ?
                <DescrptionModalNormal
                    changeModal = {this.changeModal.bind(this)}
                    serviceName={"Retail Marketing Dates"}
                    description={"Streamline your retail marketing strategy with automated annotations for important dates and shopping events. Easily track the impact on your website and measure success in meeting your sales targets. Stay organized and make informed decisions to drive your e-commerce business forward."}
                    userServices={this.props.userServices}
                    closeModal={this.props.closeModal}

                /> :
                <>
                <ModalHeader
                    isActiveTracking={this.state.isActiveTracking}
                    userAnnotationColors={this.props.userAnnotationColors}
                    updateUserAnnotationColors={this.props.updateUserAnnotationColors}
                    userServices={this.props.userServices}
                    serviceStatusHandler={this.props.serviceStatusHandler}
                    closeModal={this.props.closeModal}
                    serviceName={"Retail Marketing Dates"}
                    colorKeyName={"retail_marketings"}
                    dsKeyName={"is_ds_retail_marketing_enabled"}
                    creditString={null}
                />

                <DSRMDatesSelect
                    updateTrackingStatus={this.updateTrackingStatus.bind(this)}
                    updateUserService={this.props.updateUserService}
                    onCheckCallback={this.props.userDataSourceAddHandler}
                    onCheckAllCallback={this.props.userDataSourceAddAllHandler}
                    onUncheckAllCallback={this.props.onUncheckAllCallback}
                    onUncheckCallback={this.props.userDataSourceDeleteHandler}
                    userDataSourceUpdateHandler={this.props.userDataSourceUpdateHandler}
                    ds_data={this.props.userDataSources.retail_marketings}
                    ga_property_id={this.props.ga_property_id}
                    user={this.props.user}
                    loadUserDataSources={this.props.loadUserDataSources}
                    updateGAPropertyId={this.props.updateGAPropertyId}
                />
                </>
                }
            </div>
        );
    }
}

export default RetailMarketingDates;
