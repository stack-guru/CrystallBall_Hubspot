import React from "react";
import UserAnnotationColorPicker from "../../helpers/UserAnnotationColorPickerComponent";
import DSShopifySelect from "../../utils/DSShopifySelect";
import ModalHeader from "./common/ModalHeader";
import DescrptionModalNormal from "./common/DescriptionModalNormal";
import { ShopifyStoreConfig } from "../../utils/ShopifyStore";
import HttpClient from "../../utils/HttpClient";
import Toast from "../../utils/Toast";

class Shopify extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            shopifyStores: [],
            isRead: false
        }

        this.getExistingShopifyStore = this.getExistingShopifyStore.bind(this)
    }

    getExistingShopifyStore = async () => {
        HttpClient.get(
            `/data-source/shopify-monitor?ga_property_id=${this.props.ga_property_id}`
        )
            .then(
                (result) => {
                    this.setState({shopifyStores: result.data.shopify_monitors })
                },
                (err) => {
                    Toast.fire({
                        icon: 'error',
                        title: "Error while getting exists shopify urls.",
                    });
                }
            )
            .catch((err) => {
                Toast.fire({
                    icon: 'error',
                    title: "Error while getting exists shopify urls.",
                });
            });
    };
    // if(result.data.shopify_monitors?.length > 0) {
    //     this.props.serviceStatusHandler({ target: { name: 'is_ds_shopify_annotation_enabled', checked: true }})
    // }
    changeModal() {
        this.setState({ isRead: true })
    }

    componentDidMount() {
        this.getExistingShopifyStore();
    }
    render() {
        return (
            <div className="popupContent modal-Shopify">
                {!this.state.isRead && !this.props.userServices['is_ds_shopify_annotation_enabled'] && !(this.props.dsKeySkip === 'is_ds_shopify_annotation_enabled') ?
                    <DescrptionModalNormal
                        changeModal={this.changeModal.bind(this)}
                        serviceName={"Shopify"}
                        description={`Automated annotations will track updates to product pricing, descriptions, providing insights into the impact of these changes on sales and revenue. No manual work required, just an effortless way to understand your store's activity and improve your business. The system will search for new/updates products once a day at midnight.`}
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
                            creditString={
                                this.props.userDataSources.shopify_annotation
                                    ? `${
                                        this.state.shopifyStores?.length
                                      } / ${
                                          this.props.user.price_plan
                                              .shopify_monitor_count > 0
                                              ? this.props.user.price_plan
                                                    .shopify_monitor_count
                                              : 0
                                      }`
                                    : null
                            }
                        />

                        {/* <DSShopifySelect
                    onCheckCallback={this.props.userDataSourceAddHandler}
                    onUncheckCallback={this.props.userDataSourceDeleteHandler}
                    ds_data={this.props.userDataSources.google_alert_keywords}
                    ga_property_id={this.props.ga_property_id}
                    user={this.props.user}
                    loadUserDataSources={this.props.loadUserDataSources}
                    updateGAPropertyId={this.props.updateGAPropertyId}
                    reloadWebMonitors={this.props.reloadWebMonitors}
                /> */}

                        <ShopifyStoreConfig
                            limitReached={this.state.shopifyStores?.length >= (this.props.user.price_plan.shopify_monitor_count * 1)}
                            upgradePopup={this.props.upgradePopup}
                            getExistingShopifyStore={this.getExistingShopifyStore}
                            existingShopifyItems={this.state.shopifyStores}
                            sectionToggler={this.props.closeModal}
                            onCheckCallback={this.props.userDataSourceAddHandler}
                            onUncheckCallback={this.props.userDataSourceDeleteHandler}
                            user={this.props.user}
                            loadUserDataSources={this.props.loadUserDataSources}
                            updateGAPropertyId={this.props.updateGAPropertyId}
                            reloadWebMonitors={this.props.reloadWebMonitors}
                            serviceStatusHandler={this.props.serviceStatusHandler}
                            gaPropertyId={this.props.ga_property_id} />
                    </>
                }
            </div>
        );
    }
}

export default Shopify;
