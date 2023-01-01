import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import HttpClient from "../HttpClient";
import "./ApplePodcastConfig.css";

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

const ApplePodcastConfig = (props) => {
    const [existingPodcast, setExisting] = useState([]);
    const [searchResult, setSearchResult] = useState([]);
    const [noResult, setNoResult] = useState("");
    const [inputVale, setInputVale] = useState("");

    const getExistingPodcasts = async () => {
        HttpClient.get(
            `/data-source/apple-podcast-monitor?ga_property_id=${props.gaPropertyId}`
        )
            .then(
                (result) => {
                    setExisting(result.data.apple_podcast_monitors);
                },
                (err) => {
                    toast.error("Error while getting exists Apple Podcast.");
                }
            )
            .catch((err) => {
                toast.error("Error while getting exists Apple Podcast.");
            });
    };

    const deletePodcasts = async (payload) => {
        HttpClient.delete(`/data-source/apple-podcast-monitor/${payload.id}`)
            .then(
                () => {
                    getExistingPodcasts();
                    toast.success("Apple Podcast deleted successfully.");
                },
                (err) => {
                    toast.error("Error while delete exists Apple Podcast.");
                }
            )
            .catch((err) => {
                toast.error("Error while delete exists Apple Podcast.");
            });
    };

    useEffect(() => {
        getExistingPodcasts();
    }, [props.gaPropertyId]);

    const getMetaData = async (ev) => {
        ev.preventDefault();
        try {
            setSearchResult([]);
            setNoResult("");
            const result = await axios.get(
                `https://itunes.apple.com/search?term=${encodeURIComponent(
                    inputVale
                )}&media=podcast&entity=podcast&explicit=Yes&limit=10`
            );
            let sr = [];
            for (const item of result.data?.results) {
                sr.push({
                    previewImage: item.artworkUrl100,
                    collectionName: item.collectionName,
                    collectionId: item.collectionId,
                    feedUrl: item.feedUrl,
                    collectionViewUrl: item.collectionViewUrl,
                    trackCount: item.trackCount,
                    gaPropertyId: props.gaPropertyId || null,
                });
            }
            setSearchResult(sr);
            if (sr.length === 0) {
                setNoResult(
                    "No results, try another search of enter a Podcast URL"
                );
            }
        } catch (error) {
            console.debug(`file: ApplePodcastConfig.js error`, error);
        }
    };

    const addAnnotation = async (formData) => {
        toast.info("Creating Annotations");
        HttpClient.post("/data-source/apple_podcast_url", formData)
            .then(
                () => {
                    props.sectionToggler();
                    toast.success("Apple Podcast added successfully.");
                },
                (err) => {
                    toast.error("Error while adding Apple Podcast.");
                }
            )
            .catch((err) => {
                toast.error("Error while adding Apple Podcast.");
            });
    };
    return (
        <div className="switch-wrapper">
            <h4 className="gaa-text-primary">Manage Apple Podcast</h4>
            {existingPodcast.length ? (
                <div>
                    <div>
                        {existingPodcast.map((itm, index) => (
                            <div>
                                <h5
                                    style={{ display: "inline-block" }}
                                    key={itm.id != "" ? itm.id : index}
                                >
                                    <span className="badge badge-pill badge-primary m-1 h5">
                                        {itm.name}{" "}
                                        <i
                                            className="fa fa-times"
                                            data-apple-podcast-name={itm.name}
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
                        placeholder="Search or Enter the Podcast URL"
                        value={inputVale}
                        id="applePodcastURL"
                        name="applePodcastURL"
                        onChange={(e) =>
                            setInputVale(e.target.value.toLowerCase())
                        }
                        onKeyUp={(e) => {
                            if (e.keyCode === 13) {
                                e.persist();
                                getMetaData(e);
                            }
                        }}
                    />
                    <div className="input-group-append">
                        <i className="ti-plus"></i>
                    </div>
                </div>

                {noResult && <div>{noResult}</div>}
            </div>
            <div className="mt-2">
                {searchResult.map((t0a) => (
                    <Card className="cb-ap-search-card mb-2" body>
                        <CardImg
                            top
                            width="100%"
                            src={t0a.previewImage}
                            alt={t0a.collectionName}
                        />
                        <CardTitle tag="h5">{t0a.collectionName}</CardTitle>
                        <CardSubtitle tag="h6" className="mb-0 text-muted">
                            {t0a.trackCount} episodes
                        </CardSubtitle>

                        <Button onClick={() => addAnnotation(t0a)}>
                            Create Annotations
                        </Button>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default ApplePodcastConfig;