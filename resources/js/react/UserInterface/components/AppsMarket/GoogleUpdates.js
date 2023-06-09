import React from "react";
import UserAnnotationColorPicker from "../../helpers/UserAnnotationColorPickerComponent";
import DSGAUDatesSelect from "../../utils/DSGAUDatesSelect";
import ModalHeader from "./common/ModalHeader";
import DescrptionModalNormal from "./common/DescriptionModalNormal";

class GoogleUpdates extends React.Component {
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
            <div className='popupContent modal-googleUpdates'>
                { !this.state.isRead && !this.props.userServices['is_ds_google_algorithm_updates_enabled'] && !(this.props.dsKeySkip === 'is_ds_google_algorithm_updates_enabled') ?
                <DescrptionModalNormal
                    changeModal = {this.changeModal.bind(this)}
                    serviceName={"Google Algorithm Updates"}
                    description={"Stay ahead of the game with our automated annotation feature for Google updates. From subtle changes to major algorithmic updates, we'll keep you informed about the latest developments that impact the Search Engine Results Pages (SERPs). Don't miss a beat in the ever-evolving world of Google."}
                    userServices={this.props.userServices}
                    closeModal={this.props.closeModal}
                /> :
                <>
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
                    serviceStatusHandler={this.props.serviceStatusHandler}
                    userDataSourceDeleteHandler={this.props.userDataSourceDeleteHandler}
                />
                </>
                }
            </div>
        );
    }
}

export default GoogleUpdates;
