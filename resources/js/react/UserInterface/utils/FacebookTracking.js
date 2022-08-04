import React from "react";
import Select from 'react-select'
import HttpClient from "./HttpClient";

export default class FacebookTracking extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isBusy: false,
            errors: "",
            facebook_pages: []
        };

        this.fetchFacebookPages = this.fetchFacebookPages.bind(this);
    }

    componentDidMount() {
        this.fetchFacebookPages();
    }

    fetchFacebookPages(){
        this.setState({ isBusy: true })
            HttpClient.get('/data-source/get-facebook-page-list').then(resp => {
                this.setState({ facebook_pages: resp.data.facebook_pages, isBusy: false });
            }, (err) => {
                this.setState({ isBusy: false, errors: (err.response).data });
            }).catch(err => {
                this.setState({ isBusy: false, errors: err });
        });
    }

    render() {
        return (
            <div className="switch-wrapper">
                <div className="weather_alert_cities-form">
                    <h4 className="gaa-text-primary">Configure Facebook</h4>
                    <label>Select Facebook Pages</label>
                    <div className="w-100 mb-3">
                        <Select options={this.state.facebook_pages} isMulti />
                    </div>

                    <h5 className="gaa-text-primary"><b>Create Annotation When:</b></h5>
                    <div className="w-100 mb-3">
                        <div className="form-check">
                            <input className="form-check-input" type="checkbox" value="" id="new_facebook_post" />
                            <label className="form-check-label" htmlFor="new_facebook_post">
                                New Post On Facebook Page
                            </label>
                        </div>
                    </div>

                    <label>A Post Reached Likes</label>

                    <div className="input-group mb-3">
                        <input
                            type="number"
                            className="form-control"
                            placeholder="Enter likes"
                            min="0"
                            name="post_likes"
                            id="post_likes"
                        />
                    </div>

                    <label>A Post Reached Views</label>

                    <div className="input-group mb-3">
                        <input
                            type="number"
                            className="form-control"
                            placeholder="Enter views"
                            min="0"
                            name="post_views"
                            id="post_views"
                        />
                    </div>

                    <label>A Post Reached Shares</label>

                    <div className="input-group mb-3">
                        <input
                            type="number"
                            className="form-control"
                            placeholder="Enter shares"
                            min="0"
                            name="post_shares"
                            id="post_shares"
                        />
                    </div>



                    <div className="mt-4">
                        <button
                            className="btn btn-success"
                        >
                            Save
                        </button>
                    </div>

                </div>

            </div>
        );
    }
}
