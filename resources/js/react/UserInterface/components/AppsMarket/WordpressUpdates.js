import React from "react";
import UserAnnotationColorPicker from "../../helpers/UserAnnotationColorPickerComponent";
import DSGAUDatesSelect from "../../utils/DSGAUDatesSelect";
import ModalHeader from "./common/ModalHeader";
import DescrptionModalNormal from "./common/DescriptionModalNormal";
import GoogleAnalyticsPropertySelect from "../../utils/GoogleAnalyticsPropertySelect";
import Toast from "../../utils/Toast";

class WordpressUpdates extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isRead: false,
            editProperty: false
        }
    }

    changeModal() {
        this.setState({isRead: true})
    }

    render() {

        const gaPropertyName = this.props.userDataSources.wordpress_updates[0]?.ga_property_name;
        return (
            <div className="popupContent modal-wordpressUpdates">
                {!this.state.isRead && !this.props.userServices['is_ds_wordpress_updates_enabled'] && !(this.props.dsKeySkip === 'is_ds_wordpress_updates_enabled') ?
                    <DescrptionModalNormal
                        changeModal={this.changeModal.bind(this)}
                        serviceName={"Wordpress Updates"}
                        description={"WordPress Core Updates Our automated annotation feature will inform you when a new version, Security, or Maintenance Release of WordPress is available."}
                        userServices={this.props.userServices}
                        closeModal={this.props.closeModal}

                    /> :
                    <>
                        <ModalHeader
                            userAnnotationColors={this.props.userAnnotationColors}
                            updateUserAnnotationColors={this.props.updateUserAnnotationColors}
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
                                <div className="d-flex align-items-center justify-content-between mb-3">

                                    <div className="checkBoxList">
                                        <label
                                            className='themeNewCheckbox d-flex align-items-center justify-content-start'
                                            for='last_year_only'>
                                            <input type="checkbox" id='last_year_only' onChange={(e) => {
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
                                                    this.props.updateGAPropertyId(null)

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
                                            <span>Show last year only</span>
                                        </label>
                                    </div>

                                    {/*<div className="d-flex align-items-center hide-icon">
                                        {
                                            !this.props.userDataSources.wordpress_updates
                                            .length ??
                                            <span className="betweentext">for</span>
                                        }
                                        {
                                            (this.props.userDataSources.wordpress_updates
                                            .length > 0  && this.state.editProperty) ||
                                            !this.props.userDataSources.wordpress_updates
                                            .length ?
                                            <>
                                            <GoogleAnalyticsPropertySelect
                                                className="themeNewselect"
                                                name="ga_property_id"
                                                id="ga_property_id"
                                                currentPricePlan={this.props.user.price_plan}
                                                value={this.props.gaPropertyId}
                                                onChangeCallback={(gAP) => {
                                                    this.props.updateGAPropertyId(gAP.target.value || null)

                                                    if (this.props.userDataSources
                                                            .wordpress_updates &&
                                                        this.props.userDataSources.wordpress_updates
                                                            .length > 0) {
                                                        this.setState({editProperty: false})
                                                        this.props.userDataSourceUpdateHandler(
                                                            this.props.userDataSources.wordpress_updates[0].id,
                                                            gAP.target.value
                                                        );
                                                    } else {
                                                        Toast.fire({
                                                            icon: 'success',
                                                            title: "Successfully saved wordpress updates settings.",
                                                        });

                                                    }
                                                }}
                                                placeholder="Select GA Properties"
                                                isClearable={true}
                                            />
                                            { this.state.editProperty ?
                                                <i className="ml-2 icon fa" onClick={() => this.setState({ editProperty: false })}>
                                                    <img className="w-14px" src='/close-icon.svg' />
                                                </i>
                                                : ""
                                            }
                                            </>
                                        : ""
                                        }

                                        {
                                            this.props.userDataSources.wordpress_updates
                                            .length && !this.state.editProperty
                                            ?
                                            <h4 className='text-capitalize mb-0'>
                                                <span>{!gaPropertyName ? 'All Properties' : gaPropertyName}</span>
                                                <i className="ml-2 icon fa" onClick={() => this.setState({ editProperty: true })}>
                                                    <img className="w-20px" src='/icon-edit.svg' />
                                                </i>
                                            </h4>
                                            : ''
                                        }
                                    </div>*/}
                                </div>
                            </div>

                            {/*<div className="gray-box">
                                {this.props.userDataSources.wordpress_updates.length ?
                                    <h4 className='text-capitalize'>
                                        Show last year only ({this.props.userDataSources.wordpress_updates.length > 0 ? 'Enabled' : 'Disabled'}) <span>{this.props.userDataSources.wordpress_updates[0].ga_property_name}</span>
                                    </h4>
                                :
                                    ""
                                }
                            </div>*/}
                        </div>
                    </>
                }
            </div>
        );
    }
}

export default WordpressUpdates;
