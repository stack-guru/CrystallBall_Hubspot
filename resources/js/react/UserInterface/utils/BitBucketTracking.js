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
        this.setState({ isBusy: true })
        HttpClient.get('/data-source/get-bitbucket-workspaces').then(resp => {
            this.setState({ isBusy: false, workspaces: resp.data.values })
        }, (err) => {
            this.setState({ isBusy: false, errors: (err.response).data });
        }).catch(err => {
            this.setState({ isBusy: false, errors: err });
        });
    }

    render() {
        let workspaces = this.state.workspaces;
        return (
            <div className="switch-wrapper">
                <div className="weather_alert_cities-form">
                    <h4 className="gaa-text-primary">Bitbucket Workspaces</h4>
                    <label>Select Workspaces</label>

                    {
                        workspaces
                            ? workspaces.map(workspace => {
                                if (workspace !== null)
                                    return (
                                        <div className="form-check country" key={workspace.uuid}>
                                            <input
                                                className="form-check-input"
                                                checked={workspace.is_private}
                                                type="checkbox"
                                                name={workspace.slug}
                                                id={workspace.uuid}
                                            />
                                            <label
                                                className="form-check-label"
                                                htmlFor="defaultCheck1"
                                            >
                                                {workspace.name}
                                            </label>
                                        </div>
                                    )
                            })
                            : <span>No workspace found</span>
                    }

                </div>

            </div>
        );
    }
}
