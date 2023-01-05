import React from "react";
import HttpClient from "./HttpClient";
import Toast from "../utils/Toast";

export default class FacebookTracking extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isBusy: false,
            errors: "",

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
        };
        HttpClient.post(
            "/data-source/save-twitter-tracking-configurations",
            form_data
        )
            .then(
                (resp) => {
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
                    <h4 className="">Create Annotation When</h4>

                    <div className="checkBoxList d-flex flex-column">
                        <label className="themeNewCheckbox d-flex align-items-center justify-content-start textDark" htmlFor="is_tweets_likes_tracking_on_checkbox">
                            <input type="checkbox" checked={ this.state.is_tweets_likes_tracking_on } id="is_tweets_likes_tracking_on_checkbox" onChange={(e) => {this.setState({is_tweets_likes_tracking_on: e.target.checked,});}}/>
                            <span>A Post that raised</span>
                            <input id="when_tweet_reach_likes" onKeyUp={(e) => {this.setState({ when_tweet_reach_likes: e.target.value, });}} className="themenewCountInput" />
                            <span>Likes</span>
                        </label>
                        <label className="themeNewCheckbox d-flex align-items-center justify-content-start textDark" htmlFor="is_tweets_retweets_tracking_on_checkbox">
                            <input type="checkbox" checked={this.state.is_tweets_retweets_tracking_on} id="is_tweets_retweets_tracking_on_checkbox" onChange={(e) => {this.setState({is_tweets_retweets_tracking_on: e.target.checked,});}}/>
                            <span>A Post that raised</span>
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
