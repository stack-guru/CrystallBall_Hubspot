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
        this.handleClick = this.handleClick.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);
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
            this.setState({ used_credits: this.state.used_credits + 1 });
            (this.props.onCheckCallback)({ code: 'bitbucket_tracking', name: 'Bitbucket tracking', value: e.target.name, workspace: e.target.getAttribute("data-workspace") })
        } else {
            this.setState({ used_credits: this.state.used_credits - 1 });
            (this.props.onUncheckCallback)(e.target.id, 'bitbucket_tracking')
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
        let workspaces = this.state.workspaces;
        let userRepositories = this.props.ds_data.map(ds => ds.value);
        return (
            <div className="apps-bodyContent">
                {/* <div className='white-box'> */}
                    {/* <h5 className="textblue mb-4">Bitbucket Commits Tracking</h5>
                    <strong>Credits: {this.state.used_credits}/{this.state.total_credits}</strong> */}

                    {
                        this.state.isBusy ? <div><i className="fa fa-spinner fa-spin mr-1"></i>We are fetching your account, just a moment</div> : workspaces && workspaces.length > 0 ? workspaces.map(workspace => {
                            if (workspace !== null)
                                return (
                                    <div className='white-box' key={workspace.uuid}>
                                        <h4>{workspace.name} Workspace</h4>
                                        <div className="checkBoxList d-flex flex-column">
                                            {workspace.repositories && workspace.repositories.length > 0 ? workspace.repositories.map(repository => { if (repository !== null)
                                                return (
                                                    <label className="themeNewCheckbox d-flex align-items-center justify-content-start textDark" htmlFor={userRepositories.indexOf(repository.slug) !== -1 ? this.props.ds_data[userRepositories.indexOf(repository.slug)].id : null} key={repository.uuid}>
                                                        <input checked={userRepositories.indexOf(repository.slug) !== -1} type="checkbox" name={repository.slug} data-workspace={workspace.slug} id={userRepositories.indexOf(repository.slug) !== -1 ? this.props.ds_data[userRepositories.indexOf(repository.slug)].id : null} onChange={this.handleClick}/>
                                                        <span>{repository.name}</span>
                                                        {
                                                            userRepositories.indexOf(repository.slug) !== -1 &&
                                                                <input className="themenewCountInput" type="text" placeholder="Set category name or Url" defaultValue={this.props.ds_data[userRepositories.indexOf(repository.slug)].ds_name} onChange={e => this.handleTextChange(e, this.props.ds_data[userRepositories.indexOf(repository.slug)].id)} />

                                                        }
                                                    </label>
                                                )
                                            }) : <p className='ml-1 pl-1 mb-0'>No repositories found</p>}
                                        </div>
                                    </div>
                                )
                        }) : <p className='mb-0 pt-4'>No workspace found</p>
                    }
                {/* </div> */}
            </div>
        );
    }
}
