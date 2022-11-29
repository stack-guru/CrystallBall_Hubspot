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

    const getExistingPodcasts = async () => {
        HttpClient.get("/data-source/apple-podcast-monitor")
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
    }, []);

    const getMetaData = async (ev) => {
        ev.preventDefault();
        try {
            setSearchResult([]);
            setNoResult("");
            const result = await axios.get(
                `https://itunes.apple.com/search?term=${encodeURIComponent(
                    ev.target.applePodcastURL.value
                )}&media=podcast&entity=podcast&explicit=Yes&limit=10`
            );
            var sr = [];
            for (const item of result.data?.results) {
                sr.push({
                    previewImage: item.artworkUrl100,
                    collectionName: item.collectionName,
                    collectionId: item.collectionId,
                    feedUrl: item.feedUrl,
                    collectionViewUrl: item.collectionViewUrl,
                    trackCount: item.trackCount,
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
            {existingPodcast.length ? <div>
                <h4 className="gaa-text-primary">Existing Podcast</h4>
                <div>
                    <Table size="sm">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {existingPodcast.map((itm) => (
                                <tr>
                                    <td className="cb-ap-table-name">
                                        {itm.name}
                                    </td>
                                    <td className="cb-ap-pointer">
                                        <Button
                                            onClick={() => deletePodcasts(itm)}
                                            color="danger"
                                            size="sm"
                                        >
                                            DELETE
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </div>: null}
            <div>
                <h4 className="gaa-text-primary">Add Apple Podcast</h4>
            </div>
            <Form onSubmit={getMetaData}>
                <FormGroup>
                    <Input
                        type="text"
                        name="applePodcastURL"
                        id="applePodcastURL"
                        placeholder="Search or Enter the Podcast URL"
                        required
                    />
                    {noResult && <div>{noResult}</div>}
                </FormGroup>

                <Button type="submit" className="mt-3">
                    Search
                </Button>
                <Button
                    onClick={() => {
                        props.sectionToggler();
                    }}
                    type="button"
                    className="mt-3 ml-3"
                >
                    Cancel
                </Button>
            </Form>
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
