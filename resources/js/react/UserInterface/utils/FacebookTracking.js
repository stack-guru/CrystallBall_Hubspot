import React from "react";
import Select from 'react-select'
import HttpClient from "./HttpClient";
import SearchEngineSelect from "./SearchEngineSelect";
import FacebookPagesSelect from "./FacebookPagesSelect";

export default class FacebookTracking extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isBusy: false,
            errors: "",
            facebook_pages: [],
            selected_facebook_pages: [],
            when_new_post_on_facebook: true,
            when_new_ad_compaing_launched: true,
            when_ad_compaign_ended: true,
            when_changes_on_ad_compaign: true,

            is_post_likes_tracking_on: true,
            is_post_comments_tracking_on: true,
            is_post_views_tracking_on: true,
            is_post_shares_tracking_on: true,

            when_post_reach_likes: 1000,
            when_post_reach_comments: 1000,
            when_post_reach_shares: 1000,
            when_post_reach_views: 1000,
        };

        this.changePageHandler = this.changePageHandler.bind(this);
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
        HttpClient.get('/data-source/get-facebook-tracking-configurations').then(resp => {
            this.setState({
                selected_facebook_pages: resp.data.selected_pages,
                when_ad_compaign_ended: resp.data.when_ad_compaign_ended,
                when_changes_on_ad_compaign: resp.data.when_changes_on_ad_compaign,
                when_new_ad_compaing_launched: resp.data.when_new_ad_compaign_launched,
                when_new_post_on_facebook: resp.data.when_new_post_on_facebook,
                when_post_reach_comments: resp.data.when_post_reach_comments,
                when_post_reach_likes: resp.data.when_post_reach_likes,
                when_post_reach_shares: resp.data.when_post_reach_shares,
                when_post_reach_views: resp.data.when_post_reach_views,

                is_post_likes_tracking_on: resp.data.is_post_likes_tracking_on,
                is_post_comments_tracking_on: resp.data.is_post_comments_tracking_on,
                is_post_views_tracking_on: resp.data.is_post_views_tracking_on,
                is_post_shares_tracking_on: resp.data.is_post_shares_tracking_on,

            });
            document.getElementById('when_new_post_on_facebook').checked = resp.data.when_new_post_on_facebook;
            document.getElementById('new_ad_compaign_launched').checked = resp.data.when_new_ad_compaign_launched;
            document.getElementById('an_ad_compaign_ended').checked = resp.data.when_ad_compaign_ended;
            document.getElementById('changes_on_ad_compaign').checked = resp.data.when_changes_on_ad_compaign;
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
            selected_facebook_pages: this.state.selected_facebook_pages,
            when_new_post_on_facebook: this.state.when_new_post_on_facebook,
            when_new_ad_campaign_launched: this.state.when_new_ad_compaing_launched,
            when_ad_campaign_ended: this.state.when_ad_compaign_ended,
            when_changes_on_ad_campaign: this.state.when_changes_on_ad_compaign,

            when_post_reach_likes: this.state.when_post_reach_likes,
            when_post_reach_comments: this.state.when_post_reach_comments,
            when_post_reach_shares: this.state.when_post_reach_shares,
            when_post_reach_views: this.state.when_post_reach_views,

            is_post_likes_tracking_on: this.state.is_post_likes_tracking_on,
            is_post_comments_tracking_on: this.state.is_post_comments_tracking_on,
            is_post_views_tracking_on: this.state.is_post_views_tracking_on,
            is_post_shares_tracking_on: this.state.is_post_shares_tracking_on,
        }
        HttpClient.post('/data-source/save-facebook-tracking-configurations', form_data).then(resp => {
            this.setState({facebook_pages: resp.data.facebook_pages, isBusy: false});
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

    changePageHandler(val) {
        this.setState({
            selected_facebook_pages: val
        })
    }

    render() {
        return (
            <div className="switch-wrapper">
                <div className="weather_alert_cities-form">
                    <h4 className="gaa-text-primary">Configure Facebook</h4>
                    <label>Select Facebook Pages</label>
                    <div className="w-100 mb-3">
                        {/*<Select options={this.state.facebook_pages} isMulti onChange={this.pagesOnChangeHandler} value={this.selected_facebook_pages} />*/}
                        <FacebookPagesSelect className="gray_clr" multiple name="facebook_page" id="facebook_page"
                                             value={this.state.selected_facebook_pages}
                                             onChangeCallback={this.changePageHandler}
                                             placeholder="Select Facebook Page"/>
                    </div>

                    <h5 className="gaa-text-primary"><b>Create Annotation When:</b></h5>

                    <div className="mt-2">
                        <div className="form-check">
                            <input className="form-check-input" id='when_new_post_on_facebook' onChange={(e) => {
                                this.setState({
                                    when_new_post_on_facebook: e.target.checked
                                })
                            }} type="checkbox"/>
                            <label className="form-check-label" htmlFor="when_new_post_on_facebook">
                                New Post On Facebook Page
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


                    <div className="mt-2">
                        <div className="form-check">
                            <input className="form-check-input" type="checkbox" value="" id="new_ad_compaign_launched"
                                   onChange={(e) => {
                                       this.setState({
                                           when_new_ad_compaing_launched: e.target.checked
                                       })
                                   }}/>
                            <label className="form-check-label" htmlFor="new_ad_compaign_launched">
                                A New Ad Campaign Launched
                            </label>
                        </div>
                    </div>

                    <div className="mt-2">
                        <div className="form-check">
                            <input className="form-check-input" type="checkbox" value="" id="an_ad_compaign_ended"
                                   onChange={(e) => {
                                       this.setState({
                                           when_ad_compaign_ended: e.target.checked
                                       })
                                   }}/>
                            <label className="form-check-label" htmlFor="an_ad_compaign_ended">
                                An Ad Campaign Ended
                            </label>
                        </div>
                    </div>

                    <div className="mt-2">
                        <div className="form-check">
                            <input className="form-check-input" type="checkbox" value="" id="changes_on_ad_compaign"
                                   onChange={(e) => {
                                       this.setState({
                                           when_changes_on_ad_compaign: e.target.checked
                                       })
                                   }}/>
                            <label className="form-check-label" htmlFor="changes_on_ad_compaign">
                                Changes On An Ad Compaign
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
