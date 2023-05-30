import axios from "axios";
import React, { useEffect, useState } from "react";
import Toast from "../Toast";
import HttpClient from "../HttpClient";
import "./YoutubeConfig.css";
import GoogleAnalyticsPropertySelect from "../GoogleAnalyticsPropertySelect";
import {CustomTooltip} from "../../components/annotations/IndexAnnotation";

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
import Slider from "react-slick";

const YoutubeConfig = (props) => {
    const [searchResult, setSearchResult] = useState([]);
    const [noResult, setNoResult] = useState("");
    const [gaPropertyId, setGaPropertyId] = useState("");
    const [inputVale, setInputVale] = useState("");
    const [activeDeletePopover, setActiveDeletePopover] = useState("");

    const deleteMonito = async (payload) => {
        HttpClient.delete(`/data-source/youtube-monitor/${payload.id}`)
            .then(
                () => {
                    props.getExistingMonitors();
                    Toast.fire({
                        icon: 'success',
                        title: "Youtube Monitor deleted successfully.",
                    });
                },
                (err) => {
                    Toast.fire({
                        icon: 'error',
                        title: "Error while delete exists Youtube Monitor.",
                    });
                }
            )
            .catch((err) => {
                Toast.fire({
                    icon: 'error',
                    title: "Error while delete exists Youtube Monitor.",
                });
            });
    };

    useEffect(() => {
        props.getExistingMonitors();
    }, [props.gaPropertyId]);

    const getMetaData = async (ev) => {
        ev.preventDefault();
        try {
            setSearchResult([]);
            setNoResult("");
            const url = `https://www.googleapis.com/youtube/v3/videos?id=${encodeURIComponent(inputVale)}&key=301040226881-p1utco823400k3u9cbc0io6qtme3i3m8.apps.googleusercontent.com&part=snippet,contentDetails,statistics,status`;
            const result = await axios.get(url);

            let sr = [];
            for (const item of result.data?.results) {
                sr.push({
                    previewImage: item.artworkUrl600 || item.artworkUrl100,
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
                    "No results, try another search of enter a Monitor URL"
                );
            }
        } catch (error) {
            console.debug(`file: YoutubeConfig.js error`, error);
        }
    };

    const addAnnotation = async (formData) => {

        formData.gaPropertyId = gaPropertyId;
        if (props.limitReached) {
            props.upgradePopup('social-media')
        } else {
            Toast.fire({
                icon: 'info',
                title: "Creating Annotations",
            });
            HttpClient.post("/data-source/youtube_url", formData)
            .then(
                () => {
                    Toast.fire({
                        icon: 'success',
                        title: "Youtube Monitor added successfully.",
                    });
                },
                (err) => {
                    Toast.fire({
                        icon: 'error',
                        title: "Error while adding Youtube Monitor.",
                    });
                }
            )
            .catch((err) => {
                Toast.fire({
                    icon: 'error',
                    title: "Error while adding Youtube Monitor.",
                });
            });
            props.getExistingMonitors();
            props.updateTrackingStatus(true);
            props.updateUserService({ target: {
                    name: "is_ds_youtube_tracking_enabled",
                    checked: true,
                }, 
            });

        }

    };

    function SampleNextArrow(props) {
        const { className, style, onClick } = props;
        return (
            <div className={className} onClick={onClick}>
                <i className="fa fa-angle-right"></i>
            </div>
        );
    }

    function SamplePrevArrow(props) {
        const { className, style, onClick } = props;
        return (
            <div className={className} onClick={onClick}>
                <i className="fa fa-angle-left"></i>
            </div>
        );
    }

    const settings = {
        speed: 500,
        dots: false,
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 3,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />
    };
    return (
        <div className="apps-bodyContent">
            <div className="white-box">
                <h4 className='textblue'>Add new Monitor</h4>

                <div className="d-flex align-items-center mb-3">
                    <div className="input-group">
                        <input type="text" className="form-control search-input" placeholder="Search or Enter the Monitor URL" value={inputVale} id="youtubeMonitorURL" name="youtubeMonitorURL" onChange={(e) => setInputVale(e.target.value.toLowerCase())} onKeyUp={(e) => { if (e.keyCode === 13) { e.persist(); getMetaData(e); } }} />
                        <div className="input-group-append">
                            <i className="ti-plus"></i>
                        </div>
                    </div>

                    <span className="betweentext">for</span>
                    <GoogleAnalyticsPropertySelect
                        className="themeNewselect hide-icon"
                        name="ga_property_id"
                        id="ga_property_id"
                        currentPricePlan={props.user.price_plan}
                        value={props.gaPropertyId}
                        onChangeCallback={(gAP) => {
                            setGaPropertyId(gAP.target.value || null)
                        }}
                        placeholder="Select GA Properties"
                        isClearable={true}
                        onDeleteCallback={props.onUncheckCallback}
                    />

                </div>

                {noResult && <p className='pt-3 mb-0'>{noResult}</p>}

                <div className="pt-3">
                    <Slider {...settings}>
                        {searchResult.map((t0a) => (
                            <Card className="cb-ap-search-card apple-card mb-0" body>
                                <CardImg top width="100%" src={t0a.previewImage} alt={t0a.collectionName} />
                                <div className="">
                                    <CardTitle className="text-truncate w-100" tag="h5">{t0a.collectionName}</CardTitle>
                                    <CardSubtitle tag="h6" className="mb-0 text-muted">{t0a.trackCount} episodes</CardSubtitle>
                                </div>
                                <Button onClick={() => addAnnotation(t0a)}>Create Annotations</Button>
                            </Card>
                        ))}
                    </Slider>
                </div>

            </div>

            {props.existingMonitor.length ? <div className="white-box">
                <h4 className='textblue'>Manage Monitors</h4>
                <div className="gray-box">
                    <h4>
                        Active Monitors: <span>(Click to remove)</span>
                    </h4>
                    <div className="d-flex keywordTags">
                        {props.existingMonitor?.map((gAK) => {
                            return (
                                <>
                                    <button
                                        onClick={() =>
                                            setActiveDeletePopover(gAK.id)
                                        }
                                        id={"gAK-" + gAK.id}
                                        type="button"
                                        className="keywordTag dd-tooltip d-flex"
                                        key={gAK.id}
                                        user_data_source_id={gAK.id}
                                    >
                                        <CustomTooltip tooltipText={`${gAK.google_analytics_property?.name || "All Properties"}`}
                                                       maxLength={50}>
                                            <span
                                                style={{background: "#2d9cdb"}}
                                                className="dot"
                                            ></span>
                                            {gAK.name}
                                        </CustomTooltip>
                                    </button>

                                    <Popover
                                        placement="top"
                                        target={"gAK-" + gAK.id}
                                        isOpen={
                                            activeDeletePopover ===
                                            gAK.id
                                        }
                                    >
                                        <PopoverBody web_monitor_id={gAK.id}>
                                            Are you sure you want to remove "{gAK.name}"?.
                                        </PopoverBody>
                                        <button
                                            onClick={() => deleteMonito(gAK)}
                                            key={gAK.id}
                                            user_data_source_id={gAK.id}
                                        >
                                            Yes
                                        </button>
                                        <button
                                            onClick={() =>
                                                setActiveDeletePopover('')
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
            </div> : null}
        </div>
    );
};

export default YoutubeConfig;
