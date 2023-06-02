import React from "react";
import Select from 'react-select'
import HttpClient from "./HttpClient";
import GoogleAnalyticsPropertySelect from "./GoogleAnalyticsPropertySelect";
import {CustomTooltip} from "../components/annotations/IndexAnnotation";
import Toast from "../utils/Toast";

import {
    Popover,
    PopoverBody,
} from "reactstrap";
export default class YoutubeTracking extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            
            isBusy: false,
            errors: "",
            gaPropertyId: null,
            gaPropertyName: null,
            editProperty: null,
            configuration_id: null,


            url: "",
            old_videos_uploaded: true,
            new_videos_uploaded: true,
            when_video_reach_likes: 1,
            is_video_likes_tracking_on: true,
            when_video_reach_comments: 1,
            is_video_comments_tracking_on: true,
            when_video_reach_views: 1,
            is_video_views_tracking_on: true,

            configurations: [],
            activeDeletePopover: null

        };

        this.onSubmitHandler = this.onSubmitHandler.bind(this);
        this.fetchConfigurations = this.fetchConfigurations.bind(this);
        // this.runjob = this.runjob.bind(this);
        this.deleteSelected = this.deleteSelected.bind(this);
    }

    componentDidMount() {
        this.fetchConfigurations();
    }

    fetchConfigurations() {
        /*
        * this function will fetch configurations for given user
        * */
        this.setState({isBusy: true})
        HttpClient.get('/data-source/get-youtube-monitor').then(resp => {
            this.setState({
                configurations: resp.data.configurations
            });
            document.getElementById('old_videos_uploaded').checked = true;
            document.getElementById('new_videos_uploaded').checked = true;
            document.getElementById('post_likes').value = 1;
            document.getElementById('post_comments').value = 1;
            document.getElementById('post_views').value = 1;
            document.getElementById('is_post_likes_tracking_on_checkbox').checked = true;
            document.getElementById('is_post_comments_tracking_on_checkbox').checked = true;
            document.getElementById('is_post_views_tracking_on_checkbox').checked = true;

        }, (err) => {
            this.setState({isBusy: false, errors: (err.response).data});
        }).catch(err => {
            this.setState({isBusy: false, errors: err});
        });
    }

    deleteSelected = (payload) => {

        HttpClient.delete(`/data-source/remove-youtube-monitor/${payload.id}`)
            .then(
                () => {
                    this.fetchConfigurations();
                    Toast.fire({
                        icon: 'success',
                        title: "Youtube configuration deleted successfully.",
                    });
                },
                (err) => {
                    Toast.fire({
                        icon: 'error',
                        title: "Error while delete exists Youtube configuration.",
                    });
                }
            )
            .catch((err) => {
                Toast.fire({
                    icon: 'error',
                    title: "Error while delete exists Youtube configuration.",
                });
            });

    }

    onSubmitHandler() {
        let form_data = {
            old_videos_uploaded: this.state.old_videos_uploaded,
            new_videos_uploaded: this.state.new_videos_uploaded,
            url: this.state.url,

            when_video_reach_likes: this.state.when_video_reach_likes,
            is_video_likes_tracking_on: this.state.is_video_likes_tracking_on,

            when_video_reach_comments: this.state.when_video_reach_comments,
            is_video_comments_tracking_on: this.state.is_video_comments_tracking_on,

            when_video_reach_views: this.state.when_video_reach_views,
            is_video_views_tracking_on: this.state.is_video_views_tracking_on,

            ga_property_id: this.state.gaPropertyId,
        }
        if (!this.state.configurations.length) {
            this.props.serviceStatusHandler({ target: { name: 'is_ds_youtube_tracking_enabled', value: true, checked: true }}, true)
        }
        HttpClient.post('/data-source/save-youtube-monitor', form_data).then(resp => {
            this.setState({isBusy: false});
            
            console.log(1);
            this.props.loadUserDataSources();
            console.log(2)
            this.fetchConfigurations();
            console.log(3)
            swal.fire('', "We will retrieve the videos data to your preferences; it may take a few minutes. Subsequently, the system will perform a daily check and automatically add relevant annotations to your account.", '');
            console.log(4)

        }, (err) => {
            Toast.fire({
                icon: 'error',
                title: err.response.data.message
            })
            this.setState({isBusy: false, errors: (err.response).data});
        }).catch(err => {
            this.setState({isBusy: false, errors: err});
        });
    }

    render() {
        return (
            <div className="apps-bodyContent switch-wrapper">
                <div className="weather_alert_cities-form box-shadow pt-4 pb-4 pr-4 pl-4">
                    <label>Add Youtube Channel:</label>
                    <div className="d-flex align-items-center w-100">
                        <div className="input-group">
                            <input type="text" 
                                className="form-control search-input" 
                                placeholder="Enter the channel name or complete url" 
                                value={this.state.url} id="youtubeMonitorURL" 
                                name="youtubeMonitorURL" 
                                onChange={(e) => this.setState({url: e.target.value.toLowerCase()})} 
                            />
                        </div>

                        <span className="betweentext">for</span>
                        <GoogleAnalyticsPropertySelect
                            className="themeNewselect hide-icon"
                            name="ga_property_id"
                            id="ga_property_id"
                            currentPricePlan={this.props.user.price_plan}
                            value={this.state.gaPropertyId}
                            onChangeCallback={(gAP) => {
                                this.setState({gaPropertyId: gAP.target.value || null})
                            }}
                            placeholder="Select GA Properties"
                            isClearable={true}
                        />
                    </div>
                    
                    <h5 className="gaa-text-primary mt-2"><b>Create Annotation When:</b></h5>

                    <div className="mt-2">
                        <div className="d-flex align-items-center form-check themeNewCheckbox">
                            <input className="form-check-input mt-0" id='old_videos_uploaded' onChange={(e) => {
                                this.setState({
                                    old_videos_uploaded: e.target.checked
                                })
                            }} type="checkbox"/>
                            <label className="d-flex align-items-center form-check-label" htmlFor="old_videos_uploaded">
                                Old Video Uploaded
                            </label>
                        </div>
                    </div>

                    <div className="mt-2">
                        <div className="d-flex align-items-center form-check themeNewCheckbox">
                            <input className="form-check-input mt-0" id='new_videos_uploaded' onChange={(e) => {
                                this.setState({
                                    new_videos_uploaded: e.target.checked
                                })
                            }} type="checkbox"/>
                            <label className="d-flex align-items-center form-check-label" htmlFor="new_videos_uploaded">
                                New Video Uploaded
                            </label>
                        </div>
                    </div>

                    <div className="mt-2">
                        <div className="d-flex align-items-center form-check themeNewCheckbox">
                            <input className="form-check-input mt-0" type="checkbox" value=""
                                   id="is_post_likes_tracking_on_checkbox" onChange={(e) => {
                                this.setState({
                                    is_video_likes_tracking_on: e.target.checked
                                })
                            }}/>
                            <label className="d-flex align-items-center form-check-label" htmlFor="is_post_likes_tracking_on_checkbox">
                                A Video Reached
                                <input
                                    name="post_likes"
                                    id="post_likes"
                                    onKeyUp={(e) => {
                                        this.setState({
                                            when_video_reach_likes: e.target.value
                                        })
                                    }}
                                    className="d-inline border m-1 mx-3 text-center p-1 w-25"/>
                                Likes
                            </label>
                        </div>
                    </div>

                    <div className="mt-2">
                        <div className="d-flex align-items-center form-check themeNewCheckbox">
                            <input className="form-check-input mt-0" type="checkbox" value=""
                                   id="is_post_comments_tracking_on_checkbox" onChange={(e) => {
                                this.setState({
                                    is_video_comments_tracking_on: e.target.checked
                                })
                            }}/>
                            <label className="d-flex align-items-center form-check-label" htmlFor="is_post_comments_tracking_on_checkbox">
                                A Video Reached
                                <input
                                    name="post_comments"
                                    id="post_comments"
                                    onKeyUp={(e) => {
                                        this.setState({
                                            when_video_reach_comments: e.target.value
                                        })
                                    }}
                                    className="d-inline border m-1 mx-3 text-center p-1 w-25"/>
                                Comments
                            </label>
                        </div>
                    </div>

                    <div className="mt-2">
                        <div className="d-flex align-items-center form-check themeNewCheckbox">
                            <input className="form-check-input mt-0" type="checkbox" value=""
                                   id="is_post_views_tracking_on_checkbox" onChange={(e) => {
                                this.setState({
                                    is_video_views_tracking_on: e.target.checked
                                })
                            }}/>
                            <label className="d-flex align-items-center form-check-label" htmlFor="is_post_views_tracking_on_checkbox">
                                A Video Reached
                                <input
                                    name="post_views"
                                    id="post_views"
                                    onKeyUp={(e) => {
                                        this.setState({
                                            when_video_reach_views: e.target.value
                                        })
                                    }}
                                    className="d-inline border m-1 mx-3 text-center p-1 w-25"/>
                                Views
                            </label>
                        </div>
                    </div>

                    <div className="mt-4 text-right">
                        <button
                            className="btn btn-success"
                            onClick={this.onSubmitHandler}
                        >
                            Add
                        </button>
                    </div>

                </div>


                <div className="gray-box mt-4">
                    <h4>
                        Active Channels: <span>(Click to remove)</span>
                    </h4>
                    <div className="d-flex keywordTags">
                        {this.state.configurations?.map((gAK, index) => {
                            return (
                                <>
                                    <button
                                        onClick={() => {
                                            this.setState({activeDeletePopover: gAK})
                                        }}
                                        id={"gAK-" + gAK.id}
                                        type="button"
                                        className="keywordTag dd-tooltip d-flex"
                                        key={gAK.id}
                                        user_data_source_id={gAK.id}
                                    >
                                        <CustomTooltip tooltipText={gAK.url}
                                                        maxLength={50}>
                                            <span
                                                style={{background: "#2d9cdb"}}
                                                className="dot"
                                            ></span>
                                            {gAK.gaPropertyName ? gAK.gaPropertyName : "All Properties"}
                                        </CustomTooltip>
                                    </button>

                                    <Popover
                                        placement="top"
                                        target={"gAK-" + gAK.id}
                                        isOpen={
                                            this.state.activeDeletePopover?.id ===
                                            gAK.id
                                        }
                                    >
                                        <PopoverBody web_monitor_id={gAK.id}>
                                            Are you sure you want to remove, it will delete all the annotations related to this."
                                            {gAK.gaPropertyName}"?.
                                        </PopoverBody>
                                        <button
                                            onClick={() => {
                                                this.deleteSelected(this.state.activeDeletePopover)
                                                if (this.state.configurations.length === 1) {
                                                    this.props.serviceStatusHandler({ target: { name: 'is_ds_youtube_tracking_enabled', value: false, checked: false }}, true)
                                                    this.props.sectionToggler();
                                                }
                                            }}
                                            key={gAK.id}
                                            user_data_source_id={gAK.id}
                                        >
                                            Yes
                                        </button>
                                        <button
                                            onClick={() =>
                                                this.setState({activeDeletePopover: ""})
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
    }
}
