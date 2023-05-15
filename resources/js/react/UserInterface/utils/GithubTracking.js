import React from "react";
import Select from 'react-select'
import HttpClient from "./HttpClient";
import SearchEngineSelect from "./SearchEngineSelect";
import FacebookPagesSelect from "./FacebookPagesSelect";
import GoogleAnalyticsPropertySelect from "../utils/GoogleAnalyticsPropertySelect";

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
        let usedCredits = this.state.used_credits;
        if (e.target.checked) {
            usedCredits++;
            (this.props.onCheckCallback)({ code: 'github_tracking', name: 'Github tracking', value: e.target.name, workspace: e.target.getAttribute("data-username") })
        } else {
            usedCredits--;
            (this.props.onUncheckCallback)(e.target.id, 'github_tracking')
        }

        let isChecked = false;
        if( usedCredits > 0 ) isChecked = true;

        this.props.updateTrackingStatus(isChecked)
        this.props.updateUserService({ target: {
            name: "is_ds_github_tracking_enabled",
            checked: isChecked,
        }, })

        this.setState({ used_credits: usedCredits })
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
            <div className="apps-bodyContent">
                {/* <label for="ga_property_id">Select Property</label>
                <div className="d-flex align-items-center w-100">
                    <GoogleAnalyticsPropertySelect
                        className="themeNewselect hide-icon"
                        name="ga_property_id"
                        id="ga_property_id"
                        currentPricePlan={this.props.user.price_plan}
                        value={this.props.gaPropertyId}
                        onChangeCallback={(gAP) => {
                            this.props.updateGAPropertyId(gAP.target.value || null)
                        }}
                        placeholder="Select GA Properties"
                        isClearable={true}
                    />
                </div> */}
                <div className='white-box'>
                    {/* <h5 className="textblue mb-4">Github Commits Tracking</h5>
                    <strong className='d-block'>Credits: {this.state.used_credits}/{this.state.total_credits}</strong> */}
                    <strong className='d-block mb-4'>Repositories</strong>
                    <div className="checkBoxList d-flex flex-column">
                        {
                            this.state.isBusy ? <div><i className="fa fa-spinner fa-spin mr-1"></i>We are fetching your account, just a moment</div> : repositories && repositories.length > 0 ?
                            repositories.map(repository => {

                                const dsProperties = this.props.ds_data[userRepositories.indexOf(repository.name)];
                                const gaPropertyName = dsProperties?.ga_property_name ?? "All Properties";
                                if (repository !== null)
                                    return (
                                        <div className="d-flex justify-content-between">
                                            <label className="themeNewCheckbox d-flex align-items-center justify-content-start textDark" htmlFor={userRepositories.indexOf(repository.name) !== -1 ? dsProperties.id : null} key={repository.id}>
                                                <input checked={userRepositories.indexOf(repository.name) !== -1} type="checkbox" name={repository.name} data-username={repository.owner.login} id={userRepositories.indexOf(repository.name) !== -1 ? dsProperties.id : null} onChange={this.handleClick}/>
                                                <span className="d-flex w-100 justify-content-between">
                                                    <div>{repository.full_name}</div>
                                                </span>
                                            </label>

                                        {/*{userRepositories.indexOf(repository.name) !== -1
                                            ?
                                            dsProperties.id === this.state.editSelected
                                                ?
                                                    <div className="d-flex text-nowrap align-items-center">
                                                        <GoogleAnalyticsPropertySelect
                                                            className="w-175px themeNewselect hide-icon"
                                                            name="ga_property_id"
                                                            id="ga_property_id"
                                                            currentPricePlan={this.props.user.price_plan}
                                                            value={this.props.gaPropertyId}
                                                            onChangeCallback={(gAP) => {
                                                                this.setState({ editSelected: '' })
                                                                this.props.userDataSourceUpdateHandler(dsProperties.id, gAP.target.value || null)
                                                            }}
                                                            placeholder="Select GA Properties"
                                                            isClearable={true}
                                                        />
                                                        <i className="ml-2 icon fa" onClick={() => this.setState({ editSelected: null })}>
                                                            <img className="w-14px" src='/close-icon.svg' />
                                                        </i>
                                                    </div>
                                                :
                                                    <div className="d-flex text-nowrap">
                                                        <div className="ellipsis-prop w-150px" title={gaPropertyName}>
                                                            {gaPropertyName}
                                                        </div>
                                                        <i className="ml-2 icon fa" onClick={() => this.setState({ editSelected: dsProperties.id })}>
                                                            <img className="w-20px" src='/icon-edit.svg' />
                                                        </i>
                                                    </div>
                                            :
                                                ''
                                            }*/}
                                        </div>
                                    )
                            }) : <p className='ml-1 pl-1 mb-0'>No repositories found</p>
                        }
                    </div>
                </div>
            </div>
        );
    }
}
