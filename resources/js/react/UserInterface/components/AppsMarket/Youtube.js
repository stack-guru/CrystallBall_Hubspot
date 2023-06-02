import React from "react";
import UserAnnotationColorPicker from "../../helpers/UserAnnotationColorPickerComponent";
import { YoutubeConfig } from "../../utils/Youtube";
import ModalHeader from "./common/ModalHeader";
import DescrptionModalNormal from "./common/DescriptionModalNormal";
import HttpClient from "../../utils/HttpClient";
import Toast from "../../utils/Toast";

class Youtube extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isRead: false,
            youtubeMonitor: [],
            isActiveTracking: false
        }
        this.getExistingMonitors = this.getExistingMonitors.bind(this)
    }

    changeModal() {
        this.setState({isRead: true})
    }

    updateTrackingStatus = status => {
        this.setState({ isActiveTracking: status })
    }

    getExistingMonitors = async () => {
        HttpClient.get(
            `/data-source/youtube-monitor`
        )
            .then(
                (result) => {
                    this.setState({youtubeMonitor: result.data.youtube_monitors })
                },
                (err) => {
                    Toast.fire({
                        icon: 'error',
                        title: "Error while getting exists Youtube Monitor.",
                    });
                }
            )
            .catch((err) => {
                Toast.fire({
                    icon: 'error',
                    title: "Error while getting exists Youtube Monitor.",
                });
            });
    };

    componentDidMount() {
        this.getExistingMonitors();
    }
    render() {
        return (
            <div className='popupContent modal-apple'>
                { !this.state.isRead && !this.props.userServices['is_ds_youtube_tracking_enabled'] && !(this.props.dsKeySkip === 'is_ds_youtube_tracking_enabled')?
                <DescrptionModalNormal
                    changeModal = {this.changeModal.bind(this)}
                    serviceName={"Youtube"}
                    description={`Get real-time insights into your YouTube channel's performance with automated annotations. Track views and likes to understand the impact of your content and audience growth. Stay informed, optimize your strategies, and drive more engagement with ease.`}
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

                    serviceName={"Youtube"}
                    colorKeyName={"youtube"}
                    dsKeyName={"is_ds_youtube_tracking_enabled"}
                    creditString={`${ this.state.youtubeMonitor?.length } / ${ (this.props.user.price_plan.youtube_credits_count * 1) == -1 ? 0 : this.props.user.price_plan.youtube_credits_count}`}
                />

                <YoutubeConfig
                    user={this.props.user}
                    updateUserService={this.props.updateUserService}
                    onUncheckCallback={this.props.userDataSourceDeleteHandler}
                    updateTrackingStatus={this.updateTrackingStatus.bind(this)}
                    upgradePopup={this.props.upgradePopup}
                    limitReached={(this.state.youtubeMonitor?.length >= (this.props.user.price_plan.youtube_credits_count * 1)) && (this.props.user.price_plan.youtube_credits_count * 1) > 0}
                    existingMonitor={this.state.youtubeMonitor}
                    getExistingMonitors={this.getExistingMonitors}
                    updateGAPropertyId={this.props.updateGAPropertyId}
                    gaPropertyId={this.props.ga_property_id}/>
                </>
                }
            </div>
        );
    }
}

export default Youtube;
