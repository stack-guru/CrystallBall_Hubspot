import axios from "axios";
import React, { useState } from "react";
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
} from "reactstrap";

const ApplePodcastConfig = (props) => {
    const [searchResult, setSearchResult] = useState([]);

    const getMetaData = async (ev) => {
        ev.preventDefault();
        try {
            setSearchResult([]);
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
                    collectionViewUrl: item.collectionViewUrl,
                    trackCount: item.trackCount,
                });
            }
            setSearchResult(sr);
        } catch (error) {
            console.debug(`file: ApplePodcastConfig.js error`, error);
        }
    };

    const addAnnotation = async (formData) => {
        HttpClient.post('/data-source/apple_podcast_url', formData).then(() => {
            props.setState({
                isBusy: false,
                errors: undefined
            })
        }, (err) => {
            props.setState({isBusy: false, errors: err.response.data})
        }).catch(err => {
            props.setState({isBusy: false, errors: err})
        })
    }
    return (
        <div className="switch-wrapper">
            <div>
                <h4 className="gaa-text-primary">Add Apple Podcast</h4>
            </div>
            <Form onSubmit={getMetaData}>
                <FormGroup>
                    <Input
                        type="text"
                        name="applePodcastURL"
                        id="applePodcastURL"
                        placeholder="Enter URL or Search Podcast"
                        required
                    />
                </FormGroup>
                <Button type="submit" className="mt-3">
                    Search
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

                        <Button onClick={() => addAnnotation(t0a)}>Create Annotations</Button>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default ApplePodcastConfig;
