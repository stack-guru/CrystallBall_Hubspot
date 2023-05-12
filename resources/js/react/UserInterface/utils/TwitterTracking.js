import React from "react";
import HttpClient from "./HttpClient";
import Toast from "../utils/Toast";
import GoogleAnalyticsPropertySelect from "./GoogleAnalyticsPropertySelect";

export default class FacebookTracking extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isBusy: false,
            errors: "",
            gaPropertyId: null,
            gaPropertyName: null,
            editProperty: null,
            configuration_id: null,
            is_tweets_likes_tracking_on: false,
            when_tweet_reach_likes: 0,
            is_tweets_retweets_tracking_on: false,
            when_tweet_reach_retweets: 0,
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
        this.setState({ isBusy: true });
        HttpClient.get("/data-source/get-twitter-tracking-configurations")
            .then(
                (resp) => {
                    this.setState({
                        is_tweets_likes_tracking_on:
                            resp.data.is_tweets_likes_tracking_on,
                        when_tweet_reach_likes:
                            resp.data.when_tweet_reach_likes,
                        is_tweets_retweets_tracking_on:
                            resp.data.is_tweets_retweets_tracking_on,
                        when_tweet_reach_retweets:
                            resp.data.when_tweet_reach_retweets,
                        gaPropertyId: resp.data.ga_property_id,
                        gaPropertyName: resp.data.gaPropertyName,
                        configuration_id: resp.data.configuration_id
                    });
                    document.getElementById(
                        "is_tweets_likes_tracking_on_checkbox"
                    ).checked = resp.data.is_tweets_likes_tracking_on ?? 0;
                    document.getElementById("when_tweet_reach_likes").value =
                        resp.data.when_tweet_reach_likes ?? 0;
                    document.getElementById(
                        "is_tweets_retweets_tracking_on_checkbox"
                    ).checked = resp.data.is_tweets_retweets_tracking_on ?? 0;
                    document.getElementById("when_tweet_reach_retweets").value =
                        resp.data.when_tweet_reach_retweets ?? 0;
                },
                (err) => {
                    this.setState({ isBusy: false, errors: err.response.data });
                }
            )
            .catch((err) => {
                this.setState({ isBusy: false, errors: err });
            });
    }

    onSubmitHandler() {
        let form_data = {
            is_tweets_likes_tracking_on: this.state.is_tweets_likes_tracking_on,
            when_tweet_reach_likes: this.state.when_tweet_reach_likes,
            is_tweets_retweets_tracking_on:
                this.state.is_tweets_retweets_tracking_on,
            when_tweet_reach_retweets: this.state.when_tweet_reach_retweets,
            ga_property_id: this.state.gaPropertyId,

        };
        HttpClient.post(
            "/data-source/save-twitter-tracking-configurations",
            form_data
        )
            .then(
                (resp) => {
                    this.setState({isBusy: false, gaPropertyName: resp.data.gaPropertyName, configuration_id: true, editProperty: false});
                    Toast.fire({
                        icon: "success",
                        title: "Stored successfully!",
                    });
                },
                (err) => {
                    this.setState({ isBusy: false, errors: err.response.data });
                }
            )
            .catch((err) => {
                this.setState({ isBusy: false, errors: err });
            });
    }

    render() {
        return (
            <div className="apps-bodyContent">
                <div className="white-box">

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
                        <div className="d-flex align-text-center">
                        <span>{this.state.gaPropertyName ? this.state.gaPropertyName : "All Properties"}</span>
                        <i className="ml-2 icon fa" onClick={() => this.setState({ editProperty: true })}>
                            <img className="w-20px" src='/icon-edit.svg' />
                        </i>
                        </div>
                    }

                    <h4 className="">Create Annotation When</h4>

                    <div className="checkBoxList d-flex flex-column">
                        <label className="themeNewCheckbox d-flex align-items-center justify-content-start textDark" htmlFor="is_tweets_likes_tracking_on_checkbox">
                            <input type="checkbox" checked={ this.state.is_tweets_likes_tracking_on } id="is_tweets_likes_tracking_on_checkbox" onChange={(e) => {this.setState({is_tweets_likes_tracking_on: e.target.checked,});}}/>
                            <span>A Post received</span>
                            <input id="when_tweet_reach_likes" onKeyUp={(e) => {this.setState({ when_tweet_reach_likes: e.target.value, });}} className="themenewCountInput" />
                            <span>Likes</span>
                        </label>
                        <label className="themeNewCheckbox d-flex align-items-center justify-content-start textDark" htmlFor="is_tweets_retweets_tracking_on_checkbox">
                            <input type="checkbox" checked={this.state.is_tweets_retweets_tracking_on} id="is_tweets_retweets_tracking_on_checkbox" onChange={(e) => {this.setState({is_tweets_retweets_tracking_on: e.target.checked,});}}/>
                            <span>A Post received</span>
                            <input id="when_tweet_reach_retweets" onKeyUp={(e) => { this.setState({ when_tweet_reach_retweets: e.target.value,});}} className="themenewCountInput"/>
                            <span>Retweets</span>
                        </label>
                    </div>

                    <div className="mt-4">
                        <button className="btn-theme" onClick={this.onSubmitHandler}>Save</button>
                    </div>
                </div>
            </div>
        );
    }
}
