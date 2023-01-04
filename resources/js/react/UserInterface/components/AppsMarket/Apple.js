import React from "react";
import UserAnnotationColorPicker from "../../helpers/UserAnnotationColorPickerComponent";
import { ApplePodcastConfig } from "../../utils/ApplePodcast";
import ModalHeader from "./common/ModalHeader";

class Apple extends React.Component {
    render() {
        return (
            <div className='popupContent modal-apple'>
                <ModalHeader
                    userAnnotationColors={this.props.userAnnotationColors}
                    updateUserAnnotationColors={
                        this.props.updateUserAnnotationColors
                    }
                    userServices={this.props.userServices}
                    serviceStatusHandler={this.props.serviceStatusHandler}
                    closeModal={this.props.closeModal}

                    serviceName={"Apple Podcast"}
                    colorKeyName={"apple_podcast"}
                    dsKeyName={"is_ds_apple_podcast_annotation_enabled"}
                    creditString={`TODO`}
                />

                <ApplePodcastConfig
                    gaPropertyId={this.props.ga_property_id}
                />
            </div>
        );
    }
}

export default Apple;
