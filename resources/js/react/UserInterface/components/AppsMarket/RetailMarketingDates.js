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
            isRead: false
        }
    }

    changeModal() {
        this.setState({isRead: true})
    }

    render() {
        return (
            <div className="popupContent modal-retailMrketingDates">
                { !this.state.isRead && !this.props.userServices['is_ds_retail_marketing_enabled'] && !(this.props.dsKeySkip === 'is_ds_retail_marketing_enabled') ?
                <DescrptionModalNormal
                    changeModal = {this.changeModal.bind(this)}
                    serviceName={"Retail Marketing Dates"}
                    description={"If you run an ecommerce business, you know the drill: Having a promotional calendar for marketing and shopping events is key to deliver on your sales targets. Add automated annotations to see how affected your site."}
                    userServices={this.props.userServices}
                    closeModal={this.props.closeModal}

                /> :
                <>
                <ModalHeader
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
                    onCheckCallback={this.props.userDataSourceAddHandler}
                    onUncheckCallback={this.props.userDataSourceDeleteHandler}
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
