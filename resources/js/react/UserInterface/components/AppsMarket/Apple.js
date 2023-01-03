import React from "react";
import UserAnnotationColorPicker from "../../helpers/UserAnnotationColorPickerComponent";
import { ApplePodcastConfig } from "../../utils/ApplePodcast";

class Apple extends React.Component {
    render() {
        return (
            <div className='popupContent modal-apple'>
                <div className="px-2">
                    <h2>
                        Apple Podcast{" "}
                        <UserAnnotationColorPicker
                            name="apple_podcast"
                            value={
                                this.props.userAnnotationColors
                                    .apple_podcast
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
                            name="is_ds_apple_podcast_annotation_enabled"
                            onChange={
                                this.props.serviceStatusHandler
                            }
                            checked={
                                this.props.userServices
                                    .is_ds_apple_podcast_annotation_enabled
                            }
                        />
                        <span className={`slider round`} />
                    </label>
                </div>
                <div className="list-wrapper">
                    <p style={{fontSize: "13px",}}>Credits:{" "}TODO</p>
                </div>
                <ApplePodcastConfig
                    gaPropertyId={this.props.ga_property_id}
                />
            </div>
        );
    }
}

export default Apple;
