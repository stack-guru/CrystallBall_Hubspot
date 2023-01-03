import React from "react";
import UserAnnotationColorPicker from "../../helpers/UserAnnotationColorPickerComponent";
import DSGAUDatesSelect from "../../utils/DSGAUDatesSelect";

class WordpressUpdates extends React.Component {
    render() {
        return (
            <div className='popupContent modal-wordpressUpdates'>
                <div className="px-2">
                    <h2>
                        Wordpress Updates{" "}
                        <UserAnnotationColorPicker
                            name="wordpress_updates"
                            value={
                                this.props.userAnnotationColors
                                    .wordpress_updates
                            }
                            updateCallback={
                                this.props
                                    .updateUserAnnotationColors
                            }
                        />
                    </h2>
                </div>
                <div className="input-group" style={{marginTop: "7px", }}>
                    <input
                        type="checkbox"
                        style={{
                            position: "absolute",
                            top: "3px",
                        }}
                        onChange={(e) => {
                            if (e.target.checked) {
                                this.props.userDataSourceAddHandler(
                                    {
                                        code: "wordpress_updates",
                                        name: "WordpressUpdate",
                                        country_name: null,
                                        retail_marketing_id: null,
                                        value: "last year",
                                    }
                                );
                            } else {
                                this.props.userDataSourceDeleteHandler(
                                    this.props.userDataSources
                                        .wordpress_updates[0].id,
                                    "wordpress_updates"
                                );
                            }
                        }}
                        checked={
                            this.props.userDataSources
                                .wordpress_updates &&
                            this.props.userDataSources
                                .wordpress_updates.length > 0
                        }
                        name="last_year_only"
                    />
                    <h6
                    >
                        {" "}
                        &nbsp;&nbsp; Show last year only
                    </h6>
                </div>
                <div className="px-2 text-center">
                    <label className="trigger switch">
                        <input
                            type="checkbox"
                            name="is_ds_wordpress_updates_enabled"
                            onChange={
                                this.props.serviceStatusHandler
                            }
                            checked={
                                this.props.userServices
                                    .is_ds_wordpress_updates_enabled
                            }
                        />
                        <span className={`slider round`} />
                    </label>
                </div>
            </div>
        );
    }
}

export default WordpressUpdates;
