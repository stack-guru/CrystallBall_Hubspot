import React from "react";
import UserAnnotationColorPicker from "../../helpers/UserAnnotationColorPickerComponent";

class Facebook extends React.Component {
    render() {
        return (
            <div>
                <div>
                    <div>
                        <div>
                            <div className="px-2">
                                <h2>
                                    Facebook Tracking{" "}
                                    <UserAnnotationColorPicker
                                        name="anomolies_detection"
                                        value={
                                            this.props.userAnnotationColors
                                                .facebook_tracking
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
                                        name="is_ds_anomolies_detection_enabled"
                                        onChange={(e) => {
                                            e.preventDefault();
                                            swal.fire(
                                                "This feature is coming soon. Stay tuned!",
                                                "",
                                                "info"
                                            );
                                        }}
                                        checked={
                                            this.props.userServices
                                                .is_ds_anomolies_detection_enabled
                                        }
                                    />
                                    <span className={`slider round`} />
                                </label>
                            </div>
                        </div>

                        <div className="px-2">
                            <div className="list-wrapper">
                                <p
                                    style={{
                                        fontSize: "13px",
                                    }}
                                >
                                    Credits: ∞
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Facebook;
