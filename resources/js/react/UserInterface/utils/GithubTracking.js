import React from "react";
import Select from 'react-select'
import HttpClient from "./HttpClient";
import SearchEngineSelect from "./SearchEngineSelect";
import FacebookPagesSelect from "./FacebookPagesSelect";

export default class GithubTracking extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isBusy: false,
            errors: "",
            repositories: [],
            used_credits: 0,
            total_credits: 0,
        };

        this.fetchRepositories = this.fetchRepositories.bind(this);
        this.handleClick = this.handleClick.bind(this)
        this.handleTextChange = this.handleTextChange.bind(this);
    }

    componentDidMount() {
        this.fetchRepositories();
        this.setState({
            used_credits: parseInt(this.props.used_credits),
            total_credits: parseInt(this.props.total_credits)
        });
    }

    fetchRepositories() {
        /*
        * this function will fetch repositories for given user
        * */
        this.setState({ isBusy: true })
        HttpClient.get('/data-source/get-github-repositories').then(resp => {
            this.setState({ isBusy: false, repositories: resp.data })
        }, (err) => {
            this.setState({ isBusy: false, errors: (err.response).data });
        }).catch(err => {
            this.setState({ isBusy: false, errors: err });
        });
    }

    handleClick(e) {
        if (e.target.checked) {
            this.setState({ used_credits: this.state.used_credits + 1 });
            (this.props.onCheckCallback)({ code: 'github_tracking', name: 'Github tracking', value: e.target.name, workspace: e.target.getAttribute("data-username") })
        } else {
            this.setState({ used_credits: this.state.used_credits - 1 });
            (this.props.onUncheckCallback)(e.target.id, 'github_tracking')
        }
    }

    handleTextChange(e, id) {
        let value = e.target.value;
        if (value == '') {
            value = "Annotation Category";
        }
        (this.props.onTextChangeCallback)(id, value);
    }

    render() {
        let repositories = this.state.repositories;
        let userRepositories = this.props.ds_data.map(ds => ds.value);

        return (
            <div className="apps-bodyContent switch-wrapper">
                <div className="weather_alert_cities-form">
                    <h5 className="gaa-text-primary">Github Commits Tracking</h5>
                    <div className="mb-2">
                        <strong>
                            Credits: {this.state.used_credits}/{this.state.total_credits}
                        </strong>
                    </div>
                    <div>
                        <div>
                            <label>
                                <strong>Repositories</strong>
                            </label>
                            <div className="checkbox-box ml-1 mb-2">
                                {
                                    this.state.isBusy
                                        ? <div><i className="fa fa-spinner fa-spin mr-1"></i>We are fetching your account, just a moment</div>
                                        : repositories && repositories.length > 0
                                            ? repositories.map(repository => {
                                                if (repository !== null)
                                                    return (
                                                        <div>
                                                            <div className="form-check country" key={repository.id}>
                                                                <input
                                                                    className="form-check-input"
                                                                    checked={userRepositories.indexOf(repository.name) !== -1}
                                                                    type="checkbox"
                                                                    name={repository.name}
                                                                    data-username={repository.owner.login}
                                                                    id={userRepositories.indexOf(repository.name) !== -1 ? this.props.ds_data[userRepositories.indexOf(repository.name)].id : null}
                                                                    onChange={this.handleClick}
                                                                />
                                                                <label
                                                                    className="form-check-label"
                                                                    htmlFor={userRepositories.indexOf(repository.name) !== -1 ? this.props.ds_data[userRepositories.indexOf(repository.name)].id : null}
                                                                >
                                                                    {repository.full_name}
                                                                </label>
                                                            </div>
                                                            {
                                                                userRepositories.indexOf(repository.name) !== -1 &&
                                                                <div>
                                                                    <input type="text" placeholder="Set category name or Url" defaultValue={this.props.ds_data[userRepositories.indexOf(repository.name)].ds_name} onChange={e => this.handleTextChange(e, this.props.ds_data[userRepositories.indexOf(repository.name)].id)} />
                                                                </div>
                                                            }
                                                        </div>
                                                    )
                                            })
                                            : <span>No repositories found</span>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        );
    }
}
