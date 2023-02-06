import axios from "axios";
import React, { useEffect, useState } from "react";
import Toast from "../../utils/Toast";
import HttpClient from "../HttpClient";
import "./ShopifyStoreConfig.css";

import {
    Button,
    Form,
    FormGroup,
    Input,
    Card,
    CardImg,
    CardTitle,
    CardSubtitle,
    Table,
    Popover,
    PopoverBody,
} from "reactstrap";
import GoogleAnalyticsPropertySelect from "../GoogleAnalyticsPropertySelect";

const ShopifyStoreConfig = (props) => {
    const [existingShopifyItems, setExistingShopifyItems] = useState([]);
    const [inputVale, setInputVale] = useState("");
    const [activeDeletePopover, setActiveDeletePopover] = useState("");

    const getExistingShopifyStore = async () => {
        HttpClient.get(
            `/data-source/shopify-monitor?ga_property_id=${props.gaPropertyId}`
        )
            .then(
                (result) => {
                    setExistingShopifyItems(result.data.shopify_monitors);
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

    const deletePodcasts = async (payload) => {
        HttpClient.delete(`/data-source/shopify-monitor/${payload.id}`)
            .then(
                () => {
                    getExistingShopifyStore();
                    Toast.fire({
                        icon: 'success',
                        title: "Shopify url deleted successfully.",
                    });
                },
                (err) => {
                    Toast.fire({
                        icon: 'error',
                        title: "Error while delete exists shopify url.",
                    });
                }
            )
            .catch((err) => {
                Toast.fire({
                    icon: 'error',
                    title: "Error while delete exists shopify url.",
                });
            });
    };

    // useEffect(() => {
    //     getExistingShopifyStore();
    // }, [props.gaPropertyId]);

    const addAnnotation = async () => {
        Toast.fire({
            icon: 'info',
            title: "Creating Annotations",
        });
        HttpClient.post("/data-source/shopify_url", { shopifyUrl: inputVale, gaPropertyId: props.gaPropertyId || "" })
            .then(
                () => {
                    props.sectionToggler();
                    Toast.fire({
                        icon: 'success',
                        title: "Shopify Store added successfully.",
                    });
                },
                (err) => {
                    Toast.fire({
                        icon: 'error',
                        title: "Error while adding Shopify Store.",
                    });
                }
            )
            .catch((err) => {
                Toast.fire({
                    icon: 'error',
                    title: "Error while adding Shopify Store.",
                });
            });
    };
    return (
        <div className="apps-bodyContent">
            <div className="white-box">
                <h4>Add Shopify Store:</h4>
                <div className="d-flex align-items-center">
                    <div className="input-group search-input-box">
                        <input
                            type="text"
                            className="form-control search-input themeNewInput"
                            placeholder="Enter store url"
                            value={inputVale}
                            onChange={(e) =>
                                setInputVale(e.target.value.toLowerCase())
                            }
                            onKeyUp={(e) => {
                                if (e.keyCode === 13) {
                                    e.persist();
                                    addAnnotation(e);
                                }
                            }}
                        />
                        <div className="input-group-append">
                            <i className="ti-plus"></i>
                        </div>
                    </div>
                    <span className="betweentext">for</span>
                    <GoogleAnalyticsPropertySelect
                        className="themeNewselect"
                        name="ga_property_id"
                        id="ga_property_id"
                        currentPricePlan={props.user.price_plan}
                        value={props.ga_property_id}
                        onChangeCallback={(gAP) => {
                            props.updateGAPropertyId(gAP?.target?.value || null);
                        }}
                        components={{
                            DropdownIndicator: () => null,
                            IndicatorSeparator: () => null,
                        }}
                        placeholder="Select GA Properties"
                        isClearable={true}
                    />
                </div>
            </div>
            <div className="gray-box">
                <h4>
                    Active stores: <span>(Click to remove)</span>
                </h4>
                <div className="d-flex keywordTags">
                    {existingShopifyItems?.map((gAK, index) => {
                        return (
                            <>
                                <button
                                    onClick={() => {
                                        setActiveDeletePopover(gAK)
                                    }}
                                    id={"gAK-" + gAK.id}
                                    type="button"
                                    className="keywordTag"
                                    key={gAK.id}
                                    user_data_source_id={gAK.id}
                                >
                                    <span
                                        style={{ background: "#2d9cdb" }}
                                        className="dot"
                                    ></span>
                                    {gAK.url}
                                </button>

                                <Popover
                                    placement="top"
                                    target={"gAK-" + gAK.id}
                                    isOpen={
                                        activeDeletePopover?.id ===
                                        gAK.id
                                    }
                                >
                                    <PopoverBody web_monitor_id={gAK.id}>
                                        Are you sure you want to remove "
                                        {gAK.url}"?.
                                    </PopoverBody>
                                    <button
                                        onClick={() => deletePodcasts(activeDeletePopover)}
                                        key={gAK.id}
                                        user_data_source_id={gAK.id}
                                    >
                                        Yes
                                    </button>
                                    <button
                                        onClick={() =>
                                            setActiveDeletePopover("")
                                        }
                                    >
                                        No
                                    </button>
                                </Popover>
                            </>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ShopifyStoreConfig;
