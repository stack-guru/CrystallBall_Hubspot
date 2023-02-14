import axios from "axios";
import React, { useEffect, useState } from "react";
import Toast from "../../utils/Toast";
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
    Popover,
    PopoverBody,
} from "reactstrap";
import Slider from "react-slick";

const ApplePodcastConfig = (props) => {
    const [searchResult, setSearchResult] = useState([]);
    const [noResult, setNoResult] = useState("");
    const [inputVale, setInputVale] = useState("");
    const [activeDeletePopover, setActiveDeletePopover] = useState("");

    const deletePodcasts = async (payload) => {
        HttpClient.delete(`/data-source/apple-podcast-monitor/${payload.id}`)
            .then(
                () => {
                    props.getExistingPodcasts();
                    Toast.fire({
                        icon: 'success',
                        title: "Apple Podcast deleted successfully.",
                    });
                },
                (err) => {
                    Toast.fire({
                        icon: 'error',
                        title: "Error while delete exists Apple Podcast.",
                    });
                }
            )
            .catch((err) => {
                Toast.fire({
                    icon: 'error',
                    title: "Error while delete exists Apple Podcast.",
                });
            });
    };

    useEffect(() => {
        props.getExistingPodcasts();
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
                    "No results, try another search of enter a Podcast URL"
                );
            }
        } catch (error) {
            console.debug(`file: ApplePodcastConfig.js error`, error);
        }
    };

    const addAnnotation = async (formData) => {
        if (props.limitReached) {
            this.props.upgradePopup('podcast-trackers')
            // const accountNotLinkedHtml =
            //     "" +
            //     '<div class="">' +
            //     '<img src="/images/annotation_limit_reached.png" class="img-fluid">' +
            //     "</div>";

            // swal.fire({
            //     html: accountNotLinkedHtml,
            //     width: 1000,
            //     showCancelButton: true,
            //     showCloseButton: true,
            //     customClass: {
            //         popup: "themePlanAlertPopup",
            //         htmlContainer: "themePlanAlertPopupContent",
            //         closeButton: 'btn-closeplanAlertPopup',
            //     },
            //     cancelButtonClass: "btn-bookADemo",
            //     cancelButtonText: "Book a Demo",
            //     confirmButtonClass: "btn-subscribeNow",
            //     confirmButtonText: "Subscribe now",
            // }).then((value) => {
            //     if (value.isConfirmed) window.location.href = '/settings/price-plans'
            // });
        } else {
            Toast.fire({
                icon: 'info',
                title: "Creating Annotations",
            });
            HttpClient.post("/data-source/apple_podcast_url", formData)
                .then(
                    () => {
                        Toast.fire({
                            icon: 'success',
                            title: "Apple Podcast added successfully.",
                        });
                    },
                    (err) => {
                        Toast.fire({
                            icon: 'error',
                            title: "Error while adding Apple Podcast.",
                        });
                    }
                )
                .catch((err) => {
                    Toast.fire({
                        icon: 'error',
                        title: "Error while adding Apple Podcast.",
                    });
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
                <h4 className='textblue'>Add new podcast</h4>


                <div className="input-group mb-3">
                    <input type="text" className="form-control search-input" placeholder="Search or Enter the Podcast URL" value={inputVale} id="applePodcastURL" name="applePodcastURL" onChange={(e) => setInputVale(e.target.value.toLowerCase())} onKeyUp={(e) => { if (e.keyCode === 13) { e.persist(); getMetaData(e); } }} />
                    <div className="input-group-append">
                        <i className="ti-plus"></i>
                    </div>
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

                {/* {existingPodcast.length ? (
                    <div>
                        {existingPodcast.map((itm, index) => (
                                <h5 style={{ display: "inline-block" }} key={itm.id != "" ? itm.id : index}>
                                    <span className="badge badge-pill badge-primary m-1 h5">
                                        {itm.name}{" "}
                                        <i className="fa fa-times" data-apple-podcast-name={itm.name} data--apple-podcast-id={itm.id} onClick={() => deletePodcasts(itm)}></i>
                                    </span>
                                </h5>
                        ))}
                    </div>
                ) : null} */}
            </div>

            {props.existingPodcast.length ? <div className="white-box">
                <h4 className='textblue'>Manage podcasts</h4>
                <div className="gray-box">
                    <h4>
                        Active podcasts: <span>(Click to remove)</span>
                    </h4>
                    <div className="d-flex keywordTags">
                        {props.existingPodcast?.map((gAK) => {
                            return (
                                <>
                                    <button
                                        onClick={() =>
                                            setActiveDeletePopover(gAK.id)
                                        }
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
                                        {gAK.name}
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
                                            onClick={() => deletePodcasts(gAK)}
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

export default ApplePodcastConfig;
