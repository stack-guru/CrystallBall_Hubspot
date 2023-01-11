import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
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
} from "reactstrap";

const ShopifyStoreConfig = (props) => {
    const [existingShopifyItems, setExistingShopifyItems] = useState([]);
    const [inputVale, setInputVale] = useState("");

    const getExistingShopifyStore = async () => {
        HttpClient.get(
            `/data-source/shopify-monitor?ga_property_id=${props.gaPropertyId}`
        )
            .then(
                (result) => {
                    setExistingShopifyItems(result.data.shopify_monitors);
                },
                (err) => {
                    toast.error("Error while getting exists shopify urls.");
                }
            )
            .catch((err) => {
                toast.error("Error while getting exists shopify urls.");
            });
    };

    const deletePodcasts = async (payload) => {
        HttpClient.delete(`/data-source/shopify-monitor/${payload.id}`)
            .then(
                () => {
                    getExistingShopifyStore();
                    toast.success("Shopify url deleted successfully.");
                },
                (err) => {
                    toast.error("Error while delete exists shopify url.");
                }
            )
            .catch((err) => {
                toast.error("Error while delete exists shopify url.");
            });
    };

    useEffect(() => {
        getExistingShopifyStore();
    }, [props.gaPropertyId]);

    const addAnnotation = async () => {
        toast.info("Creating Annotations");
        HttpClient.post("/data-source/shopify_url", {shopifyUrl: inputVale, gaPropertyId: props.gaPropertyId || ""})
            .then(
                () => {
                    props.sectionToggler();
                    toast.success("Shopify Store added successfully.");
                },
                (err) => {
                    toast.error("Error while adding Shopify Store.");
                }
            )
            .catch((err) => {
                toast.error("Error while adding Shopify Store.");
            });
    };
    return (
        <div className="switch-wrapper">
            <h4 className="gaa-text-primary">Manage Shopify Store</h4>
            {existingShopifyItems.length ? (
                <div>
                    <div>
                        {existingShopifyItems.map((itm, index) => (
                            <div>
                                <h5
                                    style={{ display: "inline-block" }}
                                    key={itm.id != "" ? itm.id : index}
                                >
                                    <span className="badge badge-pill badge-primary m-1 h5">
                                        {itm.url}{" "}
                                        <i
                                            className="fa fa-times"
                                            data-apple-podcast-name={itm.url}
                                            data--apple-podcast-id={itm.id}
                                            onClick={() => deletePodcasts(itm)}
                                        ></i>
                                    </span>
                                </h5>
                            </div>
                        ))}
                    </div>
                </div>
            ) : null}
            <div>
                <div className="input-group search-input-box mb-3">
                    <input
                        type="text"
                        className="form-control search-input"
                        placeholder="Enter the Shopify URL"
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
            </div>
        </div>
    );
};

export default ShopifyStoreConfig;
