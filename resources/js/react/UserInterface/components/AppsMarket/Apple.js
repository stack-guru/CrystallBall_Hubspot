import React from "react";
import UserAnnotationColorPicker from "../../helpers/UserAnnotationColorPickerComponent";
import { ApplePodcastConfig } from "../../utils/ApplePodcast";
import ModalHeader from "./common/ModalHeader";
import DescrptionModalNormal from "./common/DescriptionModalNormal";

class Apple extends React.Component {
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
            <div className='popupContent modal-apple'>
                { !this.state.isRead && !this.props.userServices['is_ds_apple_podcast_annotation_enabled'] ? 
                <DescrptionModalNormal
                    changeModal = {this.changeModal.bind(this)}
                    serviceName={"Apple Podcast"}
                    description={""}
                    userServices={this.props.userServices}
                    closeModal={this.props.closeModal}

                /> : 
                <>
                <ModalHeader
                    userAnnotationColors={this.props.userAnnotationColors}
                    updateUserAnnotationColors={ this.props.updateUserAnnotationColors }
                    userServices={this.props.userServices}
                    serviceStatusHandler={this.props.serviceStatusHandler}
                    closeModal={this.props.closeModal}

                    serviceName={"Apple Podcast"}
                    colorKeyName={"apple_podcast"}
                    dsKeyName={"is_ds_apple_podcast_annotation_enabled"}
                    creditString={`TODO`}
                />

                <ApplePodcastConfig gaPropertyId={this.props.ga_property_id}/>
                </>
                }
            </div>
        );
    }
}

export default Apple;
