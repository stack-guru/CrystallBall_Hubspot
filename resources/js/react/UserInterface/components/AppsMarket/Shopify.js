import React from "react";
import UserAnnotationColorPicker from "../../helpers/UserAnnotationColorPickerComponent";
import DSShopifySelect from "../../utils/DSShopifySelect";
import ModalHeader from "./common/ModalHeader";
import DescrptionModalNormal from "./common/DescriptionModalNormal";
class Shopify extends React.Component {
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
            <div className="popupContent modal-Shopify">
                { !this.state.isRead && !this.props.userServices['is_ds_shopify_annotation_enabled'] && !(this.props.dsKeySkip === 'is_ds_shopify_annotation_enabled') ?
                <DescrptionModalNormal
                    changeModal = {this.changeModal.bind(this)}
                    serviceName={"Shopify"}
                    description={"Shopify Is a content change detection on the web. Crystal Ball add annotations that match the user's search terms, such as web pages, newspaper articles, blogs, or scientific research. Add keywords like https://www.your-domain.com/, Company Name. The system will search for news once a day at midnight. Annotations for News Alerts will start showing after 48 hours the automation is activated."}
                    userServices={this.props.userServices}
                    closeModal={this.props.closeModal}

                /> :
                <>
                <ModalHeader
                    userAnnotationColors={this.props.userAnnotationColors}
                    updateUserAnnotationColors={
                        this.props.updateUserAnnotationColors
                    }
                    userServices={this.props.userServices}
                    serviceStatusHandler={this.props.serviceStatusHandler}
                    closeModal={this.props.closeModal}

                    serviceName={"Shopify"}
                    colorKeyName={"shopify"}
                    dsKeyName={"is_ds_shopify_annotation_enabled"}
                    creditString={null}
                />

                <DSShopifySelect
                    onCheckCallback={this.props.userDataSourceAddHandler}
                    onUncheckCallback={this.props.userDataSourceDeleteHandler}
                    ds_data={this.props.userDataSources.google_alert_keywords}
                    ga_property_id={this.props.ga_property_id}
                    user={this.props.user}
                    loadUserDataSources={this.props.loadUserDataSources}
                    updateGAPropertyId={this.props.updateGAPropertyId}
                    reloadWebMonitors={this.props.reloadWebMonitors}
                />
                </>
                }
            </div>
        );
    }
}

export default Shopify;
