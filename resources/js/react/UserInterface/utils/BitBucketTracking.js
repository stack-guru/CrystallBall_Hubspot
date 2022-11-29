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
            used_credits: 0,
            total_credits: 0,
        };

        this.fetchWorkspaces = this.fetchWorkspaces.bind(this);
        this.handleClick = this.handleClick.bind(this)
    }

    componentDidMount() {
        this.fetchWorkspaces();
        this.setState({
            used_credits: parseInt(this.props.used_credits),
            total_credits: parseInt(this.props.total_credits)
        });
    }

    fetchWorkspaces() {
        /*
        * this function will fetch workspaces for given user
        * */
        this.setState({ isBusy: true })
        HttpClient.get('/data-source/get-bitbucket-workspaces').then(resp => {
            this.setState({ isBusy: false, workspaces: resp.data })
        }, (err) => {
            this.setState({ isBusy: false, errors: (err.response).data });
        }).catch(err => {
            this.setState({ isBusy: false, errors: err });
        });
    }

    handleClick(e) {
        if (e.target.checked) {
            (this.props.onCheckCallback)({ code: 'bitbucket_tracking', name: 'Bitbucket tracking', value: e.target.name })
        } else {
            (this.props.onUncheckCallback)(e.target.id, 'bitbucket_tracking')
        }
    }

    render() {
        let workspaces = this.state.workspaces;
        let userRepositories = this.props.ds_data.map(ds => ds.value);
        return (
            <div className="switch-wrapper">
                <div className="weather_alert_cities-form">
                    <h5 className="gaa-text-primary">Bitbucket Commits Tracking</h5>
                    <div className="mb-2">
                        <strong>
                            Credits: {this.state.used_credits}/{this.state.total_credits}
                        </strong>
                    </div>
                    <div>
                        {
                            workspaces && workspaces.length > 0
                                ? workspaces.map(workspace => {
                                    if (workspace !== null)
                                        return (
                                            <div key={workspace.uuid}>
                                                <label>
                                                    <strong>{workspace.name} Workspace</strong>
                                                </label>
                                                <div className="checkbox-box ml-1 mb-2">
                                                    {
                                                        workspace.repositories && workspace.repositories.length > 0
                                                            ? workspace.repositories.map(repository => {
                                                                if (repository !== null)
                                                                    return (
                                                                        <div className="form-check country" key={repository.uuid}>
                                                                            <input
                                                                                className="form-check-input"
                                                                                checked={userRepositories.indexOf(repository.slug) !== -1}
                                                                                type="checkbox"
                                                                                name={repository.slug}
                                                                                id={userRepositories.indexOf(repository.slug) !== -1 ? this.props.ds_data[userRepositories.indexOf(repository.slug)].id : null}
                                                                                onChange={this.handleClick}
                                                                            />
                                                                            <label
                                                                                className="form-check-label"
                                                                                htmlFor={userRepositories.indexOf(repository.slug) !== -1 ? this.props.ds_data[userRepositories.indexOf(repository.slug)].id : null}
                                                                            >
                                                                                {repository.name}
                                                                            </label>
                                                                        </div>
                                                                    )
                                                            })
                                                            : <span>No repositories found</span>
                                                    }
                                                </div>
                                            </div>
                                        )
                                })
                                : <span>No workspace found</span>
                        }
                    </div>
                </div>
            </div>


        );
    }
}
