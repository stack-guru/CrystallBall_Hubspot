import React from "react";
import Select from 'react-select'
import HttpClient from "./HttpClient";
import GoogleAnalyticsPropertySelect from "./GoogleAnalyticsPropertySelect";

export default class InstagramTracking extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            
            isBusy: false,
            errors: "",
            gaPropertyId: null,
            gaPropertyName: null,
            editProperty: null,
            configuration_id: null,
            when_new_post_on_instagram: true,

            is_post_likes_tracking_on: true,
            is_post_comments_tracking_on: true,
            is_post_views_tracking_on: true,
            is_post_shares_tracking_on: true,

            when_post_reach_likes: 1000,
            when_post_reach_comments: 1000,
            when_post_reach_shares: 1000,
            when_post_reach_views: 1000,

        };

        this.onSubmitHandler = this.onSubmitHandler.bind(this);
        this.fetchConfigurations = this.fetchConfigurations.bind(this);

    }

    componentDidMount() {
        this.fetchConfigurations();
    }

    fetchConfigurations() {
        /*
        * this function will fetch configurations for given user
        * */
        this.setState({isBusy: true})
        HttpClient.get('/data-source/get-instagram-tracking-configurations').then(resp => {
            this.setState({
                when_new_post_on_instagram: resp.data.when_new_post_on_instagram,
                when_post_reach_comments: resp.data.when_post_reach_comments,
                when_post_reach_likes: resp.data.when_post_reach_likes,
                when_post_reach_shares: resp.data.when_post_reach_shares,
                when_post_reach_views: resp.data.when_post_reach_views,

                is_post_likes_tracking_on: resp.data.is_post_likes_tracking_on,
                is_post_comments_tracking_on: resp.data.is_post_comments_tracking_on,
                is_post_views_tracking_on: resp.data.is_post_views_tracking_on,
                is_post_shares_tracking_on: resp.data.is_post_shares_tracking_on,

                gaPropertyId: resp.data.ga_property_id,
                gaPropertyName: resp.data.gaPropertyName,
                configuration_id: resp.data.configuration_id

            });
            document.getElementById('when_new_post_on_instagram').checked = resp.data.when_new_post_on_instagram;
            document.getElementById('post_likes').value = resp.data.when_post_reach_likes;
            document.getElementById('post_comments').value = resp.data.when_post_reach_comments;
            document.getElementById('post_views').value = resp.data.when_post_reach_views;
            document.getElementById('post_shares').value = resp.data.when_post_reach_shares;

            document.getElementById('is_post_likes_tracking_on_checkbox').checked = resp.data.is_post_likes_tracking_on;
            document.getElementById('is_post_comments_tracking_on_checkbox').checked = resp.data.is_post_comments_tracking_on;
            document.getElementById('is_post_views_tracking_on_checkbox').checked = resp.data.is_post_views_tracking_on;
            document.getElementById('is_post_shares_tracking_on_checkbox').checked = resp.data.is_post_shares_tracking_on;

        }, (err) => {
            this.setState({isBusy: false, errors: (err.response).data});
        }).catch(err => {
            this.setState({isBusy: false, errors: err});
        });
    }

    onSubmitHandler() {
        let form_data = {
            when_new_post_on_instagram: this.state.when_new_post_on_instagram,

            when_post_reach_likes: this.state.when_post_reach_likes,
            when_post_reach_comments: this.state.when_post_reach_comments,
            when_post_reach_shares: this.state.when_post_reach_shares,
            when_post_reach_views: this.state.when_post_reach_views,

            is_post_likes_tracking_on: this.state.is_post_likes_tracking_on,
            is_post_comments_tracking_on: this.state.is_post_comments_tracking_on,
            is_post_views_tracking_on: this.state.is_post_views_tracking_on,
            is_post_shares_tracking_on: this.state.is_post_shares_tracking_on,

            ga_property_id: this.state.gaPropertyId,
        }
        HttpClient.post('/data-source/save-instagram-tracking-configurations', form_data).then(resp => {
            this.setState({isBusy: false, gaPropertyName: resp.data.gaPropertyName, configuration_id: true, editProperty: false});
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
            })

            Toast.fire({
                icon: 'success',
                title: 'Stored successfully!'
            })
        }, (err) => {
            this.setState({isBusy: false, errors: (err.response).data});
        }).catch(err => {
            this.setState({isBusy: false, errors: err});
        });
    }

    render() {
        return (
            <div className="apps-bodyContent switch-wrapper">
                <div className="weather_alert_cities-form">
                    <h4 className="gaa-text-primary">Configure Instagram</h4>

                    {!this.state.configuration_id || this.state.editProperty
                        ?
                            <div className="d-flex align-items-center w-100">
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
                            {
                                this.state.editProperty
                                ?
                                <i className="ml-2 icon fa" onClick={() => this.setState({ editProperty: false })}>
                                    <img className="w-14px" src='/close-icon.svg' />
                                </i>
                                : ""
                            }
                            </div>
                        :
                            <>
                            <span>{this.state.gaPropertyName ? this.state.gaPropertyName : "All Properties"}</span>
                            <i className="ml-2 icon fa" onClick={() => this.setState({ editProperty: true })}>
                                <img className="w-20px" src='/icon-edit.svg' />
                            </i>
                            </>
                        }
                    
                    <h5 className="gaa-text-primary"><b>Create Annotation When:</b></h5>

                    <div className="mt-2">
                        <div className="form-check">
                            <input className="form-check-input" id='when_new_post_on_instagram' onChange={(e) => {
                                this.setState({
                                    when_new_post_on_instagram: e.target.checked
                                })
                            }} type="checkbox"/>
                            <label className="form-check-label" htmlFor="when_new_post_on_instagram">
                                New Post On Instagram Profile
                            </label>
                        </div>
                    </div>

                    <div className="mt-2">
                        <div className="form-check">
                            <input className="form-check-input" type="checkbox" value=""
                                   id="is_post_likes_tracking_on_checkbox" onChange={(e) => {
                                this.setState({
                                    is_post_likes_tracking_on: e.target.checked
                                })
                            }}/>
                            <label className="form-check-label" htmlFor="is_post_likes_tracking_on_checkbox">
                                A Post Reached
                                <input
                                    name="post_likes"
                                    id="post_likes"
                                    onKeyUp={(e) => {
                                        this.setState({
                                            when_post_reach_likes: e.target.value
                                        })
                                    }}
                                    className="d-inline border m-1 mx-3 text-center p-1 w-25"/>
                                Likes
                            </label>
                        </div>
                    </div>

                    <div className="mt-2">
                        <div className="form-check">
                            <input className="form-check-input" type="checkbox" value=""
                                   id="is_post_comments_tracking_on_checkbox" onChange={(e) => {
                                this.setState({
                                    is_post_comments_tracking_on: e.target.checked
                                })
                            }}/>
                            <label className="form-check-label" htmlFor="is_post_comments_tracking_on_checkbox">
                                A Post Reached
                                <input
                                    name="post_comments"
                                    id="post_comments"
                                    onKeyUp={(e) => {
                                        this.setState({
                                            when_post_reach_comments: e.target.value
                                        })
                                    }}
                                    className="d-inline border m-1 mx-3 text-center p-1 w-25"/>
                                Comments
                            </label>
                        </div>
                    </div>

                    <div className="mt-2">
                        <div className="form-check">
                            <input className="form-check-input" type="checkbox" value=""
                                   id="is_post_views_tracking_on_checkbox" onChange={(e) => {
                                this.setState({
                                    is_post_views_tracking_on: e.target.checked
                                })
                            }}/>
                            <label className="form-check-label" htmlFor="is_post_views_tracking_on_checkbox">
                                A Post Reached
                                <input
                                    name="post_views"
                                    id="post_views"
                                    onKeyUp={(e) => {
                                        this.setState({
                                            when_post_reach_views: e.target.value
                                        })
                                    }}
                                    className="d-inline border m-1 mx-3 text-center p-1 w-25"/>
                                Views
                            </label>
                        </div>
                    </div>

                    <div className="mt-2">
                        <div className="form-check">
                            <input className="form-check-input" type="checkbox" value=""
                                   id="is_post_shares_tracking_on_checkbox" onChange={(e) => {
                                this.setState({
                                    is_post_shares_tracking_on: e.target.checked
                                })
                            }}/>
                            <label className="form-check-label" htmlFor="is_post_shares_tracking_on_checkbox">
                                A Post Reached
                                <input
                                    name="post_shares"
                                    id="post_shares"
                                    onKeyUp={(e) => {
                                        this.setState({
                                            when_post_reach_shares: e.target.value
                                        })
                                    }}
                                    className="d-inline border m-1 mx-3 text-center p-1 w-25"/>
                                Shares
                            </label>
                        </div>
                    </div>

                    <div className="mt-4">
                        <button
                            className="btn btn-success"
                            onClick={this.onSubmitHandler}
                        >
                            Save
                        </button>
                    </div>

                </div>

            </div>
        );
    }
}
