import React, {Component} from 'react'
import Toast from "../../../utils/Toast";
import {Redirect} from 'react-router-dom'

import ErrorAlert from '../../../utils/ErrorAlert'
import HttpClient from '../../../utils/HttpClient'
import UserTeamNameSelect from "../../../utils/UserTeamNameSelect";
import SpinningLoader from '../../../utils/SpinningLoader'
import {Button} from 'reactstrap';
import CreatableSelect from "react-select/creatable";
import GoogleAnalyticsPropertySelect from "../../../utils/GoogleAnalyticsPropertySelect";


export default class ShareAnalytics extends Component {
    constructor(props) {
        super(props)

        this.state = {
            form_data: {
                ga_property_id: this.props.ga_property_id,
                user_id: '',
                statistics_padding_days: this.props.statisticsPaddingDays,
                start_date: this.props.start_date,
                end_date: this.props.end_date,
            },
            users: [],
            errors: undefined,
            redirectTo: null,
            ga_property_id: null,

        }
        this.changeHandler = this.changeHandler.bind(this)
        this.submitHandler = this.submitHandler.bind(this)
        this.setDefaultState = this.setDefaultState.bind(this)
        this.getUsers = this.getUsers.bind(this)
    }

    componentDidMount() {
        document.title = 'User Accounts';
        this.setState({ga_property_id: this.props.ga_property_id});
        this.getUsers();
    }

    setDefaultState() {
        this.setState({
            errors: undefined,
            redirectTo: null,
            loading: false
        });
    }


    changeHandler(e) {
        this.setState({form_data: {...this.state.form_data, [e.target.name]: e.target.value}});
    }

    getUsers() {
        HttpClient.get(`/settings/user`)
            // HttpClient.get('/ui/settings/google-analytics-property?keyword=')
            .then(
                (response) => {
                    this.setState({users: response.data.users});
                },
                (err) => {
                    this.setState({errors: err.response.data});
                }
            )
            .catch((err) => {
                this.setState({errors: err});
            });
    }


    submitHandler(e) {
        e.preventDefault();
        this.setState({loading: true});
        HttpClient.post(`/settings/user`, this.state.user)
            .then(response => {
                Toast.fire({
                    icon: 'success',
                    title: "Shared Successfully!",
                });

                this.setState({loading: false}, () => {
                    this.setDefaultState();
                });
                if (!this.props.userStartupConfig) {
                    // this.setState({redirectTo: "/settings/user"})
                    this.props.getUsers();
                    this.props.toggle();
                }
            }, (err) => {
                this.setState({loading: false});
                this.setState({errors: (err.response).data});
            }).catch(err => {
            this.setState({loading: false});
            this.setState({errors: err});
        });
    }

    render() {
        if (this.state.redirectTo) return <Redirect to={this.state.redirectTo}/>
        return (
            <div className="apps-bodyContent">
                <form onSubmit={this.submitHandler} id="create-user-form">
                    <ErrorAlert errors={this.state.errors}/>

                    
                    <div className='grid2layout'>
                        <div className="themeNewInputStyle">
                            <GoogleAnalyticsPropertySelect
                                name="ga_property_id"
                                value={this.state.ga_property_id}
                                onChangeCallback={this.changeHandler}
                                components={{ IndicatorSeparator: () => null }}
                            />
                        </div>
                        <div className="themeNewInputStyle">
                            <select name="user_id"  onChange={this.changeHandler} className={`form-control`} >
                                <option value="">Select User</option>
                                <option value={this.props.user.id} >{this.props.user.name}</option>
                                {
                                    this.state.users.map(gSCS => <option value={gSCS.id} key={gSCS.id}>{gSCS.name}</option>)
                                }
                            </select>
                        </div>
                    </div>

                    <div
                        className={`d-flex ${this.props.userStartupConfig ? 'justify-content-between align-items-center' : 'pt-3'}`}>
                        <button type="submit" disabled={this.state.loading} className="btn-theme"
                                title="submit">{this.state.loading ?
                            <SpinningLoader/> : "Share Report"}</button>
                    </div>
                </form>
            </div>
        )
    }

}
