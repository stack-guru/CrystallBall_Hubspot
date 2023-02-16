import React from "react";
import { Button, Popover, PopoverHeader, PopoverBody } from "reactstrap";

import ShopifyStoreConfig from "./ShopifyStoreConfig";

const ShopifyStore = ({ is_ds_shopify_annotation_enabled, sectionName, serviceStatusHandler, sectionToggler }) => {
    return (
        <div
            className="d-flex border rounded flex-column justify-content-between"
            style={{ minHeight: "180px" }}
        >
            <div>
                <div
                    className="d-flex mt-2 justify-content-between "
                    id="keyword-tracking-data-source-section"
                >
                    <div className="px-2">
                        <h2>
                            <small>
                                Shopify Store{" "}
                                <img
                                    id="shopify-store"
                                    className="hint-button-2"
                                    src="/images/info-logo.png"
                                />
                            </small>
                        </h2>
                    </div>

                    <div className="px-2 text-center">
                        {is_ds_shopify_annotation_enabled
                            ? "ON"
                            : "OFF"}
                        <label className="trigger switch">
                            <input
                                type="checkbox"
                                checked={
                                    is_ds_shopify_annotation_enabled
                                }
                                onChange={serviceStatusHandler}
                                name="is_ds_shopify_annotation_enabled"
                            />
                            <span
                                className={`slider round ${
                                    is_ds_shopify_annotation_enabled
                                        ? "animate-pulse"
                                        : ""
                                }`}
                            />
                        </label>
                    </div>
                </div>
                {/* TODO: Need help for plan */}
                <div className="ml-2">Credits: TODO</div>
            </div>
            <div>
                <p
                    className="ds-update-text m-0 px-2 text-right"
                    onClick={() => {
                        sectionToggler();
                    }}
                >
                    {sectionName == "shopify_store"
                        ? "Hide"
                        : "Configure Shopify"}
                </p>
            </div>
        </div>
    );
};

export default ShopifyStore;
export { ShopifyStoreConfig };
