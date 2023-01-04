import React from "react";
import HttpClient from "./HttpClient";
import Toast from '../utils/Toast';

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
        this.setState({ isBusy: true })
        HttpClient.get('/data-source/get-twitter-tracking-configurations').then(resp => {

            this.setState({
                is_tweets_likes_tracking_on: resp.data.is_tweets_likes_tracking_on,
                when_tweet_reach_likes: resp.data.when_tweet_reach_likes,
                is_tweets_retweets_tracking_on: resp.data.is_tweets_retweets_tracking_on,
                when_tweet_reach_retweets: resp.data.when_tweet_reach_retweets,
            });
            document.getElementById('is_tweets_likes_tracking_on_checkbox').checked = resp.data.is_tweets_likes_tracking_on ?? 0;
            document.getElementById('when_tweet_reach_likes').value = resp.data.when_tweet_reach_likes ?? 0;
            document.getElementById('is_tweets_retweets_tracking_on_checkbox').checked = resp.data.is_tweets_retweets_tracking_on ?? 0;
            document.getElementById('when_tweet_reach_retweets').value = resp.data.when_tweet_reach_retweets ?? 0;

        }, (err) => {
            this.setState({ isBusy: false, errors: (err.response).data });
        }).catch(err => {
            this.setState({ isBusy: false, errors: err });
        });
    }

    onSubmitHandler() {
        let form_data = {
            is_tweets_likes_tracking_on: this.state.is_tweets_likes_tracking_on,
            when_tweet_reach_likes: this.state.when_tweet_reach_likes,
            is_tweets_retweets_tracking_on: this.state.is_tweets_retweets_tracking_on,
            when_tweet_reach_retweets: this.state.when_tweet_reach_retweets,
        }
        HttpClient.post('/data-source/save-twitter-tracking-configurations', form_data).then(resp => {
            Toast.fire({
                icon: 'success',
                title: 'Stored successfully!'
            })
        }, (err) => {
            this.setState({ isBusy: false, errors: (err.response).data });
        }).catch(err => {
            this.setState({ isBusy: false, errors: err });
        });
    }

    render() {
        return (
            <div className="apps-bodyContent switch-wrapper">
                <div className="weather_alert_cities-form">
                    <h4 className="gaa-text-primary">Configure Twitter</h4>
                    <div className="w-100 mb-3">
                        <p>Trigger latest 100 tweets from account timeline</p>
                    </div>

                    <h5 className="gaa-text-primary"><b>Create Annotation When:</b></h5>

                    <div className="mt-2">
                        <div className="form-check">
                            <input className="form-check-input" type="checkbox" checked={this.state.is_tweets_likes_tracking_on}
                                id="is_tweets_likes_tracking_on_checkbox" onChange={(e) => {
                                    this.setState({
                                        is_tweets_likes_tracking_on: e.target.checked
                                    })
                                }} />
                            <label className="form-check-label" htmlFor="is_tweets_likes_tracking_on_checkbox">
                                A Post that raised
                                <input
                                    id="when_tweet_reach_likes"
                                    onKeyUp={(e) => {
                                        this.setState({
                                            when_tweet_reach_likes: e.target.value
                                        })
                                    }}
                                    className="d-inline border m-1 mx-3 text-center p-1 w-25" />
                                Likes
                            </label>
                        </div>
                    </div>

                    <div className="mt-2">
                        <div className="form-check">
                            <input className="form-check-input" type="checkbox" checked={this.state.is_tweets_retweets_tracking_on}
                                id="is_tweets_retweets_tracking_on_checkbox" onChange={(e) => {
                                    this.setState({
                                        is_tweets_retweets_tracking_on: e.target.checked
                                    })
                                }} />
                            <label className="form-check-label" htmlFor="is_tweets_retweets_tracking_on_checkbox">
                                A Post that raised
                                <input
                                    id="when_tweet_reach_retweets"
                                    onKeyUp={(e) => {
                                        this.setState({
                                            when_tweet_reach_retweets: e.target.value
                                        })
                                    }}
                                    className="d-inline border m-1 mx-3 text-center p-1 w-25" />
                                Retweets
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
