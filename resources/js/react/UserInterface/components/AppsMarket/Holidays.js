import React from "react";
import UserAnnotationColorPicker from "../../helpers/UserAnnotationColorPickerComponent";
import Countries from "../../utils/Countries";
import ModalHeader from "./common/ModalHeader";
import DescrptionModalNormal from "./common/DescriptionModalNormal";

class Holidays extends React.Component {
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
            <div className='popupContent modal-holidays'>
                { !this.state.isRead && !this.props.userServices['is_ds_holidays_enabled'] && !(this.props.dsKeySkip === 'is_ds_holidays_enabled') ?
                <DescrptionModalNormal
                    changeModal = {this.changeModal.bind(this)}
                    serviceName={"Holidays"}
                    description={"How Christmas Day affect your sells? Add automatic annotations for the Holidays of any country."}
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
                </>
                }
            </div>
        );
    }
}

export default Holidays;
