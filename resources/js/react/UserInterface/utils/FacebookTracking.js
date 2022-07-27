import React from "react";
import Select from 'react-select'

export default class FacebookTracking extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isBusy: false,
            errors: "",
            facebook_pages: [
                { value: 'chocolate', label: 'Chocolate' },
                { value: 'strawberry', label: 'Strawberry' },
                { value: 'vanilla', label: 'Vanilla' }
            ]
        };

    }

    componentDidMount() {
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
