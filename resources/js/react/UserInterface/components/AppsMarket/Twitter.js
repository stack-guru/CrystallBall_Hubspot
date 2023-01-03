import React from "react";
import UserAnnotationColorPicker from "../../helpers/UserAnnotationColorPickerComponent";
import TwitterTracking from "../../utils/TwitterTracking";

class Twitter extends React.Component {
    render() {
        return (
            <div className='popupContent modal-twitter'>
                <div className="px-2">
                    <h2>
                        Twitter Tracking{" "}
                        <UserAnnotationColorPicker
                            name="twitter_tracking"
                            value={
                                this.props.userAnnotationColors
                                    .twitter_tracking
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
                        <input type="checkbox" name="is_ds_twitter_tracking_enabled" onChange={this.props.serviceStatusHandler} checked={this.props.userServices.is_ds_twitter_tracking_enabled}/>
                        <span className={`slider round`} />
                    </label>
                </div>
                <div className="list-wrapper">
                    <p style={{fontSize: "13px",}}>Credits: ∞</p>
                </div>
                <TwitterTracking />
            </div>
        );
    }
}

export default Twitter;
