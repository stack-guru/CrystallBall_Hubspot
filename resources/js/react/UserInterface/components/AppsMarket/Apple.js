import React from "react";
import UserAnnotationColorPicker from "../../helpers/UserAnnotationColorPickerComponent";
import { ApplePodcastConfig } from "../../utils/ApplePodcast";
import ModalHeader from "./common/ModalHeader";
import DescrptionModalNormal from "./common/DescriptionModalNormal";
import HttpClient from "../../utils/HttpClient";
import Toast from "../../utils/Toast";

class Apple extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isRead: false,
            applePodcast: [],
            isActiveTracking: false
        }
        this.getExistingPodcasts = this.getExistingPodcasts.bind(this)
    }

    changeModal() {
        this.setState({isRead: true})
    }

    updateTrackingStatus = status => {
        this.setState({ isActiveTracking: status })
    }

    getExistingPodcasts = async () => {
        HttpClient.get(
            `/data-source/apple-podcast-monitor?ga_property_id=${this.props.ga_property_id}`
        )
            .then(
                (result) => {
                    this.setState({applePodcast: result.data.apple_podcast_monitors })
                },
                (err) => {
                    Toast.fire({
                        icon: 'error',
                        title: "Error while getting exists Apple Podcast.",
                    });
                }
            )
            .catch((err) => {
                Toast.fire({
                    icon: 'error',
                    title: "Error while getting exists Apple Podcast.",
                });
            });
    };

    componentDidMount() {
        this.getExistingPodcasts();
    }
    render() {
        return (
            <div className='popupContent modal-apple'>
                { !this.state.isRead && !this.props.userServices['is_ds_apple_podcast_annotation_enabled'] && !(this.props.dsKeySkip === 'is_ds_apple_podcast_annotation_enabled')?
                <DescrptionModalNormal
                    changeModal = {this.changeModal.bind(this)}
                    serviceName={"Apple Podcast"}
                    description={`Staying on top of the latest content and tracking changes to Apple podcasts can be a challenge\n
                    Simply search for a channel or add a URL, and we'll automatically create annotations in your GA4 environment every time there is a new episode. This means you'll have a clear picture of what's new and how it's impacting your audience, all in one place.`}
                    userServices={this.props.userServices}
                    closeModal={this.props.closeModal}

                /> :
                <>
                <ModalHeader
                    isActiveTracking={this.state.isActiveTracking}
                    userAnnotationColors={this.props.userAnnotationColors}
                    updateUserAnnotationColors={ this.props.updateUserAnnotationColors }
                    userServices={this.props.userServices}
                    serviceStatusHandler={this.props.serviceStatusHandler}
                    closeModal={this.props.closeModal}

                    serviceName={"Apple Podcast"}
                    colorKeyName={"apple_podcast"}
                    dsKeyName={"is_ds_apple_podcast_annotation_enabled"}
                    creditString={`${ this.state.applePodcast?.length } / ${ (this.props.user.price_plan.apple_podcast_monitor_count * 1) == -1 ? 0 : this.props.user.price_plan.apple_podcast_monitor_count}`}
                />

                <ApplePodcastConfig
                    user={this.props.user}
                    updateUserService={this.props.updateUserService}
                    onUncheckCallback={this.props.userDataSourceDeleteHandler}
                    updateTrackingStatus={this.updateTrackingStatus.bind(this)}
                    upgradePopup={this.props.upgradePopup}
                    limitReached={(this.state.applePodcast?.length >= (this.props.user.price_plan.apple_podcast_monitor_count * 1)) && (this.props.user.price_plan.apple_podcast_monitor_count * 1) > 0}
                    existingPodcast={this.state.applePodcast}
                    getExistingPodcasts={this.getExistingPodcasts}
                    updateGAPropertyId={this.props.updateGAPropertyId}
                    gaPropertyId={this.props.ga_property_id}/>
                </>
                }
            </div>
        );
    }
}

export default Apple;
