import React from "react";
import Select from 'react-select'
import HttpClient from "./HttpClient";
import SearchEngineSelect from "./SearchEngineSelect";
import FacebookPagesSelect from "./FacebookPagesSelect";

export default class BitbucketTracking extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isBusy: false,
            errors: "",
            workspaces: [],
        };

        this.fetchWorkspaces = this.fetchWorkspaces.bind(this);
    }

    componentDidMount() {
        this.fetchWorkspaces();
    }

    fetchWorkspaces() {
        /*
        * this function will fetch workspaces for given user
        * */
        this.setState({isBusy: true})
        HttpClient.get('/data-source/get-bitbucket-workspaces').then(resp => {
            console.log(resp);

        }, (err) => {
            this.setState({isBusy: false, errors: (err.response).data});
        }).catch(err => {
            this.setState({isBusy: false, errors: err});
        });
    }

    render() {
        return (
            <div className="switch-wrapper">
                <div className="weather_alert_cities-form">
                    <h4 className="gaa-text-primary">Configure Facebook</h4>
                    <label>Select Facebook Pages</label>


                    <h5 className="gaa-text-primary"><b>Create Annotation When:</b></h5>

                    <div className="mt-2">
                        <div className="form-check">
                            <input className="form-check-input" id='when_new_post_on_facebook' type="checkbox" />
                            <label className="form-check-label" htmlFor="when_new_post_on_facebook">
                                New Post On Facebook Page
                            </label>
                        </div>
                    </div>

                </div>

            </div>
        );
    }
}
