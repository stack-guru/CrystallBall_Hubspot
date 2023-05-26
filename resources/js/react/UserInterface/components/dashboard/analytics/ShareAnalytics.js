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
                user_id: null,
                dashboard_id: null,
                recurrence: null,
                emails: [],
                statistics_padding_days: this.props.statisticsPaddingDays,
                // start_date: this.props.start_date,
                // end_date: this.props.end_date,
            },
            users: [],
            errors: undefined,
            redirectTo: null,
            price_plan: this.props.user.price_plan,
            total_credits : this.props.user.price_plan.external_email == -1 ? 0 : this.props.user.price_plan.external_email

        }
        this.changeHandler = this.changeHandler.bind(this)
        this.submitHandler = this.submitHandler.bind(this)
        this.setDefaultState = this.setDefaultState.bind(this)
        this.getUsers = this.getUsers.bind(this)
        this.addEmail = this.addEmail.bind(this);
        this.deleteEmail = this.deleteEmail.bind(this);
    }

    componentDidMount() {
        document.title = 'User Accounts';
        if(this.props.user.price_plan.external_email == 0)
        {
            this.setState({total_credits: 9999});
        }
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
        console.log(e.target);
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
    addEmail(e) {
        if (document.getElementById("tracking_emails").value) {
            if (
                this.state.total_credits >=  this.state.form_data.emails.length
            ) {
                let emails_new = this.state.form_data.emails;
                emails_new.push({
                    id: "",
                    email: document.getElementById("tracking_emails").value,
                });
                this.setState({form_data: {...this.state.form_data, emails: emails_new}});            
                document.getElementById("tracking_emails").value = "";
            }
            else {
                    this.props.upgradePopup('increase-limits');
                }
        }
    }
    deleteEmail(e) {
        let emails_existing = this.state.form_data.emails;
        const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener("mouseenter", Swal.stopTimer);
                toast.addEventListener("mouseleave", Swal.resumeTimer);
            },
        });
        let new_emails_array = emails_existing.filter(
            (email) => email.email != e.target.dataset.email
        );
        this.setState({form_data: {...this.state.form_data, emails: new_emails_array}});
        Toast.fire({
            icon: "success",
            title: "Deleted successfully!",
        });

    }


    submitHandler(e) {
        e.preventDefault();
        this.setState({loading: true});
        HttpClient.get(`/dashboard/analytics/share-report?dashboard_id=${this.state.form_data.dashboard_id}&recurrence=${this.state.form_data.recurrence}&ga_property_id=${this.state.form_data.ga_property_id}&statistics_padding_days=${this.state.form_data.statistics_padding_days}&user_id=${this.state.form_data.user_id}&emails[]=${this.state.form_data.emails}`)
            .then(response => {
                Toast.fire({
                    icon: 'success',
                    title: "Shared Successfully!",
                });

                this.setState({loading: false}, () => {
                    this.setDefaultState();
                });
                Toast.fire({
                    icon: "success",
                    title: "Report Send Successfully!",
                });
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
                                value={this.state.form_data.ga_property_id}
                                onChangeCallback={this.changeHandler}
                                currentPricePlan={this.state.price_plan}
                                components={{ IndicatorSeparator: () => null }}
                            />
                        </div>
                        
                        <div className="themeNewInputStyle">
                            <select name="dashboard_id"  onChange={this.changeHandler} className={`form-control`} >
                                <option value="">Select Dashboard</option>
                                {
                                    this.props.dashboard_activities.map(gSCS => <option value={gSCS.id} key={gSCS.id}>{gSCS.name}</option>)
                                }
                            </select>
                        </div>
                    </div>
                    <div className="grid2layout">
                        <div className="themeNewInputStyle">
                            <select name="user_id"  onChange={this.changeHandler} className={`form-control`} >
                                <option value="">Select User</option>
                                <option value={this.props.user.id} >{this.props.user.name}</option>
                                {
                                    this.state.users.map(gSCS => <option value={gSCS.id} key={gSCS.id}>{gSCS.name}</option>)
                                }
                            </select>
                        </div>

                        <div className="themeNewInputGroup">
                            <input 
                                type="text" 
                                className="form-control" 
                                placeholder="Add Email" 
                                name="emails" 
                                id="tracking_emails"
                                onKeyUp={(e) => { if (e.key === "Enter") this.addEmail(e) }}
                                />
                            <div className="input-group-append"><a onClick={(e) => {this.addEmail(e);}} href="#"><i className="ti-plus"></i></a></div>

                            {this.state.form_data.emails.length > 0 ?
                                <div className="keywordTags pt-3">
                                    {this.state.form_data.emails.length > 0 ? this.state.form_data.emails.map((email, index) => {
                                        return (
                                                <button type="button" className="keywordTag" key={email.id != "" ? email.id : index} data-email={email.email} data-email_id={email.id} onClick={(e) => {this.deleteEmail(e);}}>{email.email}</button>
                                        );})
                                        : ""
                                    }
                                </div>
                            : null}
                        </div>
                    </div>
                    <div className="grid2layout">
                        <div className="themeNewInputStyle">
                            <select name="recurrence"  onChange={this.changeHandler} className={`form-control`} >
                                <option value="">Set Recurrence</option>
                                <option value="Send Daily">Send Daily</option>
                                <option value="Send Weekly">Send Weekly</option>
                                <option value="Send Every Month">Send Every Month</option>
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
