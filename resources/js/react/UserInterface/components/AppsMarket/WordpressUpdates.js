import React from "react";
import UserAnnotationColorPicker from "../../helpers/UserAnnotationColorPickerComponent";
import DSGAUDatesSelect from "../../utils/DSGAUDatesSelect";
import ModalHeader from "./common/ModalHeader";

class WordpressUpdates extends React.Component {
    render() {
        return (
            <div className="popupContent modal-wordpressUpdates">
                <ModalHeader
                    userAnnotationColors={this.props.userAnnotationColors}
                    updateUserAnnotationColors={
                        this.props.updateUserAnnotationColors
                    }
                    userServices={this.props.userServices}
                    serviceStatusHandler={this.props.serviceStatusHandler}
                    closeModal={this.props.closeModal}
                    serviceName={"Wordpress Updates"}
                    colorKeyName={"wordpress_updates"}
                    dsKeyName={"is_ds_wordpress_updates_enabled"}
                    creditString={null}
                />

                <div className="apps-bodyContent">
                    <div className="white-box">
                        <div
                            className="input-group"
                            style={{ marginTop: "7px" }}
                        >
                            <input
                                type="checkbox"
                                style={{
                                    position: "absolute",
                                    top: "3px",
                                }}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        this.props.userDataSourceAddHandler({
                                            code: "wordpress_updates",
                                            name: "WordpressUpdate",
                                            country_name: null,
                                            retail_marketing_id: null,
                                            value: "last year",
                                        });
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
                                    this.props.userDataSources.wordpress_updates
                                        .length > 0
                                }
                                name="last_year_only"
                            />
                            <h6> &nbsp;&nbsp; Show last year only</h6>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default WordpressUpdates;
